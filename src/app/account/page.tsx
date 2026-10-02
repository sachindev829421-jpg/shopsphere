import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [orderCount, addressCount, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.address.count({ where: { userId: user.id } }),
    prisma.order.findMany({
      where: { userId: user.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-xs text-slate-300">
            Member of ShopSphere India • {user.email}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{orderCount}</p>
            <p className="text-xs text-slate-500 font-semibold">Total Orders</p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{addressCount}</p>
            <p className="text-xs text-slate-500 font-semibold">Saved Addresses</p>
          </div>
        </Link>

        <Link
          href="/account/wishlist"
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">Saved</p>
            <p className="text-xs text-slate-500 font-semibold">Wishlist Items</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <p>You have not placed any orders yet.</p>
            <Link href="/products" className="inline-block mt-3 font-bold text-indigo-600">
              Browse products now →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{ord.orderNumber}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on {formatDate(ord.createdAt)} • {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900 text-sm">{formatPrice(ord.total)}</span>
                  <Link
                    href={`/account/orders/${ord.orderNumber}`}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
