"use client";

import { useCartStore } from "@/lib/cartStore";
import { useCurrencyStore } from "@/lib/currencyStore";
import { Product } from "@/lib/mockData";
import { useToast } from "@/components/ToastProvider";
import { useEcomI18n } from "@/lib/i18n";
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
  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  const { t } = useEcomI18n();
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
      className={`rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px] ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 text-white" />
          <span>{t.card.added}</span>
        </>
      ) : isOutOfStock ? (
        <span>{t.card.outOfStock}</span>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          <span>
            {t.card.addToCart}
            {showPrice ? ` • ${formatPrice(product.price * qty)}` : ""}
            {size ? ` (${size})` : ""}
          </span>
        </>
      )}
    </button>
  );
}
