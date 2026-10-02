import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { ArrowRight, ShoppingBag, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Order Fulfillment</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch milestones, logistics tracking, payments verification and customer invoices.
          </p>
        </div>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          {orders.length} Total Orders
        </span>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-white">{ord.orderNumber}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-white">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-500">{ord.customerEmail}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{formatDate(ord.createdAt)}</td>
                  <td className="py-4 px-4">{ord.items.length} items</td>
                  <td className="py-4 px-4 font-bold text-white">{formatPrice(ord.total)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        ord.paymentStatus === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {ord.paymentStatus} ({ord.paymentMethod})
                    </span>
                  </td>
                  <td className="py-4 px-4">
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
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold text-xs rounded-xl transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
