import { searchProducts, categories, Product } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft, ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { key: string } }): Promise<Metadata> {
  const cat = categories.find((c) => c.id === params.key);
  const name = cat ? cat.label : params.key.replace(/-/g, " ");
  return {
    title: `${name} Collection | TITAN.LAB`,
    description: `High-precision curated ${name} apparel and EDC tactical gear.`,
  };
}

export default function CategoryPage({
  params,
}: {
  params: { key: string };
}) {
  const key = params.key;
  const matchedCategory = categories.find((c) => c.id.toLowerCase() === key.toLowerCase());
  const items = searchProducts(undefined, key);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-titanium-400">
        <Link href="/" className="hover:text-cyber-cyan transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> CATALOG
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <span className="text-titanium-100 uppercase font-bold">
          {matchedCategory ? matchedCategory.label : key.replace(/-/g, " ")}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-subtle bg-white/5 border border-white/10 text-[10px] font-mono text-cyber-cyan uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> CATEGORY INDEX
          </div>
          <h1 className="text-3xl font-extrabold text-titanium-100 uppercase tracking-tight">
            {matchedCategory ? matchedCategory.label : key.replace(/-/g, " ")}
          </h1>
          <p className="text-xs font-mono text-titanium-400 mt-1">
            Displaying {items.length} verified tactical items in this production line.
          </p>
        </div>

        <Link
          href={`/?category=${key}`}
          className="px-4 py-2.5 rounded-subtle btn-cyber-primary font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 self-start sm:self-auto shadow-glow"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Open Faceted Engine
        </Link>
      </div>

      {/* Product Grid */}
      {items.length === 0 ? (
        <div className="glass-panel p-12 rounded-card text-center text-xs font-mono text-titanium-400 space-y-3">
          <p>No products found in this category index.</p>
          <Link href="/" className="text-cyber-cyan hover:underline">
            &larr; Return to main catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.sku} product={product} viewMode="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
