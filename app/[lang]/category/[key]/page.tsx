import { fetchPlatziProducts, fetchPlatziCategories } from "@/lib/platziApi";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft, ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ECOM_DICTIONARIES, Locale } from "@/lib/i18nDict";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; key: string }>;
}): Promise<Metadata> {
  const { key, lang } = await params;
  const currentLang = (["en", "ar", "fr"].includes(lang) ? lang : "en") as Locale;
  const dict = ECOM_DICTIONARIES[currentLang] || ECOM_DICTIONARIES.en;
  const name = dict.categories[key as keyof typeof dict.categories] || key.replace(/-/g, " ");
  return {
    title: `${name} | OmarStore`,
    description: `Shop ${name} products with easy online delivery.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: Locale; key: string }>;
}) {
  const { lang, key } = await params;
  const currentLang = (["en", "ar", "fr"].includes(lang) ? lang : "en") as Locale;
  const dict = ECOM_DICTIONARIES[currentLang] || ECOM_DICTIONARIES.en;

  const [allProducts, categories] = await Promise.all([
    fetchPlatziProducts(),
    fetchPlatziCategories(),
  ]);

  const matchedCategory = categories.find(
    (c) => c.id.toLowerCase() === key.toLowerCase()
  );
  const items = allProducts.filter(
    (p) => key.toLowerCase() === "all" || p.category.toLowerCase() === key.toLowerCase()
  );

  const categoryName = dict.categories[key as keyof typeof dict.categories] || (matchedCategory ? matchedCategory.label : key.replace(/-/g, " "));

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-titanium-400">
        <Link
          href={`/${currentLang}`}
          className="hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{dict.product.breadcrumbCatalog}</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <span className="text-white font-semibold capitalize">
          {categoryName}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-titanium-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-400 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>{dict.hero.badge}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight capitalize">
            {categoryName}
          </h1>
          <p className="text-xs text-titanium-400 mt-1">
            {dict.filter.showingCount}: {items.length}
          </p>
        </div>

        <Link
          href={`/${currentLang}?category=${key}`}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{dict.filter.filtersBtn}</span>
        </Link>
      </div>

      {/* Product Grid */}
      {items.length === 0 ? (
        <div className="rounded-2xl bg-titanium-900 border border-white/10 p-12 text-center space-y-4">
          <div className="text-white text-sm font-semibold">
            {dict.filter.noProducts}
          </div>
          <Link
            href={`/${currentLang}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            {dict.product.breadcrumbCatalog}
          </Link>
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