"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, CheckCircle, XCircle, Trash2, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminReviewModerator({
  initialReviews,
}: {
  initialReviews: any[];
}) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        toast.success(`Review ${status.toLowerCase()}`);
        setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Error updating review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted");
        setReviews(reviews.filter((r) => r.id !== id));
      } else {
        toast.error("Failed to delete review");
      }
    } catch {
      toast.error("Error deleting review");
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-6">Feedback</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6 max-w-[180px]">
                  <Link
                    href={`/products/${rev.product.slug}`}
                    target="_blank"
                    className="font-bold text-white hover:text-indigo-400 block truncate"
                  >
                    {rev.product.name}
                  </Link>
                  <p className="text-[10px] text-slate-500">{formatDate(rev.createdAt)}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-white">{rev.user.name}</p>
                  <p className="text-[10px] text-slate-500">{rev.user.email}</p>
                  {rev.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 font-bold text-amber-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-6 max-w-sm">
                  <p className="font-bold text-white text-xs">{rev.title}</p>
                  <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">{rev.comment}</p>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      rev.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : rev.status === "REJECTED"
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {rev.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {rev.status !== "APPROVED" && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, "APPROVED")}
                        title="Approve Review"
                        className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {rev.status !== "REJECTED" && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, "REJECTED")}
                        title="Reject Review"
                        className="p-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      title="Purge Review"
                      className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
