import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, findBySku } from "@/lib/mockData";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export interface CartItem {
  id: string; // unique combo of sku + size + color
  sku: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  image: string;
  maxInventory: number;
}

export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed" | "freeship";
  value: number; // e.g. 15 for 15% or 10 for $10
  description: string;
}

export const VALID_PROMOS: Record<string, PromoCode> = {
  SUMMER15: {
    code: "SUMMER15",
    discountType: "percentage",
    value: 15,
    description: "15% off total order",
  },
  WELCOME10: {
    code: "WELCOME10",
    discountType: "fixed",
    value: 10,
    description: "$10 instant welcome discount",
  },
  FREESHIP: {
    code: "FREESHIP",
    discountType: "freeship",
    value: 0,
    description: "Complimentary priority shipping",
  },
};

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  appliedPromo: PromoCode | null;
  hasHydrated: boolean;
  
  // Actions
  addItem: (product: Product, qty?: number, size?: string, color?: string) => { success: boolean; message: string };
  removeItem: (itemId: string) => void;
  updateQty: (itemId: string, qty: number) => { success: boolean; message?: string };
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setHasHydrated: (state: boolean) => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingCost: () => number;
  getEstimatedTax: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      appliedPromo: null,
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (product, qty = 1, size, color) => {
        const items = [...get().items];
        const itemId = `${product.sku}-${size || "std"}-${color || "std"}`;
        const existingIdx = items.findIndex((i) => i.id === itemId);

        const currentQtyInCart = existingIdx >= 0 ? items[existingIdx].qty : 0;
        const availableStock = product.inventory;

        if (currentQtyInCart + qty > availableStock) {
          return {
            success: false,
            message: `Inventory limit reached. Only ${availableStock} units available for ${product.name}.`,
          };
        }

        if (existingIdx >= 0) {
          items[existingIdx].qty += qty;
        } else {
          items.push({
            id: itemId,
            sku: product.sku,
            name: product.name,
            brand: product.brand || "TITAN STUDIO",
            price: product.price,
            qty,
            size,
            color,
            image: product.images[0] || "/placeholder-1.jpg",
            maxInventory: product.inventory,
          });
        }

        set({ items, isDrawerOpen: true });
        return { success: true, message: `Added ${product.name} to cart.` };
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQty: (itemId, qty) => {
        if (qty <= 0) {
          get().removeItem(itemId);
          return { success: true, message: "Item removed from cart" };
        }

        const items = [...get().items];
        const idx = items.findIndex((i) => i.id === itemId);
        if (idx === -1) return { success: false, message: "Item not found" };

        const item = items[idx];
        const product = findBySku(item.sku);
        const maxStock = product ? product.inventory : item.maxInventory;

        if (qty > maxStock) {
          return {
            success: false,
            message: `Maximum stock limit of ${maxStock} reached for this item.`,
          };
        }

        items[idx].qty = qty;
        set({ items });
        return { success: true };
      },

      clearCart: () => set({ items: [], appliedPromo: null }),

      applyPromoCode: (code) => {
        const clean = code.trim().toUpperCase();
        const promo = VALID_PROMOS[clean];
        if (!promo) {
          return { success: false, message: "Invalid promo code. Try SUMMER15, WELCOME10, or FREESHIP." };
        }
        set({ appliedPromo: promo });
        return { success: true, message: `Promo code "${clean}" applied successfully!` };
      },

      removePromoCode: () => set({ appliedPromo: null }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (!promo || subtotal <= 0) return 0;

        if (promo.discountType === "percentage") {
          return (subtotal * promo.value) / 100;
        } else if (promo.discountType === "fixed") {
          return Math.min(subtotal, promo.value);
        }
        return 0;
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (subtotal <= 0) return 0;
        if (promo?.discountType === "freeship" || subtotal >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return 6.0;
      },

      getEstimatedTax: () => {
        const taxable = Math.max(0, get().getSubtotal() - get().getDiscountAmount());
        return taxable * 0.0825; // 8.25% standard tax
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal <= 0) return 0;
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingCost();
        const tax = get().getEstimatedTax();
        return Math.max(0, subtotal - discount + shipping + tax);
      },
    }),
    {
      name: "titan-cart-storage-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, appliedPromo: state.appliedPromo }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
