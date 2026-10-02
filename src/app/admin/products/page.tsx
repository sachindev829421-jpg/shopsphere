import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import AdminProductRowActions from "./AdminProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { take: 1, orderBy: { order: "asc" } },
      variants: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage inventory, update pricing, add variants, and publish/unpublish products.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Variants</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-950 rounded-xl overflow-hidden relative shrink-0 border border-slate-800">
                      <Image
                        src={p.images[0]?.url || "/placeholder.png"}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 max-w-xs">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="font-bold text-white hover:text-indigo-400 transition-colors block truncate"
                      >
                        {p.name}
                      </Link>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{p.sku} • {p.brand}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{p.category.name}</td>
                  <td className="py-4 px-4 font-bold text-white">{formatPrice(p.price)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${
                        p.stockQuantity === 0
                          ? "text-rose-400"
                          : p.stockQuantity <= 5
                          ? "text-amber-400"
                          : "text-slate-300"
                      }`}
                    >
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{p.variants.length}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {p.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <AdminProductRowActions productId={p.id} productName={p.name} isActive={p.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
