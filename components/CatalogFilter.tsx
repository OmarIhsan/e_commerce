"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Grid, List, X, Star, Check, RotateCcw } from "lucide-react";
import { categories } from "@/lib/mockData";

interface CatalogFilterProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalResults: number;
}

export default function CatalogFilter({
  viewMode,
  onViewModeChange,
  totalResults,
}: CatalogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const inStockParam = searchParams.get("inStock") === "true";
  const minRatingParam = searchParams.get("minRating") || "";
  const sortParam = searchParams.get("sort") || "featured";

  // Local state for debounced search
  const [searchValue, setSearchValue] = useState(queryParam);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Sync internal state when URL changes externally
  useEffect(() => {
    setSearchValue(queryParam);
  }, [queryParam]);

  // Update URL helper
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "" || (key === "category" && val === "all")) {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== queryParam) {
        updateUrlParams({ q: searchValue.trim() ? searchValue.trim() : null });
      }
    }, 280);
    return () => clearTimeout(handler);
  }, [searchValue, queryParam, updateUrlParams]);

  const activeFilterCount = [
    categoryParam !== "all" ? 1 : 0,
    minPriceParam ? 1 : 0,
    maxPriceParam ? 1 : 0,
    inStockParam ? 1 : 0,
    minRatingParam ? 1 : 0,
    queryParam ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleResetFilters = () => {
    setSearchValue("");
    router.push("/", { scroll: false });
  };

  return (
    <div className="space-y-4" id="catalog">
      {/* Primary search bar + controls row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input with keyboard shortcut pill */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-titanium-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products, clothing, shoes, accessories..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg titanium-input text-xs text-titanium-100 placeholder:text-titanium-500 shadow-inner border border-white/10"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                updateUrlParams({ q: null });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-titanium-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls (Sort, Filter toggle, View Mode) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
          {/* Filter toggle button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs border transition-all ${
              isFilterPanelOpen || activeFilterCount > 0
                ? "bg-blue-600/20 border-blue-500 text-blue-400 font-semibold"
                : "btn-titanium text-titanium-300 border-white/10"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort selector */}
          <select
            value={sortParam}
            onChange={(e) => updateUrlParams({ sort: e.target.value })}
            className="px-3 py-2.5 rounded-lg titanium-input text-xs text-titanium-200 cursor-pointer border border-white/10 bg-titanium-900"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated (★)</option>
            <option value="reviews">Most Reviews</option>
          </select>

          {/* Grid / List switcher */}
          <div className="flex rounded-soft border border-white/10 bg-titanium-900/60 p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-subtle transition-colors ${
                viewMode === "grid"
                  ? "bg-white/10 text-cyber-cyan"
                  : "text-titanium-500 hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-subtle transition-colors ${
                viewMode === "list"
                  ? "bg-white/10 text-cyber-cyan"
                  : "text-titanium-500 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = categoryParam === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => updateUrlParams({ category: cat.id === "all" ? null : cat.id })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "bg-titanium-900 border border-white/10 text-titanium-300 hover:text-white hover:border-white/20"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] ${isActive ? "text-blue-200" : "text-titanium-500"}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expandable Advanced Filter Panel */}
      {isFilterPanelOpen && (
        <div className="p-5 rounded-card glass-panel space-y-4 border border-cyber-cyan/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-titanium-200 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyber-cyan" /> ADVANCED FACETED FILTERING
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-mono text-titanium-400 hover:text-cyber-rose transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-1">
            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                Price Range ($USD)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceParam}
                  onChange={(e) => updateUrlParams({ minPrice: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-subtle titanium-input text-xs font-mono"
                  min="0"
                />
                <span className="text-titanium-500 font-mono">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceParam}
                  onChange={(e) => updateUrlParams({ maxPrice: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-subtle titanium-input text-xs font-mono"
                  min="0"
                />
              </div>
              {/* Quick price presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "< $50", min: "", max: "50" },
                  { label: "$50-$100", min: "50", max: "100" },
                  { label: "$100-$150", min: "100", max: "150" },
                  { label: "$150+", min: "150", max: "" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => updateUrlParams({ minPrice: preset.min || null, maxPrice: preset.max || null })}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-titanium-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                Minimum Rating
              </label>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "All Ratings", val: "" },
                  { label: "4.8 & Above", val: "4.8" },
                  { label: "4.5 & Above", val: "4.5" },
                  { label: "4.0 & Above", val: "4.0" },
                ].map((r) => {
                  const isSelected = (minRatingParam || "") === r.val;
                  return (
                    <button
                      key={r.label}
                      onClick={() => updateUrlParams({ minRating: r.val || null })}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-subtle text-xs font-mono transition-colors text-left ${
                        isSelected
                          ? "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 font-semibold"
                          : "bg-titanium-900/60 text-titanium-300 hover:text-white border border-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {r.val && <Star className="w-3 h-3 fill-cyber-amber text-cyber-amber" />}
                        {r.label}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-cyber-cyan" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inventory / Stock Filter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-titanium-300 uppercase tracking-wider block">
                Availability & Stock
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-subtle bg-titanium-900/60 border border-white/5 cursor-pointer hover:border-white/15 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateUrlParams({ inStock: e.target.checked ? "true" : null })}
                  className="rounded border-white/20 bg-titanium-950 text-cyber-cyan focus:ring-cyber-cyan h-4 w-4"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium text-titanium-100">In-Stock Items Only</span>
                  <span className="text-[10px] text-titanium-400">Exclude zero-inventory SKUs</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active telemetry results counter */}
      <div className="flex items-center justify-between text-xs font-mono text-titanium-400 px-1">
        <span>
          SHOWING <strong className="text-titanium-100 font-bold">{totalResults}</strong> SPECIFIED ITEMS
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-cyber-cyan hover:underline flex items-center gap-1"
          >
            Clear active filters ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );
}
