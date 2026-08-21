import { fetchPlatziProductBySku, fetchPlatziProducts } from "@/lib/platziApi";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShieldCheck, ChevronRight, Sparkles, Layers, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductPageProps {
  params: {
    sku: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchPlatziProductBySku(params.sku);
  if (!product) {
    return {
      title: "Product Not Found | Store",
    };
  }

  return {
    title: `${product.name} | ${product.brand} - Store`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${formatCurrency(product.price)}`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await fetchPlatziProductBySku(params.sku);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchPlatziProducts();
  const relatedProducts = allProducts
    .filter((p) => p.sku !== product.sku)
    .slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs font-mono text-titanium-400">
        <Link href="/" className="hover:text-cyber-cyan transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> CATALOG
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <Link
          href={`/category/${product.category}`}
          className="hover:text-cyber-cyan transition-colors uppercase"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <span className="text-titanium-100 uppercase font-bold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <ProductGallery images={product.images} productName={product.name} />

          {/* Desktop Product Description & Specs Accordion */}
          <div className="hidden lg:block space-y-6 pt-6 border-t border-white/10">
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-titanium-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyber-cyan" />
                OVERVIEW
              </h3>
              <p className="text-sm text-titanium-300 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {product.specs && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-titanium-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyber-cyan" />
                  PRODUCT DETAILS
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-subtle bg-white/5 border border-white/5 space-y-0.5"
                    >
                      <div className="font-mono text-[10px] text-titanium-400 uppercase">{key}</div>
                      <div className="font-mono text-titanium-200 font-semibold">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Information & Add to Cart Container */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Metadata */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-cyber-cyan uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-pill bg-white/5 border border-white/10 text-xs font-mono text-titanium-300">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-titanium-500">({product.reviewsCount})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-titanium-100 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="font-mono text-xs text-titanium-500">
              SKU: <span className="text-titanium-300">{product.sku}</span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 rounded-card glass-panel border border-white/10 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-mono text-titanium-100">
              {formatCurrency(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-sm font-mono text-titanium-500 line-through">
                {formatCurrency(product.compareAt)}
              </span>
            )}
            {product.discount && (
              <span className="px-2 py-0.5 rounded-pill bg-cyber-magenta/15 border border-cyber-magenta/40 text-[10px] font-mono font-bold text-cyber-magenta uppercase tracking-wider">
                Save {product.discount}%
              </span>
            )}
          </div>

          {/* Interactive Variant Options & Add to Cart Client Component */}
          <ProductActions product={product} />

          {/* Guarantee Badges */}
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

          {/* Mobile Product Description */}
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

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-white/10">
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
              href="/"
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
