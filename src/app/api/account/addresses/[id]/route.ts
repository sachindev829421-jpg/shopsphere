import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.phone && { phone: body.phone }),
        ...(body.street && { street: body.street }),
        ...(body.apartment !== undefined && { apartment: body.apartment }),
        ...(body.city && { city: body.city }),
        ...(body.state && { state: body.state }),
        ...(body.postalCode && { postalCode: body.postalCode }),
        ...(body.country && { country: body.country }),
        ...(body.isDefault !== undefined && { isDefault: Boolean(body.isDefault) }),
        ...(body.type && { type: body.type }),
      },
    });

    return NextResponse.json({ message: "Address updated successfully", address: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
