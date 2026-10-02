"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { Category } from "@/types";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stockQuantity, setStockQuantity] = useState("20");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Images array
  const [imageUrls, setImageUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
  ]);

  // Tags
  const [tagsInput, setTagsInput] = useState("electronics, audio, new");

  // Specifications
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: "Warranty", value: "1 Year Manufacturer" },
    { key: "Origin", value: "Made in India" },
  ]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      });
  }, []);

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleUpdateImageUrl = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

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

    if (!name || !brand || !categoryId || !description || !price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const filteredImages = imageUrls.filter((url) => url.trim().length > 0);
    if (filteredImages.length === 0) {
      toast.error("Please provide at least one product image URL");
      return;
    }

    const specsMap: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsMap[s.key.trim()] = s.value.trim();
      }
    });

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
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
          images: filteredImages,
          tags: parsedTags,
          specifications: specsMap,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create product");
        return;
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("An error occurred while creating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Products
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">Create New Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SonicPro Wireless ANC Headphones"
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
                placeholder="e.g. Acoustix India"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Primary Category *
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
                Short Tagline / Summary
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief one-line highlight displayed in listing"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Product Description *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed craft narrative, material breakdown, and instructions..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
            2. Pricing & Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="4999"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="8999"
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
                placeholder="44"
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
                placeholder="50"
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
                placeholder="5"
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
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
              3. Image URLs
            </h2>
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Image
            </button>
          </div>

          <div className="space-y-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => handleUpdateImageUrl(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specifications & Tags */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
              4. Specifications & Tags
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Specification
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. Battery Life)"
                  value={spec.key}
                  onChange={(e) => handleUpdateSpec(idx, "key", e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Value (e.g. 45 Hours)"
                    value={spec.value}
                    onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Product Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. audio, anc, bluetooth, wireless"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
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
            <span>{isSubmitting ? "Publishing Product..." : "Publish Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
