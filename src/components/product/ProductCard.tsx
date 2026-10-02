"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItemToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    addItemToCart(product);
    setIsAdded(true);
    toast.success(`Added "${product.name}" to your cart`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!isFavorited) {
      toast.success(`Added to wishlist`);
    } else {
      toast.info(`Removed from wishlist`);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-slate-50 overflow-hidden block">
        <Image
          src={product.images[0]?.url || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide bg-rose-600 text-white rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-amber-500 text-white rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-slate-900 text-white rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? "bg-rose-50 text-rose-500 shadow"
              : "bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white shadow-sm"
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`} />
        </button>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider truncate max-w-[120px]">{product.brand}</span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded text-[11px]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount})</span>
              </div>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">{formatPrice(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <p className="text-[10px] font-semibold text-amber-600 mt-0.5">
                Only {product.stockQuantity} left in stock!
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white shadow-sm"
            }`}
            aria-label="Add to cart"
          >
            {isOutOfStock ? (
              <span className="hidden sm:inline">Out of Stock</span>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
