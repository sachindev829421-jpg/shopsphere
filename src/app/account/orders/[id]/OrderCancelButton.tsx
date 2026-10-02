"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OrderCancelButton({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm(`Are you sure you want to cancel order #${orderNumber}?`)) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "CANCELLED" }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to cancel order");
        return;
      }

      toast.success("Order has been cancelled successfully");
      router.refresh();
    } catch {
      toast.error("Error cancelling order");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isCancelling}
      className="px-4 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
    >
      {isCancelling ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}
