import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
        reviews: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, image: true } },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let tags: string[] = [];
    let specifications: Record<string, string> = {};
    let sizes: string[] = [];
    let colors: string[] = [];

    try {
      tags = JSON.parse(product.tags || "[]");
    } catch {}
    try {
      specifications = JSON.parse(product.specifications || "{}");
    } catch {}
    try {
      sizes = JSON.parse(product.sizes || "[]");
    } catch {}
    try {
      colors = JSON.parse(product.colors || "[]");
    } catch {}

    const parsedProduct = {
      ...product,
      tags,
      specifications,
      sizes,
      colors,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (error) {
    console.error("Product get error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await req.json();

    const {
      name,
      brand,
      categoryId,
      subcategory,
      shortDescription,
      description,
      price,
      compareAtPrice,
      discount,
      stockQuantity,
      lowStockThreshold,
      isActive,
      isFeatured,
      isBestSeller,
      tags,
      specifications,
      sizes,
      colors,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(brand && { brand }),
        ...(categoryId && { categoryId }),
        ...(subcategory !== undefined && { subcategory }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(compareAtPrice !== undefined && {
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        }),
        ...(discount !== undefined && { discount: parseInt(discount) }),
        ...(stockQuantity !== undefined && { stockQuantity: parseInt(stockQuantity) }),
        ...(lowStockThreshold !== undefined && {
          lowStockThreshold: parseInt(lowStockThreshold),
        }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isBestSeller !== undefined && { isBestSeller: Boolean(isBestSeller) }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(specifications !== undefined && {
          specifications: JSON.stringify(specifications),
        }),
        ...(sizes !== undefined && { sizes: JSON.stringify(sizes) }),
        ...(colors !== undefined && { colors: JSON.stringify(colors) }),
      },
    });

    return NextResponse.json({ message: "Product updated successfully", product: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
