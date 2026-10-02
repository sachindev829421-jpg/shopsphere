"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrderStatusUpdater({
  orderId,
  initialStatus,
  initialTracking,
  initialPaymentStatus,
}: {
  orderId: string;
  initialStatus: string;
  initialTracking: string;
  initialPaymentStatus: string;
}) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus,
          trackingNumber,
          paymentStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update status");
        return;
      }

      toast.success("Order status and tracking updated successfully!");
      router.refresh();
    } catch {
      toast.error("Error updating order");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Update Fulfillment & Logistics
        </h2>
        <span className="text-[11px] text-slate-500">
          Updating status automatically dispatches notification emails to customer.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
            Order Status
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
            Tracking Number / AWB
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. DELHIVERY-998241"
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isUpdating}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isUpdating ? "Saving..." : "Save Fulfillment Milestone"}</span>
        </button>
      </div>
    </form>
  );
}
