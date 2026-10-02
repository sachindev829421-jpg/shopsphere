"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  CheckCircle2,
  X,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    coupon,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
  } = useCartStore();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          orderAmount: subtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid coupon code");
        return;
      }

      applyCoupon(data.coupon);
      setCouponCodeInput("");
      toast.success(`Coupon ${data.coupon.code} applied! Saved ₹${Math.round(data.discountAmount)}`);
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Looks like you haven&apos;t added any artisanal finds or gadgets to your cart yet.
            Explore our curated collections!
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-md transition-all"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to secure checkout.</p>
        </div>
        <button
          onClick={() => {
            clearCart();
            toast.info("Cart cleared");
          }}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Notification */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 mb-2">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                {subtotal >= freeShippingThreshold ? (
                  <strong className="text-emerald-700">Congratulations! You unlocked FREE Delivery 🎉</strong>
                ) : (
                  <span>
                    Add <strong>{formatPrice(freeShippingThreshold - subtotal)}</strong> more to unlock Free Delivery
                  </span>
                )}
              </span>
              <span>{progressToFreeShipping}%</span>
            </div>
            <div className="w-full h-2 bg-indigo-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                {/* Product Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-2xl overflow-hidden relative shrink-0 border border-slate-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} className="hover:text-indigo-600 transition-colors block">
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 truncate">{item.name}</h3>
                  </Link>

                  {(item.size || item.color) && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      {item.size && <span>Size: <strong>{item.size}</strong></span>}
                      {item.size && item.color && <span>•</span>}
                      {item.color && <span>Color: <strong>{item.color}</strong></span>}
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 sm:p-2 text-slate-600 hover:bg-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-1.5 sm:p-2 text-slate-600 hover:bg-white transition-colors disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-bold text-slate-900 hidden sm:inline-block w-20 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.info(`Removed "${item.name}"`);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6 self-start sticky top-28">
          {/* Coupon Code Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Apply Coupon</span>
            </h4>

            {coupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {coupon.code} applied
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    removeCoupon();
                    toast.info("Coupon removed");
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 px-3 py-2 text-xs uppercase font-mono tracking-wider border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  type="submit"
                  disabled={isValidatingCoupon || !couponCodeInput.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  {isValidatingCoupon ? "..." : "Apply"}
                </button>
              </form>
            )}

            <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
              <p>Available codes: <strong className="text-slate-600">WELCOME10</strong> (10% off), <strong className="text-slate-600">FESTIVE25</strong> (25% off)</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Savings</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="text-emerald-600 uppercase font-bold">Free</strong>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>GST Tax (18%)</span>
                <span className="font-semibold text-slate-900">{formatPrice(tax)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Final Total</span>
                <span className="text-xl font-extrabold text-indigo-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
