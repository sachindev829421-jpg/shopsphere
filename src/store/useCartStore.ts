import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Coupon, Product, ProductVariant } from "@/types";

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product: Product, variant?: ProductVariant | null, quantity: number = 1) => {
        const currentItems = get().items;
        const itemId = variant ? `${product.id}-${variant.id}` : product.id;
        const maxStock = variant ? variant.stockQuantity : product.stockQuantity;

        const existingItem = currentItems.find((i) => i.id === itemId);

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);
          set({
            items: currentItems.map((i) =>
              i.id === itemId ? { ...i, quantity: newQuantity } : i
            ),
          });
        } else {
          const price = variant?.price ?? product.price;
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            variantId: variant?.id || null,
            name: product.name,
            image: variant?.image || product.images[0]?.url || "/placeholder.png",
            price,
            compareAtPrice: product.compareAtPrice,
            quantity: Math.min(quantity, maxStock),
            size: variant?.size || null,
            color: variant?.color || null,
            maxStock,
            sku: variant?.sku || product.sku,
            slug: product.slug,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) => {
            if (item.id === itemId) {
              const safeQty = Math.min(quantity, item.maxStock);
              return { ...item, quantity: safeQty };
            }
            return item;
          }),
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      applyCoupon: (coupon: Coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal < coupon.minOrderValue) return 0;

        let discount = 0;
        if (coupon.discountType === "PERCENTAGE") {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        return Math.min(discount, subtotal);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Free shipping above ₹999 or if FREESHIP coupon is used
        if (subtotal >= 999 || get().coupon?.code === "FREESHIP") return 0;
        return 99; // Standard shipping ₹99
      },

      getTax: () => {
        const subtotalAfterDiscount = Math.max(0, get().getSubtotal() - get().getDiscount());
        // Indian GST standard 18% factored or calculated
        return Math.round(subtotalAfterDiscount * 0.18 * 100) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return Math.round((subtotal - discount + shipping + tax) * 100) / 100;
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "shopsphere_cart_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
