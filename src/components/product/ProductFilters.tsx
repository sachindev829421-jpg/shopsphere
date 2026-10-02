"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import { Category } from "@/types";

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
}

export default function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";
  const currentBrand = searchParams.get("brand") || "all";
  const currentSort = searchParams.get("sort") || "relevance";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentRating = searchParams.get("rating") || "";
  const currentInStock = searchParams.get("inStock") === "true";

  const updateParam = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      params.delete("page"); // reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const resetFilters = () => {
    router.push(pathname);
    setMobileOpen(false);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          <button
            onClick={() => updateParam("category", null)}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors ${
              currentCategory === "all"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.slug)}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between ${
                currentCategory === cat.slug
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{cat.name}</span>
              {cat.productsCount !== undefined && (
                <span className="text-[10px] text-slate-400 font-normal">({cat.productsCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          <button
            onClick={() => updateParam("brand", null)}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors ${
              currentBrand === "all"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => updateParam("brand", b)}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors ${
                currentBrand === b
                  ? "bg-indigo-50 text-indigo-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Price Range (₹)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={currentMinPrice}
            onChange={(e) => updateParam("minPrice", e.target.value || null)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={currentMaxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value || null)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Customer Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => updateParam("rating", currentRating === r.toString() ? null : r.toString())}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between ${
                currentRating === r.toString()
                  ? "bg-amber-50 text-amber-900 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{r}★ & Above</span>
              {currentRating === r.toString() && <span className="text-amber-600 text-xs">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Availability</h4>
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <span>Exclude Out of Stock</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-sm"
        >
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters & Refine</span>
        </button>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm self-start sticky top-28">
        {filterContent}
      </aside>

      {/* Mobile Modal Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm lg:hidden">
          <div className="bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto ml-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <span className="font-bold text-slate-900">Refine Products</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
