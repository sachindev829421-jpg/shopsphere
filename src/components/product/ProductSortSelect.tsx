"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ProductSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "relevance";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
      >
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest Arrivals</option>
        <option value="rating">Highest Customer Rating</option>
        <option value="popularity">Most Popular</option>
      </select>
    </div>
  );
}
