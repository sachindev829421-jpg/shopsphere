"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Plus, Trash2 } from "lucide-react";
import { Category } from "@/types";
import { toast } from "sonner";

export default function EditProductForm({
  product,
  categories,
}: {
  product: any;
  categories: Category[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(product.name || "");
  const [brand, setBrand] = useState(product.brand || "");
  const [categoryId, setCategoryId] = useState(product.categoryId || "");
  const [subcategory, setSubcategory] = useState(product.subcategory || "");
  const [price, setPrice] = useState(product.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(product.compareAtPrice?.toString() || "");
  const [discount, setDiscount] = useState(product.discount?.toString() || "0");
  const [stockQuantity, setStockQuantity] = useState(product.stockQuantity?.toString() || "0");
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product.lowStockThreshold?.toString() || "5"
  );
  const [shortDescription, setShortDescription] = useState(product.shortDescription || "");
  const [description, setDescription] = useState(product.description || "");
  const [isFeatured, setIsFeatured] = useState(product.isFeatured || false);
  const [isBestSeller, setIsBestSeller] = useState(product.isBestSeller || false);
  const [isActive, setIsActive] = useState(product.isActive || false);

  const [tagsInput, setTagsInput] = useState(
    Array.isArray(product.tags) ? product.tags.join(", ") : ""
  );

  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    Object.entries(product.specifications || {}).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  );

  const handleAddSpec = () => setSpecs([...specs, { key: "", value: "" }]);

  const handleUpdateSpec = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const specsMap: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsMap[s.key.trim()] = s.value.trim();
      }
    });

    const parsedTags = tagsInput
      .split(",")
      .map((t: string) => t.trim().toLowerCase())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          categoryId,
          subcategory,
          price,
          compareAtPrice: compareAtPrice || null,
          discount,
          stockQuantity,
          lowStockThreshold,
          shortDescription,
          description,
          isFeatured,
          isBestSeller,
          isActive,
          tags: parsedTags,
          specifications: specsMap,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update product");
        return;
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("An error occurred while updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
          Product Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Brand *
            </label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
          Pricing & Inventory
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Compare Price (₹)
            </label>
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950 border-slate-800"
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950 border-slate-800"
              />
              <span>Best Seller</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950 border-slate-800"
              />
              <span>Active</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
            Specifications & Tags
          </h2>
          <button
            type="button"
            onClick={handleAddSpec}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Spec
          </button>
        </div>

        <div className="space-y-3">
          {specs.map((spec, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => handleUpdateSpec(idx, "key", e.target.value)}
                placeholder="Key"
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="px-6 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Updating..." : "Save Product Changes"}</span>
        </button>
      </div>
    </form>
  );
}
