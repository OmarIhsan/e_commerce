"use client";
import { useCart } from "@/lib/cartStore";

export default function AddToCartButton({ product, size }: { product: any; size?: string }) {
  const add = useCart(state => state.add);
  return (
    <button onClick={() => add(product, 1, size)} className="mt-4 btn-brand hover:opacity-95">
      Add to Cart{size ? ` • ${size}` : ''}
    </button>
  );
}
