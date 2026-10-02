import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import ReviewSection from "@/components/product/ReviewSection";
import ProductCard from "@/components/product/ProductCard";
import { Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Product, Review } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDescription: true, description: true, images: { take: 1 } },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | ShopSphere India`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: true,
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, image: true } },
        },
      },
    },
  });

  if (!dbProduct || !dbProduct.isActive) {
    notFound();
  }

  // Parse JSON fields
  let tags: string[] = [];
  let specifications: Record<string, string> = {};
  let sizes: string[] = [];
  let colors: string[] = [];
  try { tags = JSON.parse(dbProduct.tags || "[]"); } catch {}
  try { specifications = JSON.parse(dbProduct.specifications || "{}"); } catch {}
  try { sizes = JSON.parse(dbProduct.sizes || "[]"); } catch {}
  try { colors = JSON.parse(dbProduct.colors || "[]"); } catch {}

  const product: Product = {
    ...dbProduct,
    tags,
    specifications,
    sizes,
    colors,
    createdAt: dbProduct.createdAt.toISOString(),
    updatedAt: dbProduct.updatedAt.toISOString(),
  };

  const parsedReviews: Review[] = dbProduct.reviews.map((r) => {
    let images: string[] = [];
    try { images = JSON.parse(r.images); } catch {}
    return {
      ...r,
      images,
      createdAt: r.createdAt.toISOString(),
      status: r.status as "PENDING" | "APPROVED" | "REJECTED",
    };
  });

  // Query Related Products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: dbProduct.categoryId,
      id: { not: dbProduct.id },
      isActive: true,
    },
    take: 4,
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });

  const parsedRelated: Product[] = relatedProducts.map((p) => {
    let rTags: string[] = [];
    let rSpecs: Record<string, string> = {};
    let rSizes: string[] = [];
    let rColors: string[] = [];
    try { rTags = JSON.parse(p.tags || "[]"); } catch {}
    try { rSpecs = JSON.parse(p.specifications || "{}"); } catch {}
    try { rSizes = JSON.parse(p.sizes || "[]"); } catch {}
    try { rColors = JSON.parse(p.colors || "[]"); } catch {}

    return {
      ...p,
      tags: rTags,
      specifications: rSpecs,
      sizes: rSizes,
      colors: rColors,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-indigo-600">Products</Link>
        <span>/</span>
        <Link href={`/categories/${dbProduct.category.slug}`} className="hover:text-indigo-600">
          {dbProduct.category.name}
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-lg text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating > 0 ? product.rating.toFixed(1) : "New"}</span>
              </div>
              <span className="text-xs text-slate-500">
                {product.reviewCount} customer reviews
              </span>
            </div>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-indigo-200 pl-3">
              {product.shortDescription}
            </p>
          )}

          {/* Product Actions (Price, Variant Selector, Quantity, Add to Cart, Buy Now) */}
          <ProductActions product={product} />

          {/* Value Badges */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <Truck className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Express Delivery</p>
              <p className="text-[10px] text-slate-400">2-4 business days</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <RotateCcw className="w-5 h-5 mx-auto text-amber-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">7-Day Returns</p>
              <p className="text-[10px] text-slate-400">Doorstep pickup</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">100% Genuine</p>
              <p className="text-[10px] text-slate-400">Direct guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specifications Tabs */}
      <div className="pt-12 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Product Overview</h2>
          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Tags:</span>
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Specifications Table */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm self-start">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Specifications & Details
          </h3>
          {Object.keys(product.specifications).length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="py-2.5 flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">{key}</span>
                  <span className="text-slate-900 font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Standard manufacturer specifications apply.</p>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection
        productId={product.id}
        initialReviews={parsedReviews}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />

      {/* Related Products */}
      {parsedRelated.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Similar Products You May Like</h2>
            <Link
              href={`/categories/${dbProduct.category.slug}`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View More in {dbProduct.category.name} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {parsedRelated.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
