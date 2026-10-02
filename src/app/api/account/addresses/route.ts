import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { addressSchema } from "@/lib/validations/checkout";

export async function GET() {
  try {
    const user = await requireAuth();
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ addresses });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const result = addressSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, phone, street, apartment, city, state, postalCode, country, isDefault, type } =
      result.data;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name,
        phone,
        street,
        apartment: apartment || null,
        city,
        state,
        postalCode,
        country: country || "India",
        isDefault: Boolean(isDefault),
        type,
      },
    });

    return NextResponse.json({ message: "Address added successfully", address }, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create address error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
