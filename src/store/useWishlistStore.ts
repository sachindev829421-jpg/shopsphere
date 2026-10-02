import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        if (!get().isInWishlist(product.id)) {
          set({ items: [...get().items, product] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      toggleItem: (product: Product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "shopsphere_wishlist_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
