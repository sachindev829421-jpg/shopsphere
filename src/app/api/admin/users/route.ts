import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { orders: true, reviews: true },
        },
        orders: {
          where: { paymentStatus: "PAID" },
          select: { total: true },
        },
      },
    });

    const formatted = users.map((u) => {
      const totalSpent = u.orders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        orderCount: u._count.orders,
        reviewCount: u._count.reviews,
        totalSpent: Math.round(totalSpent * 100) / 100,
      };
    });

    return NextResponse.json({ users: formatted });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin();
    const { userId, role, isActive } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent admin from deactivating or demoting themselves
    if (userId === admin.id && (isActive === false || role === "CUSTOMER")) {
      return NextResponse.json(
        { error: "You cannot demote or deactivate your own admin account" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (role && (role === "CUSTOMER" || role === "ADMIN")) data.role = role;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
