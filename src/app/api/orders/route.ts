import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);

    const isAdminView = searchParams.get("admin") === "true" && user.role === "ADMIN";
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!isAdminView) {
      where.userId = user.id;
    }
    if (status && status !== "ALL") {
      where.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: true,
          payments: { select: { id: true, status: true, method: true, amount: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const formatted = orders.map((o) => {
      let shippingAddress = {};
      let billingAddress = {};
      try {
        shippingAddress = JSON.parse(o.shippingAddress);
      } catch {}
      try {
        billingAddress = JSON.parse(o.billingAddress);
      } catch {}

      return {
        ...o,
        shippingAddress,
        billingAddress,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      orders: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please log in to view orders" }, { status: 401 });
    }
    console.error("Orders list error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
