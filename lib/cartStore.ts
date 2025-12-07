import { create } from "zustand";
import type { Product } from "@/lib/mockData";

type CartItem = { sku: string; name: string; price: number; qty: number; size?: string };

type CartState = {
  items: CartItem[];
  // accept optional size when adding
  add: (product: Product, qty?: number, size?: string) => void;
  remove: (sku: string, size?: string) => void;
  update: (sku: string, qty: number, size?: string) => void;
  clear: () => void;
  subtotal: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (product, qty = 1, size) => {
    const items = get().items.slice();
    // treat sku+size as unique key so different sizes are separate line items
    const idx = items.findIndex(i => i.sku === product.sku && (i.size || '') === (size || ''));
    if (idx >= 0) {
      items[idx].qty += qty;
    } else {
      items.push({ sku: product.sku, name: product.name, price: product.price, qty, size });
    }
    set({ items });
  },
  remove: (sku, size) => set({ items: get().items.filter(i => !(i.sku === sku && (i.size || '') === (size || ''))) }),
  update: (sku, qty, size) => set({ items: get().items.map(i => (i.sku === sku && (i.size || '') === (size || '')) ? { ...i, qty } : i) }),
  clear: () => set({ items: [] }),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
