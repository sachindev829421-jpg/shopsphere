"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, X, Save } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCouponManager({
  initialCoupons,
}: {
  initialCoupons: any[];
}) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("0");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description,
          discountType,
          discountValue,
          minOrderValue,
          maxDiscount: maxDiscount || null,
          endDate: endDate || null,
          usageLimit: usageLimit || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create coupon");
        return;
      }

      toast.success("Coupon created successfully!");
      setModalOpen(false);
      setCode("");
      setDescription("");
      setDiscountValue("");
      setMinOrderValue("0");
      setMaxDiscount("");
      setEndDate("");
      setUsageLimit("");

      // Refresh list
      const fetchRes = await fetch("/api/admin/coupons");
      const fetchData = await fetchRes.json();
      if (fetchData.coupons) setCoupons(fetchData.coupons);
    } catch {
      toast.error("Error creating coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Coupon deleted");
        setCoupons(coupons.filter((c) => c.id !== id));
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch {
      toast.error("Error deleting coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min Order</th>
                <th className="py-3.5 px-4">Max Discount</th>
                <th className="py-3.5 px-4">Usage</th>
                <th className="py-3.5 px-4">Expires</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-white flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{c.code}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-indigo-300">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                  </td>
                  <td className="py-4 px-4">{formatPrice(c.minOrderValue)}</td>
                  <td className="py-4 px-4">{c.maxDiscount ? formatPrice(c.maxDiscount) : "No cap"}</td>
                  <td className="py-4 px-4">
                    {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : "uses"}
                  </td>
                  <td className="py-4 px-4 text-slate-400">{c.endDate ? formatDate(c.endDate) : "Never"}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        c.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Promotional Coupon</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI30"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Festive season special offer"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "PERCENTAGE" ? "20" : "500"}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="999"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="1000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Usage Limit (Count)
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="1000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Creating..." : "Save Coupon"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
