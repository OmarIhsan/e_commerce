"use client";

import Link from "next/link";
import { Product } from "@/lib/mockData";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useToast } from "@/components/ToastProvider";
import { Star, ShoppingBag, Check, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useEcomI18n } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.sku));
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const { success, error, info } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [hasJustAdded, setHasJustAdded] = useState(false);
  const { locale, t } = useEcomI18n();

  const productHref = `/${locale}/product/${product.sku}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    const defaultSize = Array.isArray(product.attributes?.size)
      ? (product.attributes?.size as string[])[0]
      : undefined;
    const defaultColor = Array.isArray(product.attributes?.color)
      ? (product.attributes?.color as string[])[0]
      : undefined;

    const res = addItem(product, 1, defaultSize, defaultColor);
    if (res.success) {
      success(res.message);
      setHasJustAdded(true);
      setTimeout(() => setHasJustAdded(false), 1500);
    } else {
      error(res.message);
    }
    setIsAdding(false);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlist(product);
    if (result.added) {
      success(result.message);
    } else {
      info(result.message);
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl bg-titanium-900 border border-white/10 p-4 flex flex-col sm:flex-row items-center gap-6 group hover:border-blue-500/40 transition-all shadow-sm"
      >
        {/* Thumbnail */}
        <Link
          href={productHref}
          className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-titanium-950 shrink-0 border border-white/5"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2.5 start-2.5 rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm">
              -{product.discount}% {t.card.off}
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2.5 end-2.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-500 transition-colors z-10"
            title={isInWishlist ? t.card.removeWishlist : t.card.saveWishlist}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "text-rose-500 fill-rose-500" : ""}`} />
          </button>
        </Link>

        {/* Content details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full py-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-titanium-400">
              <span className="font-semibold text-blue-400 uppercase tracking-wide">
                {product.brand}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-titanium-400 font-normal">({product.reviewsCount})</span>
              </div>
            </div>

            <Link href={productHref}>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-titanium-300 line-clamp-2 leading-relaxed mb-3">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-xs text-titanium-500 line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={product.inventory <= 0 || isAdding}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-40"
            >
              {hasJustAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.card.added}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t.card.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout mode (default)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl bg-titanium-900 border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-blue-500/40 transition-all shadow-sm relative"
    >
      <div>
        {/* Image Container with overlay triggers */}
        <Link
          href={productHref}
          className="block relative h-64 w-full overflow-hidden bg-titanium-950 border-b border-white/10"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
            {product.discount && product.discount > 0 && (
              <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm">
                -{product.discount}% {t.card.off}
              </span>
            )}
            {product.flags?.includes("new") && (
              <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow-sm">
                {t.card.newBadge}
              </span>
            )}
          </div>

          {/* Wishlist trigger on card */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 end-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-500 hover:scale-110 transition-all z-20"
            title={isInWishlist ? t.card.removeWishlist : t.card.saveWishlist}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "text-rose-500 fill-rose-500" : ""}`} />
          </button>
        </Link>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400 uppercase tracking-wide font-semibold text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={productHref} className="block">
            <h3 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-titanium-400 line-clamp-2 leading-relaxed h-8">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-xs text-titanium-500 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={product.inventory <= 0 || isAdding}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
          aria-label={`Quick add ${product.name} to cart`}
          title={t.card.addToCart}
        >
          {hasJustAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{t.card.added}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.card.addToCart}</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
