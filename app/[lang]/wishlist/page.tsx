"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { useToast } from "@/components/ToastProvider";
import ProductCard from "@/components/ProductCard";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const { success, info } = useToast();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    for (const item of items) {
      const res = addItem(item, 1);
      if (res.success) addedCount++;
    }
    if (addedCount > 0) {
      success(`Moved ${addedCount} items to your shopping cart!`);
    } else {
      info("Items already in cart or out of stock.");
    }
  };

  const handleClear = () => {
    if (confirm("Clear all items from your wishlist?")) {
      clearWishlist();
      info("Wishlist cleared.");
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center text-titanium-400 font-mono text-xs">
        Loading saved items...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs font-mono text-titanium-400">
        <Link href="/" className="hover:text-cyber-cyan transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> CATALOG
        </Link>
        <span className="text-titanium-600">/</span>
        <span className="text-titanium-100 font-bold">SAVED WISHLIST</span>
      </nav>

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-subtle bg-white/5 border border-white/10 text-[10px] font-mono text-cyber-rose uppercase tracking-wider mb-2">
            <Heart className="w-3 h-3 fill-cyber-rose" /> SAVED ITEMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-titanium-100 uppercase tracking-tight">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs font-mono text-titanium-400 mt-1">
            Keep track of your favorite products and move them to cart anytime.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleMoveAllToCart}
              className="px-4 py-2.5 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-glow"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Cart
            </button>
            <button
              onClick={handleClear}
              className="px-3.5 py-2.5 rounded-subtle btn-titanium font-mono text-xs uppercase tracking-wider text-titanium-400 hover:text-cyber-rose border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      {items.length === 0 ? (
        <div className="glass-panel rounded-card p-12 text-center space-y-4 border border-white/10">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-titanium-500 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-titanium-100">Your wishlist is empty</h3>
          <p className="text-xs font-mono text-titanium-400 max-w-sm mx-auto">
            Explore our live store catalog and click the heart icon on any product to save it here.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold shadow-glow"
            >
              Explore Products
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
