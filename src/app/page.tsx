import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star, Gift, Truck } from "lucide-react";
import { Product } from "@/types";

export const revalidate = 60; // ISR cache 60 seconds

export default async function HomePage() {
  // Query categories, featured products, best sellers, and new arrivals
  const [categories, featuredProducts, bestSellers, newArrivals] = await Promise.all([
    prisma.category.findMany({
      where: { featured: true },
      take: 6,
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 8,
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
      orderBy: { rating: "desc" },
    }),
    prisma.product.findMany({
      where: { isBestSeller: true, isActive: true },
      take: 8,
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
      orderBy: { reviewCount: "desc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const mapToProduct = (p: any): Product => {
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
  };

  const parsedFeatured = featuredProducts.map(mapToProduct);
  const parsedBestSellers = bestSellers.map(mapToProduct);
  const parsedNewArrivals = newArrivals.map(mapToProduct);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>The Grand Indian Lifestyle Festival</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Crafted for elegance. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-indigo-300 to-violet-400">
                  Engineered for everyday.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Discover authentic Banarasi silk handlooms, noise-cancelling audio gear, Ayurvedic elixirs, and
                designer home decor. 100% genuine brands delivered to your doorstep.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group text-base"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/products?bestseller=true"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-all text-base text-center"
                >
                  View Best Sellers
                </Link>
              </div>

              {/* Coupon Highlight Pill */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-400">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>
                  First order? Use code <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">WELCOME10</strong> for instant 10% off
                </span>
              </div>
            </div>

            {/* Hero Visual Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                  alt="SonicPro Studio Wireless ANC Headphones"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                    Staff Spotlight
                  </span>
                  <h3 className="font-bold text-lg text-white">SonicPro Wireless ANC</h3>
                  <p className="text-xs text-slate-300 mt-0.5">45h battery life with LDAC spatial acoustics</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <span className="text-base font-extrabold text-white">₹4,999</span>
                    <Link
                      href="/products/sonicpro-wireless-anc-headphones"
                      className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                    >
                      Shop Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated Departments</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-square flex flex-col justify-end p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent group-hover:from-indigo-950/90 transition-colors" />
              <div className="relative z-10 text-white">
                <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow-sm">{cat.name}</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">{cat._count.products} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Trending & Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
              <Zap className="w-3.5 h-3.5 fill-rose-600" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Trending Products
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {parsedFeatured.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">
              Limited Festive Window
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Flat 25% Off Across Indian Festive Wardrobe
            </h2>
            <p className="text-sm sm:text-base text-white/90">
              Authentic Katan Silk Sarees, Pure Chanderi Kurtas, Brass Urli sets, and cold-pressed Kumkumadi beauty fluids.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/products?category=womens-fashion"
                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-colors text-sm"
              >
                Claim Coupon FESTIVE25
              </Link>
              <span className="text-xs font-semibold text-white/80">
                Minimum order ₹1,999 • Valid till Diwali
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products?bestseller=true"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {parsedBestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Fresh Additions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {parsedNewArrivals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 7. Real Customer Reviews Section */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Real Testimonials</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Loved by Over 50,000+ Indian Shoppers
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Read how ShopSphere is bringing artisanal authenticity and fast digital commerce together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="font-bold text-slate-900 text-base">&quot;The Banarasi Silk saree was breathtaking!&quot;</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ordered the Katan Silk handloom saree for my sister&apos;s wedding in Delhi. The kadhwa zari work is 100% genuine and the silk mark gave me total confidence.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 font-bold text-xs text-indigo-700 flex items-center justify-center">
                  SP
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Shweta Pandey</p>
                  <p className="text-[11px] text-slate-400">Verified Buyer • New Delhi</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="font-bold text-slate-900 text-base">&quot;Fast Razorpay UPI checkout & prompt delivery&quot;</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                The SonicPro headphones arrived in Bengaluru within 48 hours. ANC clarity is fantastic on Google Meet calls and flights. Flawless checkout!
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 font-bold text-xs text-emerald-700 flex items-center justify-center">
                  VK
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Vikram Kulkarni</p>
                  <p className="text-[11px] text-slate-400">Verified Buyer • Bengaluru</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="font-bold text-slate-900 text-base">&quot;Authentic Ayurvedic Kumkumadi oil&quot;</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                I was skeptical about finding genuine Kashmiri saffron serum online, but ShopSphere exceeded expectations. Noticeable glow within 10 days of night use.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 font-bold text-xs text-rose-700 flex items-center justify-center">
                  AN
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Ananya Nair</p>
                  <p className="text-[11px] text-slate-400">Verified Buyer • Kochi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Pan-India Reach</h3>
              <p className="text-xs text-slate-500 mt-1">Delivering seamlessly to over 20,000+ PIN codes with live SMS tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Direct Artisan Sourcing</h3>
              <p className="text-xs text-slate-500 mt-1">No middlemen markups. Direct partnerships with certified weavers and craftsmen.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
              <Zap className="w-6 h-6 fill-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Instant UPI & COD</h3>
              <p className="text-xs text-slate-500 mt-1">Pay smoothly via PhonePe, Google Pay, Cards or choose Cash on Delivery at your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
