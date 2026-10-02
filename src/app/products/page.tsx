import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import ProductSortSelect from "@/components/product/ProductSortSelect";
import Link from "next/link";
import { Product } from "@/types";
import { PackageX } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const categorySlug = typeof resolvedParams.category === "string" ? resolvedParams.category : undefined;
  const brand = typeof resolvedParams.brand === "string" ? resolvedParams.brand : undefined;
  const minPrice = typeof resolvedParams.minPrice === "string" ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = typeof resolvedParams.maxPrice === "string" ? parseFloat(resolvedParams.maxPrice) : undefined;
  const rating = typeof resolvedParams.rating === "string" ? parseFloat(resolvedParams.rating) : undefined;
  const inStock = resolvedParams.inStock === "true";
  const featured = resolvedParams.featured === "true";
  const bestseller = resolvedParams.bestseller === "true";
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "relevance";
  const page = Math.max(1, parseInt(typeof resolvedParams.page === "string" ? resolvedParams.page : "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build Prisma where
  const where: any = { isActive: true };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { brand: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }
  if (categorySlug && categorySlug !== "all") {
    where.category = { slug: categorySlug };
  }
  if (brand && brand !== "all") {
    where.brand = brand;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (rating !== undefined) {
    where.rating = { gte: rating };
  }
  if (inStock) {
    where.stockQuantity = { gt: 0 };
  }
  if (featured) {
    where.isFeatured = true;
  }
  if (bestseller) {
    where.isBestSeller = true;
  }

  // Order By
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };
  else if (sort === "popularity") orderBy = { reviewCount: "desc" };

  const [products, total, categories, allBrands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ["brand"],
    }),
  ]);

  const brandsList = allBrands.map((b) => b.brand).sort();

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    featured: c.featured,
    productsCount: c._count.products,
  }));

  const parsedProducts: Product[] = products.map((p) => {
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

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Products Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {q ? `Search results for "${q}"` : categorySlug ? `Category Products` : "All Products"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length > 0 ? skip + 1 : 0}-{Math.min(skip + limit, total)} of {total} products
          </p>
        </div>

        <ProductSortSelect />
      </div>

      {/* Main Content Layout with Sidebar Filters */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <ProductFilters categories={formattedCategories} brands={brandsList} />

        <div className="flex-1 w-full">
          {parsedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                We couldn&apos;t find any items matching your selected criteria or search keywords.
                Try relaxing your price filters or removing category restrictions.
              </p>
              <Link
                href="/products"
                className="inline-block mt-6 px-6 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 shadow-sm"
              >
                Clear All Filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {parsedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/products?page=${page - 1}`}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm"
                    >
                      ← Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pNum = i + 1;
                    const isCurrent = pNum === page;
                    return (
                      <Link
                        key={pNum}
                        href={`/products?page=${pNum}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-colors shadow-sm ${
                          isCurrent
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {pNum}
                      </Link>
                    );
                  })}
                  {page < totalPages && (
                    <Link
                      href={`/products?page=${page + 1}`}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
