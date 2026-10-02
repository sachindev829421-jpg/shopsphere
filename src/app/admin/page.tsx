import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    pendingOrdersCount,
    revenueAggregate,
    recentOrders,
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
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
    prisma.product.findMany({
      where: {
        stockQuantity: { lte: 5 },
        isActive: true,
      },
      take: 5,
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

  const totalRevenue = revenueAggregate._sum.total || 0;

  const kpis = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      desc: "Gross realized earnings",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Orders Placed",
      value: totalOrders.toString(),
      desc: `${pendingOrdersCount} awaiting shipment`,
      icon: ShoppingBag,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      desc: "Registered Indian buyers",
      icon: Users,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      title: "Catalog Products",
      value: totalProducts.toString(),
      desc: `${lowStockProducts.length} low stock warnings`,
      icon: Package,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Store performance metrics, financial revenue, inventory alerts, and fulfillment queues.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.title}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {k.title}
                </span>
                <div className={`p-2 rounded-xl ${k.bg} ${k.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{k.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{k.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <span>Recent Orders</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {ord.customerEmail}
                      </p>
                    </td>
                    <td className="py-3">{ord.items.length} items</td>
                    <td className="py-3 font-bold text-white">{formatPrice(ord.total)}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                          ord.orderStatus === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : ord.orderStatus === "CANCELLED"
                            ? "bg-rose-500/10 text-rose-400"
                            : "bg-indigo-500/10 text-indigo-400"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs font-semibold text-indigo-400 hover:underline"
                      >
                        Fulfill
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Stock Alerts</span>
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Catalog
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              All inventory levels healthy. No low stock warnings.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{p.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        p.stockQuantity === 0
                          ? "bg-rose-500/10 text-rose-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {p.stockQuantity === 0 ? "Out of Stock" : `${p.stockQuantity} left`}
                    </span>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="block text-[10px] text-indigo-400 hover:underline mt-1"
                    >
                      Update Stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
