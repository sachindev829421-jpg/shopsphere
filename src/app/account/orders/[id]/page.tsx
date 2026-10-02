import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDateTime } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import OrderCancelButton from "./OrderCancelButton";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderNumber: id }],
    },
    include: {
      items: true,
      payments: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Security check: order must belong to user or user is admin
  if (order.userId && order.userId !== user.id && user.role !== "ADMIN") {
    redirect("/account/orders");
  }

  let shippingAddress: any = {};
  let billingAddress: any = {};
  try { shippingAddress = JSON.parse(order.shippingAddress); } catch {}
  try { billingAddress = JSON.parse(order.billingAddress); } catch {}

  const steps = [
    { key: "PENDING", label: "Order Placed", icon: Clock },
    { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
    { key: "PROCESSING", label: "Processing & Packed", icon: Package },
    { key: "SHIPPED", label: "Shipped", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case "PENDING": return 0;
      case "CONFIRMED": return 1;
      case "PROCESSING": return 2;
      case "SHIPPED":
      case "OUT_FOR_DELIVERY": return 3;
      case "DELIVERED": return 4;
      default: return -1;
    }
  };

  const currentStep = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus === "CANCELLED";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                order.orderStatus === "DELIVERED"
                  ? "bg-emerald-100 text-emerald-800"
                  : isCancelled
                  ? "bg-rose-100 text-rose-800"
                  : "bg-indigo-100 text-indigo-800"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
        </div>

        {/* Cancellation action if eligible */}
        {!isCancelled && order.orderStatus !== "DELIVERED" && order.orderStatus !== "SHIPPED" && (
          <OrderCancelButton orderId={order.id} orderNumber={order.orderNumber} />
        )}
      </div>

      {/* Live Tracking Timeline */}
      {isCancelled ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>This order was cancelled. Any processed payment will be refunded within 3-5 working days.</span>
        </div>
      ) : (
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Delivery Status</h3>
            {order.trackingNumber && (
              <span className="text-xs text-slate-500">
                AWB Tracking: <strong className="font-mono text-slate-900">{order.trackingNumber}</strong>
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-between pt-2">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((st, idx) => {
              const isPassed = idx <= currentStep;
              const isCurrent = idx === currentStep;
              const Icon = st.icon;

              return (
                <div key={st.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md"
                        : isPassed
                        ? "bg-indigo-600 text-white"
                        : "bg-white border-2 border-slate-300 text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-bold uppercase tracking-wider hidden sm:block ${
                      isCurrent
                        ? "text-indigo-600"
                        : isPassed
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ordered Items Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Items Ordered</h3>
        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden relative shrink-0 border border-slate-100">
                  <Image
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.productName}</h4>
                  {item.variantName && (
                    <p className="text-xs text-slate-500">Variant: {item.variantName}</p>
                  )}
                  <p className="text-xs text-slate-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{formatPrice(item.total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Addresses & Payment Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        {/* Shipping details */}
        <div className="p-5 bg-slate-50 rounded-2xl space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Delivery Destination</span>
          </h4>
          <p className="font-semibold text-slate-800">{shippingAddress.name}</p>
          <p className="text-slate-600">{shippingAddress.street}</p>
          {shippingAddress.apartment && <p className="text-slate-600">{shippingAddress.apartment}</p>}
          <p className="text-slate-600">
            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
          </p>
          <p className="text-slate-500 pt-1">Phone: {shippingAddress.phone}</p>
        </div>

        {/* Cost & Payment Details */}
        <div className="p-5 bg-slate-50 rounded-2xl space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Payment Summary</span>
          </h4>
          <div className="flex justify-between text-slate-600">
            <span>Payment Method:</span>
            <strong className="text-slate-900">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay Online"}</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Status:</span>
            <strong className="text-emerald-700">{order.paymentStatus}</strong>
          </div>
          {order.razorpayPaymentId && (
            <div className="flex justify-between text-slate-600">
              <span>Transaction Ref:</span>
              <strong className="font-mono text-slate-800">{order.razorpayPaymentId}</strong>
            </div>
          )}
          <div className="border-t border-slate-200 my-1 pt-1 flex justify-between font-bold text-sm text-slate-900">
            <span>Total Paid:</span>
            <span className="text-indigo-600 font-extrabold">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
