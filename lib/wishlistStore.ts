import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/lib/mockData";

interface WishlistState {
  items: Product[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  toggleWishlist: (product: Product) => { added: boolean; message: string };
  isInWishlist: (sku: string) => boolean;
  removeItem: (sku: string) => void;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      toggleWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.sku === product.sku);

        if (exists) {
          set({
            items: currentItems.filter((item) => item.sku !== product.sku),
          });
          return { added: false, message: `Removed "${product.name}" from Wishlist` };
        } else {
          set({
            items: [product, ...currentItems],
          });
          return { added: true, message: `Added "${product.name}" to Wishlist` };
        }
      },

      isInWishlist: (sku) => {
        return get().items.some((item) => item.sku === sku);
      },

      removeItem: (sku) => {
        set({
          items: get().items.filter((item) => item.sku !== sku),
        });
      },

      clearWishlist: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    {
      name: "ecommerce_wishlist_v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
