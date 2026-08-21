"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/mockData";
import CatalogFilter from "@/components/CatalogFilter";
import ProductCard from "@/components/ProductCard";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, ArrowDownRight, Sparkles, Shield, Cpu, RefreshCw } from "lucide-react";

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
      {/* Hero Telemetry Section */}
      <section className="relative rounded-card glass-panel p-8 sm:p-10 overflow-hidden border border-white/10">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyber-indigo/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-subtle bg-white/5 border border-white/10 text-xs font-mono text-cyber-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FAST &amp; RESPONSIVE STOREFRONT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-titanium-100 tracking-tight leading-tight">
            Premium Everyday Carry &amp; Technical Apparel.
          </h1>

          <p className="text-sm sm:text-base text-titanium-300 leading-relaxed max-w-2xl font-normal">
            Carefully curated gear crafted from durable Cordura, Kuroki selvedge denim, and weatherproof fabrics. Browse items, filter by category, and enjoy an instant checkout experience.
          </p>

          {/* Quick Store Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="space-y-1">
              <div className="font-mono text-xs text-titanium-400">DISCOVERY</div>
              <div className="font-mono text-lg font-bold text-cyber-cyan">Instant Search</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-titanium-400">SHOPPING CART</div>
              <div className="font-mono text-lg font-bold text-titanium-100">Live Auto-Save</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-titanium-400">CHECKOUT</div>
              <div className="font-mono text-lg font-bold text-cyber-emerald">1-Click Test</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-titanium-400">INVOICE</div>
              <div className="font-mono text-lg font-bold text-titanium-100">Live Receipt</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Filter Controls */}
      <CatalogFilter
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={products.length}
      />

      {/* Products Display Grid / List */}
      {products.length === 0 ? (
        <div className="glass-panel rounded-card p-12 text-center space-y-4 border border-white/10">
          <div className="w-14 h-14 mx-auto rounded-pill bg-white/5 border border-white/10 flex items-center justify-center text-titanium-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-base font-mono font-bold uppercase tracking-wider text-titanium-200">
            NO ITEMS MATCHED YOUR ACTIVE FILTERS
          </h3>
          <p className="text-xs text-titanium-400 max-w-sm mx-auto">
            Try adjusting your search terms, removing price caps, or resetting the category filter.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-subtle btn-titanium text-xs font-mono uppercase tracking-wider"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
          </a>
        </div>
      ) : (
        <motion.div
          layout
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
        </motion.div>
      )}
    </div>
  );
}
