import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, orderAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
    }

    // Check expiration
    if (coupon.endDate && coupon.endDate < new Date()) {
      return NextResponse.json({ error: "This coupon code has expired" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its maximum usage limit" }, { status: 400 });
    }

    // Check minimum order value
    const amount = parseFloat(orderAmount) || 0;
    if (amount < coupon.minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value of ₹${coupon.minOrderValue} required to use coupon "${coupon.code}"`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
      },
      discountAmount: Math.min(discount, amount),
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
