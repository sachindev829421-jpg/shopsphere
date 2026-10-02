import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: "APPROVED",
      },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const parsed = reviews.map((r) => {
      let images: string[] = [];
      try {
        images = JSON.parse(r.images);
      } catch {}
      return {
        ...r,
        images,
        createdAt: r.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ reviews: parsed });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const { productId, rating, title, comment, images } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating)));

    // Check if the user purchased this product
    const orderWithProduct = await prisma.order.findFirst({
      where: {
        userId: user.id,
        items: {
          some: { productId },
        },
      },
    });

    const isVerifiedPurchase = Boolean(orderWithProduct);

    // If requirement specifies: "Only verified purchasers should be allowed to submit reviews"
    if (!isVerifiedPurchase && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only verified purchasers of this product can submit a review." },
        { status: 403 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        orderId: orderWithProduct ? orderWithProduct.id : null,
        rating: numericRating,
        title,
        comment,
        images: JSON.stringify(images || []),
        isVerifiedPurchase,
        status: "APPROVED",
      },
    });

    // Recalculate product overall rating and reviewCount
    const aggregates = await prisma.review.aggregate({
      where: { productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round((aggregates._avg.rating || 0) * 10) / 10,
        reviewCount: aggregates._count.rating,
      },
    });

    return NextResponse.json({
      message: "Review submitted successfully",
      review: {
        ...review,
        createdAt: review.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }
    console.error("Submit review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
