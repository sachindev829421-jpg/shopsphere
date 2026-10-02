"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Heart, Check, Minus, Plus } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }

    addItemToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    toast.success(`Added ${quantity}x "${product.name}" to cart`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    addItemToCart(product, selectedVariant, quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      {/* Price display with discount badge */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-slate-900">
            {formatPrice(currentPrice)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > currentPrice && (
            <span className="text-lg text-slate-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          {product.discount > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes • Free delivery on orders above ₹999</p>
      </div>

      {/* Stock Status Indicator */}
      <div>
        {isOutOfStock ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            Out of Stock
          </span>
        ) : currentStock <= 5 ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 animate-pulse">
            Hurry! Only {currentStock} left in stock
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            ✓ In Stock ({currentStock} available)
          </span>
        )}
      </div>

      {/* Variants Selection (if variants exist) */}
      {product.variants.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Select Variant: <span className="text-indigo-600 normal-case">{selectedVariant?.name}</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isVarOutOfStock = v.stockQuantity <= 0;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  disabled={isVarOutOfStock}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-200"
                      : isVarOutOfStock
                      ? "border-slate-200 text-slate-300 line-through cursor-not-allowed bg-slate-50"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                  }`}
                >
                  {v.name}
                  {v.price && v.price !== product.price ? ` (${formatPrice(v.price)})` : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Stepper */}
      <div className="flex items-center space-x-4 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Quantity:</label>
        <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-bold text-sm text-slate-800">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
            disabled={quantity >= currentStock || isOutOfStock}
            className="p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            isOutOfStock
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : isAdded
              ? "bg-emerald-600 text-white shadow-emerald-200"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-lg"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            isOutOfStock
              ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
              : "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-200 hover:shadow-lg"
          }`}
        >
          <Zap className="w-5 h-5 fill-slate-950" />
          <span>Buy Now</span>
        </button>

        <button
          onClick={() => {
            toggleItem(product);
            if (!isFavorited) {
              toast.success("Added to wishlist");
            } else {
              toast.info("Removed from wishlist");
            }
          }}
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center shrink-0 ${
            isFavorited
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-rose-500"
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-500" : ""}`} />
        </button>
      </div>
    </div>
  );
}
