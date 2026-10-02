import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { usages: true } },
      },
    });
    return NextResponse.json({ coupons });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      endDate,
      usageLimit,
      isActive,
    } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: "Code and discount value are required" }, { status: 400 });
    }

    const upperCode = code.toUpperCase().trim();
    const existing = await prisma.coupon.findUnique({ where: { code: upperCode } });
    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: upperCode,
        description: description || null,
        discountType: discountType || "PERCENTAGE",
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        endDate: endDate ? new Date(endDate) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ message: "Coupon created", coupon }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
