import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await req.json();
    const { name, description, image, parentId, featured } = body;

    const data: any = {};
    if (name) {
      data.name = name;
      data.slug = slugify(name);
    }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (parentId !== undefined) data.parentId = parentId;
    if (featured !== undefined) data.featured = Boolean(featured);

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({ message: "Category updated", category });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category: it has ${productCount} active products. Reassign or delete them first.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
