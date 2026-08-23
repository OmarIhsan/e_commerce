"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Grid, List, X, Star, Check, RotateCcw } from "lucide-react";
import { categories } from "@/lib/mockData";
import { useEcomI18n } from "@/lib/i18n";

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
  const { locale, t } = useEcomI18n();

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
      router.push(`/${locale}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, locale]
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
    router.push(`/${locale}`, { scroll: false });
  };

  return (
    <div className="space-y-4" id="catalog">
      {/* Primary search bar + controls row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-titanium-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t.filter.searchPlaceholder}
            className="w-full ps-10 pe-10 py-2.5 rounded-lg bg-white dark:bg-titanium-900 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-titanium-100 placeholder:text-slate-400 dark:placeholder:text-titanium-500 shadow-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                updateUrlParams({ q: null });
              }}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-titanium-400 dark:hover:text-white p-1 cursor-pointer"
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
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs border transition-all cursor-pointer ${
              isFilterPanelOpen || activeFilterCount > 0
                ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                : "bg-white dark:bg-titanium-900 text-slate-700 dark:text-titanium-300 border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.filter.filtersBtn}</span>
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
            className="px-3 py-2.5 rounded-lg text-xs text-slate-800 dark:text-titanium-200 cursor-pointer border border-slate-300 dark:border-white/10 bg-white dark:bg-titanium-900 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
          >
            <option value="featured">{t.filter.sortFeatured}</option>
            <option value="price-asc">{t.filter.sortPriceAsc}</option>
            <option value="price-desc">{t.filter.sortPriceDesc}</option>
            <option value="rating">{t.filter.sortRating}</option>
          </select>

          {/* Grid / List switcher */}
          <div className="flex rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-titanium-900/60 p-1 shadow-xs">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-400 dark:text-titanium-500 hover:text-slate-700 dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-400 dark:text-titanium-500 hover:text-slate-700 dark:hover:text-white"
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
          const translatedLabel = t.categories[cat.id as keyof typeof t.categories] || cat.label;
          return (
            <button
              key={cat.id}
              onClick={() => updateUrlParams({ category: cat.id === "all" ? null : cat.id })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "bg-white dark:bg-titanium-900 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-titanium-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/20 shadow-xs"
              }`}
            >
              <span>{translatedLabel}</span>
              <span className={`text-[10px] ${isActive ? "text-blue-200" : "text-slate-400 dark:text-titanium-500"}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expandable Advanced Filter Panel */}
      {isFilterPanelOpen && (
        <div className="p-5 rounded-xl bg-white dark:bg-titanium-900 border border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-titanium-200 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {t.filter.advancedFilters}
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:text-titanium-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {t.filter.resetFilters}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-1">
            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-titanium-300 uppercase tracking-wider block">
                {t.filter.priceRange}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceParam}
                  onChange={(e) => updateUrlParams({ minPrice: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-md bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-titanium-100"
                  min="0"
                />
                <span className="text-slate-400 dark:text-titanium-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceParam}
                  onChange={(e) => updateUrlParams({ maxPrice: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-md bg-slate-50 dark:bg-titanium-950 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-titanium-100"
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
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-titanium-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-titanium-300 uppercase tracking-wider block">
                {t.filter.minRating}
              </label>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: t.filter.allRatings, val: "" },
                  { label: `4.8 ${t.filter.ratingAbove}`, val: "4.8" },
                  { label: `4.5 ${t.filter.ratingAbove}`, val: "4.5" },
                  { label: `4.0 ${t.filter.ratingAbove}`, val: "4.0" },
                ].map((r) => {
                  const isSelected = (minRatingParam || "") === r.val;
                  return (
                    <button
                      key={r.label}
                      onClick={() => updateUrlParams({ minRating: r.val || null })}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-start cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 font-semibold"
                          : "bg-slate-50 dark:bg-titanium-950/60 text-slate-700 dark:text-titanium-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {r.val && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                        {r.label}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inventory / Stock Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-titanium-300 uppercase tracking-wider block">
                {t.filter.availability}
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-titanium-950/60 border border-slate-200 dark:border-white/5 cursor-pointer hover:border-blue-400 dark:hover:border-white/15 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateUrlParams({ inStock: e.target.checked ? "true" : null })}
                  className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-titanium-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-900 dark:text-titanium-100">{t.filter.inStockOnly}</span>
                  <span className="text-[10px] text-slate-500 dark:text-titanium-400">{t.filter.inStockDesc}</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active telemetry results counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-titanium-400 px-1">
        <span>
          {t.filter.showingCount}: <strong className="text-slate-900 dark:text-titanium-100 font-bold">{totalResults}</strong>
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-xs cursor-pointer font-medium"
          >
            {t.filter.clearFilters} ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );
}
