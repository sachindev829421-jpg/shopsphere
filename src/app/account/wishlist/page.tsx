"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  const handleMoveToCart = (product: any) => {
    if (product.stockQuantity <= 0) {
      toast.error("This item is currently out of stock");
      return;
    }
    addItemToCart(product);
    removeItem(product.id);
    toast.success(`Moved "${product.name}" to cart!`);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-xs text-slate-500 mt-0.5">Keep track of your favorite artisan and electronics finds.</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => {
              clearWishlist();
              toast.info("Wishlist cleared");
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-400 space-y-3">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Your wishlist is empty</p>
          <p className="text-xs text-slate-500">
            Explore our collections and tap the heart icon on any product to save it here.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                  <Image
                    src={prod.images[0]?.url || "/placeholder.png"}
                    alt={prod.name}
                    fill
                    className="object-cover"
                  />
                  {prod.discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-extrabold uppercase bg-rose-600 text-white rounded-full">
                      {prod.discount}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => {
                      removeItem(prod.id);
                      toast.info("Removed from wishlist");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-slate-500 hover:text-rose-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {prod.brand}
                  </span>
                  <Link href={`/products/${prod.slug}`} className="block hover:text-indigo-600">
                    <h3 className="font-bold text-xs text-slate-900 line-clamp-2 mt-0.5">
                      {prod.name}
                    </h3>
                  </Link>
                  <p className="font-extrabold text-sm text-slate-900 mt-2">
                    {formatPrice(prod.price)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleMoveToCart(prod)}
                disabled={prod.stockQuantity <= 0}
                className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Cart</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
