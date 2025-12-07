"use client";
import { useCart } from "@/lib/cartStore";

export default function AddToCartButton({ product, size }: { product: any; size?: string }) {
  const add = useCart(state => state.add);
  return (
    <button className="mt-4 rounded-subtle bg-indigo text-paper px-4 py-2" onClick={() => add(product, 1, size)}>
      Add to Cart{size ? ` • ${size}` : ''}
    </button>
  );
}
