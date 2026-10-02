import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, verifyPassword, hashPassword } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations/auth";

export async function GET() {
  try {
    const authUser = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true, addresses: true, reviews: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authUser = await requireAuth();
    const body = await req.json();

    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, phone, currentPassword, newPassword } = result.data;
    const user = await prisma.user.findUnique({ where: { id: authUser.id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = { name, phone: phone || null };

    // If changing password, verify current password first
    if (newPassword && newPassword.length >= 6) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }
      const isMatch = await verifyPassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password does not match" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
