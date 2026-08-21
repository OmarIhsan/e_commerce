"use client";

import { useCartStore } from "@/lib/cartStore";
import { Product } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  qty?: number;
  size?: string;
  color?: string;
  className?: string;
  showPrice?: boolean;
}

export default function AddToCartButton({
  product,
  qty = 1,
  size,
  color,
  className = "",
  showPrice = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { success, error } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.inventory <= 0) return;

    const res = addItem(product, qty, size, color);
    if (res.success) {
      success(res.message);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      error(res.message);
    }
  };

  const isOutOfStock = product.inventory <= 0;

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 text-titanium-950" />
          <span>ADDED TO CART</span>
        </>
      ) : isOutOfStock ? (
        <span>OUT OF STOCK</span>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          <span>
            ADD TO CART
            {showPrice ? ` • $${(product.price * qty).toFixed(2)}` : ""}
            {size ? ` (${size})` : ""}
          </span>
        </>
      )}
    </button>
  );
}
