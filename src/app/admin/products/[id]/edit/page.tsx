import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import EditProductForm from "./EditProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  let tags: string[] = [];
  let specifications: Record<string, string> = {};
  try { tags = JSON.parse(product.tags || "[]"); } catch {}
  try { specifications = JSON.parse(product.specifications || "{}"); } catch {}

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
          <h1 className="text-2xl font-black text-white tracking-tight">
            Edit &quot;{product.name}&quot;
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">SKU: {product.sku}</p>
        </div>
      </div>

      <EditProductForm
        product={{
          ...product,
          tags,
          specifications,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, featured: c.featured }))}
      />
    </div>
  );
}
