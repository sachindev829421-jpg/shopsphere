import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status },
      include: { product: true },
    });

    // Recalculate product rating
    const aggregates = await prisma.review.aggregate({
      where: { productId: review.productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round((aggregates._avg.rating || 0) * 10) / 10,
        reviewCount: aggregates._count.rating,
      },
    });

    return NextResponse.json({ message: "Review status updated", review });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const review = await prisma.review.delete({ where: { id } });

    // Recalculate product rating
    const aggregates = await prisma.review.aggregate({
      where: { productId: review.productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round((aggregates._avg.rating || 0) * 10) / 10,
        reviewCount: aggregates._count.rating,
      },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
