"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/mockData";
import CatalogFilter from "@/components/CatalogFilter";
import ProductCard from "@/components/ProductCard";
import { AnimatePresence, motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CatalogView() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const query = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const inStock = searchParams.get("inStock") === "true";
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const sortBy = searchParams.get("sort") || "featured";

  const products = searchProducts(
    query,
    category,
    minPrice,
    maxPrice,
    inStock,
    minRating,
    sortBy
  );

  return (
    <div className="space-y-8">
      {/* Real Retail Hero Banner */}
      <section className="relative rounded-2xl bg-gradient-to-br from-titanium-900 via-titanium-850 to-titanium-900 p-8 sm:p-12 overflow-hidden border border-white/10 shadow-lg">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Summer Collection 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Discover Everyday Style &amp; Quality Apparel
          </h1>

          <p className="text-sm sm:text-base text-titanium-300 leading-relaxed max-w-2xl font-normal">
            Upgrade your wardrobe with comfortable essentials, trending footwear, and durable accessories. Free shipping on orders over $75 and easy 30-day returns.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/?category=men"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-colors shadow-sm flex items-center gap-1.5"
            >
              Shop Men <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/?category=women"
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide border border-white/15 transition-colors"
            >
              Shop Women
            </Link>
            <Link
              href="/?category=footwear"
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wide border border-white/15 transition-colors"
            >
              Footwear
            </Link>
          </div>
        </div>
      </section>

      {/* Real Retail 4-Pillar Value Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-titanium-900/60 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Free Express Shipping</h4>
            <p className="text-[11px] text-titanium-400">On all orders over $75</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-titanium-900/60 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">30-Day Easy Returns</h4>
            <p className="text-[11px] text-titanium-400">Hassle-free refunds</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-titanium-900/60 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Secure Checkout</h4>
            <p className="text-[11px] text-titanium-400">100% encrypted payment</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-titanium-900/60 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Verified Quality</h4>
            <p className="text-[11px] text-titanium-400">Curated authentic gear</p>
          </div>
        </div>
      </div>

      {/* Catalog Filter Controls */}
      <CatalogFilter
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={products.length}
      />

      {/* Products Display Grid / List */}
      {products.length === 0 ? (
        <div className="rounded-2xl bg-titanium-900/40 p-12 text-center space-y-4 border border-white/10">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-titanium-400 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No products found</h3>
          <p className="text-xs text-titanium-400 max-w-sm mx-auto">
            Try adjusting your search keywords or clearing filters to see more items.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Reset Filters
            </Link>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <ProductCard
                key={product.sku}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
