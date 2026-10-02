import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: category.description || `Browse all ${category.name} on ShopSphere India`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          images: { orderBy: { order: "asc" } },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const parsedProducts: Product[] = category.products.map((p) => {
    let tags: string[] = [];
    let specifications: Record<string, string> = {};
    let sizes: string[] = [];
    let colors: string[] = [];
    try { tags = JSON.parse(p.tags || "[]"); } catch {}
    try { specifications = JSON.parse(p.specifications || "{}"); } catch {}
    try { sizes = JSON.parse(p.sizes || "[]"); } catch {}
    try { colors = JSON.parse(p.colors || "[]"); } catch {}

    return {
      ...p,
      tags,
      specifications,
      sizes,
      colors,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-indigo-600">Categories</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{category.name}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{category.description}</p>
        )}
      </div>

      {parsedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <p className="text-sm text-slate-500">No active products in this category at the moment.</p>
          <Link href="/products" className="inline-block mt-4 text-xs font-bold text-indigo-600">
            Browse all products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {parsedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
