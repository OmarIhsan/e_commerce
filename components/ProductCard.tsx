"use client";

import Link from "next/link";
import { Product } from "@/lib/mockData";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCurrencyStore } from "@/lib/currencyStore";
import { useToast } from "@/components/ToastProvider";
import { Star, ShoppingBag, Eye, ArrowRight, Zap, Check, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
        className="glass-card rounded-card p-4 flex flex-col sm:flex-row items-center gap-6 group hover:border-cyber-cyan/40"
      >
        {/* Thumbnail */}
        <Link
          href={`/product/${product.sku}`}
          className="relative w-full sm:w-48 h-48 rounded-soft overflow-hidden bg-titanium-900 shrink-0 border border-white/10"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2.5 left-2.5 rounded-subtle bg-cyber-rose/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-white uppercase shadow-sm">
              -{product.discount}%
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-titanium-950/80 backdrop-blur-md border border-white/10 text-titanium-300 hover:text-cyber-rose transition-colors z-10"
            title={isInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist ? "text-cyber-rose fill-cyber-rose" : ""}`} />
          </button>
        </Link>

        {/* Content details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full py-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] text-cyber-cyan tracking-widest uppercase font-semibold">
                {product.brand}
              </span>
              <span className="text-titanium-600 font-mono text-[10px]">•</span>
              <span className="font-mono text-[10px] text-titanium-400 uppercase tracking-wider">
                SKU: {product.sku}
              </span>
              <span className="text-titanium-600 font-mono text-[10px]">•</span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-cyber-amber">
                <Star className="w-3 h-3 fill-cyber-amber text-cyber-amber" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-titanium-500">({product.reviewsCount})</span>
              </div>
            </div>

            <Link href={`/product/${product.sku}`}>
              <h3 className="text-base font-bold text-titanium-100 group-hover:text-cyber-cyan transition-colors mb-2">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-titanium-400 line-clamp-2 leading-relaxed mb-3">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-titanium-100">
                {formatPrice(product.price)}
              </span>
              {product.compareAt && (
                <span className="font-mono text-xs text-titanium-500 line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickAdd}
                disabled={product.inventory <= 0 || isAdding}
                className="px-4 py-2 rounded-subtle btn-cyber-primary text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-glow disabled:opacity-40"
              >
                {hasJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                  </>
                )}
              </button>
            </div>
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
      className="glass-card rounded-card overflow-hidden flex flex-col justify-between group hover:border-cyber-cyan/40 relative"
    >
      <div>
        {/* Image Container with overlay triggers */}
        <Link
          href={`/product/${product.sku}`}
          className="block relative h-64 w-full overflow-hidden bg-titanium-900 border-b border-white/10"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.discount && product.discount > 0 && (
              <span className="rounded-subtle bg-cyber-rose/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-white uppercase shadow-sm">
                -{product.discount}%
              </span>
            )}
            {product.flags?.includes("new") && (
              <span className="rounded-subtle bg-cyber-cyan/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-titanium-950 uppercase shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist trigger on card */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-titanium-950/80 backdrop-blur-md border border-white/10 text-titanium-300 hover:text-cyber-rose hover:scale-110 transition-all z-20"
            title={isInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist ? "text-cyber-rose fill-cyber-rose" : ""}`} />
          </button>

          {/* Hover preview icon overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <span className="px-3.5 py-1.5 rounded-subtle bg-titanium-950/90 text-titanium-100 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 border border-white/20 shadow-glass">
              <Eye className="w-3.5 h-3.5 text-cyber-cyan" /> Inspect
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          {/* Metadata telemetry */}
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-cyber-cyan uppercase tracking-widest font-semibold">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-cyber-amber">
              <Star className="w-3 h-3 fill-cyber-amber text-cyber-amber" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.sku}`} className="block">
            <h3 className="font-semibold text-sm text-titanium-100 group-hover:text-cyber-cyan transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-titanium-400 line-clamp-2 leading-relaxed h-8">
            {product.description}
          </p>

          <div className="text-[10px] font-mono text-titanium-500 pt-1">
            SKU: <span className="text-titanium-400">{product.sku}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-base font-bold text-titanium-100">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="font-mono text-[11px] text-titanium-500 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={product.inventory <= 0 || isAdding}
          className="p-2 rounded-subtle btn-titanium text-titanium-200 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
          aria-label={`Quick add ${product.name} to cart`}
          title="Quick Add to Cart"
        >
          {hasJustAdded ? (
            <Check className="w-4 h-4 text-cyber-emerald" />
          ) : (
            <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
