import { prisma } from "@/lib/prisma";
import AdminCategoryManager from "./AdminCategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Category Hierarchy</h1>
        <p className="text-xs text-slate-400 mt-1">
          Organize storefront collections, departments, banners and navigation menus.
        </p>
      </div>

      <AdminCategoryManager
        initialCategories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          parentId: c.parentId,
          featured: c.featured,
          productsCount: c._count.products,
        }))}
      />
    </div>
  );
}
