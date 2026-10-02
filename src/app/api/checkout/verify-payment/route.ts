import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const body = await req.json();

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderNumber,
      items,
      shippingAddress,
      billingAddress,
      couponCode,
      notes,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Payment verification credentials missing" },
        { status: 400 }
      );
    }

    // 1. Server-side Cryptographic Verification
    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Payment signature verification failed. Untrusted payment." },
        { status: 400 }
      );
    }

    // 2. Recalculate and validate prices from DB to strictly prevent tampering
    let subtotal = 0;
    const validatedItems: Array<{
      productId: string;
      variantId?: string | null;
      productName: string;
      productImage?: string | null;
      variantName?: string | null;
      sku: string;
      quantity: number;
      price: number;
      total: number;
    }> = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { orderBy: { order: "asc" } }, variants: true },
      });

      if (!dbProduct) continue;

      let price = dbProduct.price;
      let sku = dbProduct.sku;
      let variantName: string | null = null;

      if (item.variantId) {
        const variant = dbProduct.variants.find((v) => v.id === item.variantId);
        if (variant) {
          if (variant.price) price = variant.price;
          sku = variant.sku;
          variantName = variant.name;
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: dbProduct.id,
        variantId: item.variantId || null,
        productName: dbProduct.name,
        productImage: dbProduct.images[0]?.url || null,
        variantName,
        sku,
        quantity: item.quantity,
        price,
        total: itemTotal,
      });
    }

    let discount = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (coupon && coupon.isActive) {
        appliedCoupon = coupon;
        if (coupon.discountType === "PERCENTAGE") {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        discount = Math.min(discount, subtotal);
      }
    }

    const shipping = subtotal >= 999 || couponCode === "FREESHIP" ? 0 : 99;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.18 * 100) / 100;
    const finalTotal = Math.round((subtotal - discount + shipping + tax) * 100) / 100;

    const actualOrderNumber =
      orderNumber || `SS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Atomically persist order, payment and decrement stock
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const it of validatedItems) {
        if (it.variantId) {
          await tx.productVariant.update({
            where: { id: it.variantId },
            data: { stockQuantity: { decrement: it.quantity } },
          });
        }
        await tx.product.update({
          where: { id: it.productId },
          data: { stockQuantity: { decrement: it.quantity } },
        });
      }

      // Update coupon usage
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      const order = await tx.order.create({
        data: {
          orderNumber: actualOrderNumber,
          userId: user?.id || null,
          customerName: shippingAddress.name,
          customerEmail: user?.email || shippingAddress.email || "customer@shopsphere.in",
          customerPhone: shippingAddress.phone,
          subtotal,
          discount,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          tax,
          shipping,
          total: finalTotal,
          paymentStatus: "PAID",
          paymentMethod: "RAZORPAY",
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          orderStatus: "CONFIRMED",
          shippingAddress: JSON.stringify(shippingAddress),
          billingAddress: JSON.stringify(billingAddress || shippingAddress),
          notes: notes || null,
          estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          items: {
            create: validatedItems.map((v) => ({
              productId: v.productId,
              variantId: v.variantId,
              productName: v.productName,
              productImage: v.productImage,
              variantName: v.variantName,
              sku: v.sku,
              quantity: v.quantity,
              price: v.price,
              total: v.total,
            })),
          },
          payments: {
            create: {
              amount: finalTotal,
              currency: "INR",
              status: "SUCCESS",
              method: "RAZORPAY",
              razorpayOrderId,
              razorpayPaymentId,
              razorpaySignature,
            },
          },
        },
      });

      if (appliedCoupon && user?.id) {
        await tx.couponUsage.create({
          data: {
            couponId: appliedCoupon.id,
            userId: user.id,
            orderId: order.id,
          },
        });
      }

      return order;
    });

    // Send confirmation email
    sendOrderConfirmationEmail(
      createdOrder.customerEmail,
      createdOrder.orderNumber,
      createdOrder.total,
      validatedItems.map((it) => ({
        name: it.productName,
        quantity: it.quantity,
        price: it.price,
      }))
    ).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      total: createdOrder.total,
    });
  } catch (error) {
    console.error("Payment verification route error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
