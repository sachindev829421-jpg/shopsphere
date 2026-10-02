import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrdersCount,
      revenueAggregate,
      recentOrders,
      recentCustomers,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          items: { take: 2 },
        },
      }),
      prisma.user.findMany({
        take: 5,
        where: { role: "CUSTOMER" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.product.findMany({
        where: {
          stockQuantity: { lte: 5 },
          isActive: true,
        },
        take: 6,
        select: {
          id: true,
          name: true,
          sku: true,
          brand: true,
          price: true,
          stockQuantity: true,
          lowStockThreshold: true,
        },
      }),
    ]);

    // Monthly orders & revenue aggregate for chart
    const allPaidOrders = await prisma.order.findMany({
      where: { paymentStatus: "PAID" },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const monthlySales: Record<string, number> = {};
    for (const o of allPaidOrders) {
      const monthYear = new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" }).format(
        new Date(o.createdAt)
      );
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + o.total;
    }

    const salesChart = Object.entries(monthlySales).map(([month, amount]) => ({
      month,
      amount: Math.round(amount),
    }));

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round((revenueAggregate._sum.total || 0) * 100) / 100,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrdersCount,
      },
      salesChart,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
      })),
      recentCustomers: recentCustomers.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
      lowStockProducts,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
