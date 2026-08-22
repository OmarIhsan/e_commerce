import { fetchPlatziProductBySku, fetchPlatziProducts } from "@/lib/platziApi";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import ProductReviewModal from "@/components/ProductReviewModal";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Star,
  MessageSquare,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; sku: string };
}): Promise<Metadata> {
  const product = await fetchPlatziProductBySku(params.sku);
  if (!product) return { title: "Product Not Found | Store" };
  return {
    title: `${product.name} | Store`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { lang: string; sku: string };
}) {
  const { lang, sku } = params;
  const product = await fetchPlatziProductBySku(sku);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchPlatziProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.sku !== product.sku)
    .slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-titanium-400">
        <Link
          href={`/${lang}`}
          className="hover:text-cyber-cyan transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" /> CATALOG
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <Link
          href={`/${lang}/category/${product.category}`}
          className="hover:text-cyber-cyan transition-colors uppercase"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <span className="text-titanium-100 truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-card border border-white/10 overflow-hidden bg-titanium-950/80 aspect-4/3 relative group">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Desktop Specs & Description */}
          <div className="hidden lg:block space-y-6 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-titanium-200">
                OVERVIEW
              </h3>
              <p className="text-sm text-titanium-300 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {product.specs && (
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-titanium-200">
                  SPECIFICATIONS
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-subtle bg-white/5 border border-white/5"
                    >
                      <div className="text-titanium-400 text-[10px] font-mono uppercase">{key}</div>
                      <div className="font-mono text-titanium-200 font-semibold">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Information & Add to Cart */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-pill bg-white/5 border border-white/10 text-xs font-mono text-titanium-300">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-titanium-500">({product.reviewsCount})</span>
                </div>
                <ProductReviewModal productName={product.name} sku={product.sku} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-titanium-100 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="font-mono text-xs text-titanium-500">
              SKU: <span className="text-titanium-300">{product.sku}</span>
            </div>
          </div>

          <div className="p-4 rounded-card glass-panel border border-white/10 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-mono text-titanium-100">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAt && (
              <span className="text-sm font-mono text-titanium-500 line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
            {product.discount && (
              <span className="px-2 py-0.5 rounded-pill bg-cyber-magenta/15 border border-cyber-magenta/40 text-[10px] font-mono font-bold text-cyber-magenta uppercase tracking-wider">
                Save {product.discount}%
              </span>
            )}
          </div>

          <ProductActions product={product} />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-subtle bg-white/5 border border-white/5 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyber-emerald shrink-0" />
              <div className="text-[11px] leading-tight text-titanium-300">
                <span className="font-semibold text-titanium-100 block">Fast Delivery</span>
                Dispatched in 24h
              </div>
            </div>
            <div className="p-3 rounded-subtle bg-white/5 border border-white/5 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyber-cyan shrink-0" />
              <div className="text-[11px] leading-tight text-titanium-300">
                <span className="font-semibold text-titanium-100 block">Authentic Item</span>
                Direct from API
              </div>
            </div>
          </div>

          <div className="lg:hidden space-y-4 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-titanium-200">
                OVERVIEW
              </h3>
              <p className="text-sm text-titanium-300 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="space-y-6 pt-10 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-titanium-100 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyber-cyan" />
              Customer Reviews ({product.reviewsCount})
            </h2>
            <p className="text-xs font-mono text-titanium-400 mt-0.5">
              Verified feedback from recent buyers
            </p>
          </div>
          <ProductReviewModal productName={product.name} sku={product.sku} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-card glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-titanium-100">Jordan K.</span>
              <div className="flex text-amber-400 text-xs">★★★★★</div>
            </div>
            <h4 className="font-semibold text-xs text-cyber-cyan">Exceptional quality and finish</h4>
            <p className="text-xs text-titanium-300 leading-relaxed">
              Material exceeded my expectations. Arrived quickly with verified tracking.
            </p>
            <span className="text-[10px] font-mono text-titanium-500 block">Verified Buyer • 2 days ago</span>
          </div>

          <div className="p-5 rounded-card glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-titanium-100">Samantha T.</span>
              <div className="flex text-amber-400 text-xs">★★★★★</div>
            </div>
            <h4 className="font-semibold text-xs text-cyber-cyan">True to size &amp; super comfortable</h4>
            <p className="text-xs text-titanium-300 leading-relaxed">
              Fits perfectly and feels great throughout daily wear. Will definitely buy again.
            </p>
            <span className="text-[10px] font-mono text-titanium-500 block">Verified Buyer • 5 days ago</span>
          </div>

          <div className="p-5 rounded-card glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-titanium-100">David R.</span>
              <div className="flex text-amber-400 text-xs">★★★★☆</div>
            </div>
            <h4 className="font-semibold text-xs text-cyber-cyan">Great value for money</h4>
            <p className="text-xs text-titanium-300 leading-relaxed">
              Clean minimalist look and accurate colors as shown in the gallery pictures.
            </p>
            <span className="text-[10px] font-mono text-titanium-500 block">Verified Buyer • 1 week ago</span>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-titanium-100 tracking-tight">
                Recommended Items
              </h2>
              <p className="text-xs font-mono text-titanium-400 mt-0.5">
                Explore more curated products
              </p>
            </div>
            <Link
              href={`/${lang}`}
              className="text-xs font-mono text-cyber-cyan hover:underline flex items-center gap-1"
            >
              View Full Catalog <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.sku} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}