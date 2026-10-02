import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "All Categories",
  description: "Browse ShopSphere's wide array of Indian fashion, audio, electronics, and home decor.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Categories</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Categories</h1>
        <p className="text-xs text-slate-500 mt-1">Discover curated collections crafted with authenticity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 aspect-[16/10] shadow-md hover:shadow-xl transition-all"
          >
            {cat.image && (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {cat._count.products} Products
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 max-w-sm">
                  {cat.description}
                </p>
              )}
              <div className="mt-4 flex items-center text-xs font-bold text-amber-300 group-hover:text-white transition-colors">
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
