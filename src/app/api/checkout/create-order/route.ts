import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { createRazorpayOrder } from "@/lib/razorpay";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const body = await req.json();

    const {
      items,
      shippingAddress,
      billingAddress,
      couponCode,
      paymentMethod = "RAZORPAY",
      notes,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.street || !shippingAddress.city) {
      return NextResponse.json({ error: "Complete shipping address is required" }, { status: 400 });
    }

    // 1. Verify all products and variants from database directly to protect against price and stock manipulation
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

      if (!dbProduct || !dbProduct.isActive) {
        return NextResponse.json(
          { error: `Product "${item.name || item.productId}" is no longer available` },
          { status: 400 }
        );
      }

      let price = dbProduct.price;
      let sku = dbProduct.sku;
      let variantName: string | null = null;
      let maxStock = dbProduct.stockQuantity;

      if (item.variantId) {
        const variant = dbProduct.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json(
            { error: `Variant for "${dbProduct.name}" not found` },
            { status: 400 }
          );
        }
        if (variant.price) price = variant.price;
        sku = variant.sku;
        variantName = variant.name;
        maxStock = variant.stockQuantity;
      }

      if (item.quantity > maxStock) {
        return NextResponse.json(
          {
            error: `Only ${maxStock} units of "${dbProduct.name}${variantName ? ` (${variantName})` : ""}" are in stock`,
          },
          { status: 400 }
        );
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

    // 2. Validate Coupon and calculate discount on server
    let discount = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (coupon && coupon.isActive && (!coupon.endDate || coupon.endDate >= new Date())) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (subtotal >= coupon.minOrderValue) {
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
      }
    }

    // 3. Shipping and Tax calculation
    const shipping = subtotal >= 999 || couponCode === "FREESHIP" ? 0 : 99;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.18 * 100) / 100; // 18% GST
    const finalTotal = Math.round((subtotal - discount + shipping + tax) * 100) / 100;

    const orderNumber = `SS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 4. Handle Cash on Delivery (COD) directly
    if (paymentMethod === "COD") {
      const order = await prisma.$transaction(async (tx) => {
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

        // Increment coupon count if used
        if (appliedCoupon) {
          await tx.coupon.update({
            where: { id: appliedCoupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }

        // Create Order
        const created = await tx.order.create({
          data: {
            orderNumber,
            userId: user?.id || null,
            customerName: shippingAddress.name,
            customerEmail: user?.email || shippingAddress.email || "guest@shopsphere.in",
            customerPhone: shippingAddress.phone,
            subtotal,
            discount,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            tax,
            shipping,
            total: finalTotal,
            paymentStatus: "PENDING",
            paymentMethod: "COD",
            orderStatus: "PROCESSING",
            shippingAddress: JSON.stringify(shippingAddress),
            billingAddress: JSON.stringify(billingAddress || shippingAddress),
            notes: notes || null,
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
                status: "PENDING",
                method: "COD",
              },
            },
          },
        });

        if (appliedCoupon && user?.id) {
          await tx.couponUsage.create({
            data: {
              couponId: appliedCoupon.id,
              userId: user.id,
              orderId: created.id,
            },
          });
        }

        return created;
      });

      sendOrderConfirmationEmail(
        order.customerEmail,
        order.orderNumber,
        order.total,
        validatedItems.map((it) => ({
          name: it.productName,
          quantity: it.quantity,
          price: it.price,
        }))
      ).catch((err) => console.error("Email error:", err));

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: "COD",
      });
    }

    // 5. Razorpay Online Payment Flow: create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amountInRupees: finalTotal,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        orderNumber,
        customerName: shippingAddress.name,
        customerPhone: shippingAddress.phone,
      },
    });

    return NextResponse.json({
      success: true,
      paymentMethod: "RAZORPAY",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency,
      orderNumber,
      subtotal,
      discount,
      shipping,
      tax,
      total: finalTotal,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_test_shopsphere_mock_id",
    });
  } catch (error) {
    console.error("Checkout order creation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate order checkout" },
      { status: 500 }
    );
  }
}
