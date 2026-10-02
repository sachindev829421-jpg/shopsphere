import Link from "next/link";
import Image from "next/image";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
    },
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track, return, or review past purchases.</p>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-slate-400 space-y-3">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No orders placed yet</p>
          <p className="text-xs text-slate-500">Your shopping history will appear here once you place an order.</p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400">Order Placed: </span>
                  <strong className="text-slate-800">{formatDate(ord.createdAt)}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Order ID: </span>
                  <strong className="font-mono text-slate-800">{ord.orderNumber}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      ord.orderStatus === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : ord.orderStatus === "CANCELLED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      ord.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {ord.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {ord.items.map((it) => (
                    <div
                      key={it.id}
                      className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden relative shrink-0 border border-slate-100"
                      title={it.productName}
                    >
                      <Image
                        src={it.productImage || "/placeholder.png"}
                        alt={it.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <div className="text-xs text-slate-500 pl-1">
                    <p className="font-semibold text-slate-800">
                      {ord.items[0]?.productName}
                      {ord.items.length > 1 && ` + ${ord.items.length - 1} more`}
                    </p>
                    <p className="text-[11px] text-slate-400">Total Items: {ord.items.reduce((s, i) => s + i.quantity, 0)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">Total Amount</p>
                    <p className="text-base font-extrabold text-slate-900">{formatPrice(ord.total)}</p>
                  </div>
                  <Link
                    href={`/account/orders/${ord.orderNumber}`}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs rounded-xl transition-all"
                  >
                    View Details & Track
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
