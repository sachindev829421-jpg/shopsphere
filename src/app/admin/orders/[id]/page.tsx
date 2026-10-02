import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { ArrowLeft, MapPin, CreditCard, Package } from "lucide-react";
import AdminOrderStatusUpdater from "./AdminOrderStatusUpdater";

interface AdminOrderDetailProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: {
      items: true,
      payments: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) {
    notFound();
  }

  let shippingAddress: any = {};
  let billingAddress: any = {};
  try { shippingAddress = JSON.parse(order.shippingAddress); } catch {}
  try { billingAddress = JSON.parse(order.billingAddress); } catch {}

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      {/* Status Updater Widget */}
      <AdminOrderStatusUpdater
        orderId={order.id}
        initialStatus={order.orderStatus}
        initialTracking={order.trackingNumber || ""}
        initialPaymentStatus={order.paymentStatus}
      />

      {/* Ordered Items Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>Items Ordered ({order.items.length})</span>
        </h2>

        <div className="divide-y divide-slate-800/60 text-xs">
          {order.items.map((it) => (
            <div key={it.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-950 rounded-xl overflow-hidden relative shrink-0 border border-slate-800">
                  <Image
                    src={it.productImage || "/placeholder.png"}
                    alt={it.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">{it.productName}</p>
                  {it.variantName && (
                    <p className="text-[11px] text-slate-400">Variant: {it.variantName}</p>
                  )}
                  <p className="text-[10px] text-slate-500 font-mono">
                    SKU: {it.sku || "N/A"} • Qty: {it.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-white text-sm">{formatPrice(it.total)}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-white">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Discount ({order.couponCode || "Coupon"}):</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-semibold text-white">{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST Tax (18%):</span>
            <span className="font-semibold text-white">{formatPrice(order.tax)}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
            <span>Final Paid Total:</span>
            <span className="text-indigo-400 font-extrabold text-base">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Customer & Address Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-2 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Shipping Destination</span>
          </h3>
          <p className="font-bold text-white text-sm">{shippingAddress.name}</p>
          <p className="text-slate-400">{shippingAddress.street}</p>
          {shippingAddress.apartment && <p className="text-slate-400">{shippingAddress.apartment}</p>}
          <p className="text-slate-400">
            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
          </p>
          <p className="text-slate-300 pt-1">Phone: {shippingAddress.phone}</p>
          {order.notes && (
            <p className="text-amber-400 pt-2 border-t border-slate-800">
              Customer Note: &quot;{order.notes}&quot;
            </p>
          )}
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-2 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" />
            <span>Payment & Gateway Info</span>
          </h3>
          <div className="flex justify-between text-slate-400">
            <span>Method:</span>
            <span className="font-bold text-white">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay Online"}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Payment Status:</span>
            <span className="font-bold text-emerald-400">{order.paymentStatus}</span>
          </div>
          {order.razorpayOrderId && (
            <div className="flex justify-between text-slate-400">
              <span>Razorpay Order ID:</span>
              <span className="font-mono text-slate-300">{order.razorpayOrderId}</span>
            </div>
          )}
          {order.razorpayPaymentId && (
            <div className="flex justify-between text-slate-400">
              <span>Razorpay Payment ID:</span>
              <span className="font-mono text-slate-300">{order.razorpayPaymentId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
