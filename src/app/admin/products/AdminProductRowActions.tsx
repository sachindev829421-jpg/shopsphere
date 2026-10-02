"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Power } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductRowActions({
  productId,
  productName,
  isActive,
}: {
  productId: string;
  productName: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !active }),
      });
      if (res.ok) {
        setActive(!active);
        toast.success(`Product ${!active ? "activated" : "deactivated"}`);
        router.refresh();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${productName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={handleToggleActive}
        disabled={isLoading}
        title={active ? "Deactivate Product" : "Activate Product"}
        className={`p-1.5 rounded-lg border transition-colors ${
          active
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            : "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
        }`}
      >
        <Power className="w-3.5 h-3.5" />
      </button>

      <Link
        href={`/admin/products/${productId}/edit`}
        title="Edit Product"
        className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
      >
        <Edit className="w-3.5 h-3.5" />
      </Link>

      <button
        onClick={handleDelete}
        title="Delete Product"
        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
