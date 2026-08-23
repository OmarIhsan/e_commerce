"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/components/ToastProvider";
import { useEcomI18n } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const { success, info } = useToast();
  const { locale, dir, t } = useEcomI18n();
  const isRtl = dir === "rtl";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    for (const item of items) {
      const res = addItem(item, 1);
      if (res.success) addedCount++;
    }
    if (addedCount > 0) {
      success(t.card.added);
    } else {
      info(t.card.added);
    }
  };

  const handleClear = () => {
    clearWishlist();
    info(t.wishlist.clear);
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center text-titanium-400 text-xs">
        Loading...
      </div>
    );
  }

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-8">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-titanium-400">
        <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors flex items-center gap-1">
          <BackIcon className="w-3 h-3" />
          <span>{t.product.breadcrumbCatalog}</span>
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">{t.wishlist.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-titanium-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-semibold text-rose-400 mb-2">
            <Heart className="w-3 h-3 fill-rose-500" />
            <span>{t.wishlist.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.wishlist.title} ({items.length})
          </h1>
          <p className="text-xs text-titanium-400 mt-1">
            {t.wishlist.subtitle}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleMoveAllToCart}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.wishlist.moveAllToCart}</span>
            </button>
            <button
              onClick={handleClear}
              className="px-3.5 py-2.5 rounded-lg bg-titanium-950 border border-white/10 text-xs text-titanium-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.wishlist.clear}</span>
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      {items.length === 0 ? (
        <div className="rounded-2xl bg-titanium-900 border border-white/10 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-titanium-500 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">{t.wishlist.empty}</h3>
          <p className="text-xs text-titanium-400 max-w-sm mx-auto">
            {t.wishlist.emptyDesc}
          </p>
          <div className="pt-2">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {t.wishlist.exploreBtn}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
