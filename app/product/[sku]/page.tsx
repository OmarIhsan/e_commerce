import { findBySku, products, Product } from "@/lib/mockData";
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
  const product = findBySku(params.sku);
  if (!product) {
    return {
      title: "Product Not Found | TITAN.LAB",
    };
  }

  return {
    title: `${product.name} | ${product.brand} - TITAN.LAB`,
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

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = findBySku(params.sku);

  if (!product) {
    notFound();
  }

  // Related products from the same category or overall catalog
  const relatedProducts = products
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
          href={`/?category=${product.category}`}
          className="uppercase hover:text-cyber-cyan transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <span className="text-titanium-200 truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Interactive Zoom Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Information, Specs, Variants, Cart Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-card space-y-6">
            {/* Header Telemetry */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono mb-2">
                <span className="text-cyber-cyan font-bold tracking-widest uppercase">
                  {product.brand}
                </span>
                <span className="text-titanium-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-titanium-100 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews pill */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-cyber-amber text-xs font-mono bg-white/5 px-2.5 py-1 rounded-subtle border border-white/5">
                  <Star className="w-3.5 h-3.5 fill-cyber-amber text-cyber-amber" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                  <span className="text-titanium-500">({product.reviewsCount} reviews)</span>
                </div>

                <div className="text-[11px] font-mono text-cyber-emerald flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald"></span>
                  {product.inventory > 5 ? `${product.inventory} UNITS VERIFIED IN STOCK` : `LOW STOCK: ONLY ${product.inventory} REMAINING`}
                </div>
              </div>
            </div>

            {/* Price & Discounts */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-white/5">
              <span className="font-mono text-3xl font-black text-titanium-100">
                {formatCurrency(product.price)}
              </span>
              {product.compareAt && (
                <span className="font-mono text-sm text-titanium-500 line-through">
                  {formatCurrency(product.compareAt)}
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="rounded-subtle bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/30 px-2 py-0.5 text-xs font-mono font-bold">
                  SAVE {product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-titanium-300 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {/* Interactive Actions (Sizes, Qty, Add to Cart) */}
            <ProductActions product={product} />
          </div>

          {/* Technical Specifications Accordion / Panel */}
          {product.specs && (
            <div className="glass-panel p-6 rounded-card space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-titanium-200 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-cyber-cyan" />
                <span>TECHNICAL SPECIFICATIONS &amp; ORIGIN</span>
              </div>

              <div className="divide-y divide-white/5 text-xs font-mono">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="py-2.5 flex items-center justify-between">
                    <span className="text-titanium-400">{key}</span>
                    <span className="text-titanium-200 font-semibold text-right">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews & Quality Breakdown */}
      <section className="glass-panel p-8 rounded-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-xl font-bold text-titanium-100">Customer Performance &amp; Reviews</h2>
            <p className="text-xs font-mono text-titanium-400 mt-1">
              Aggregated from verified field tests and purchaser evaluations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-mono font-black text-cyber-cyan">
              {product.rating.toFixed(1)}
            </div>
            <div className="space-y-1">
              <div className="flex text-cyber-amber">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-cyber-amber text-cyber-amber" />
                ))}
              </div>
              <div className="text-[11px] font-mono text-titanium-400">
                {product.reviewsCount} verified ratings
              </div>
            </div>
          </div>
        </div>

        {/* Sample Customer Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-soft bg-titanium-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-titanium-200">Alex K. (Verified Buyer)</span>
              <span className="text-[10px] font-mono text-titanium-500">2 days ago</span>
            </div>
            <div className="flex text-cyber-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-cyber-amber text-cyber-amber" />
              ))}
            </div>
            <p className="text-xs text-titanium-300 leading-relaxed">
              "Exceptional build quality and weight. The fabric feel and tailoring exceed the photos. Instant staple in my everyday rotation."
            </p>
          </div>

          <div className="p-4 rounded-soft bg-titanium-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-titanium-200">Marcus T. (Verified Buyer)</span>
              <span className="text-[10px] font-mono text-titanium-500">1 week ago</span>
            </div>
            <div className="flex text-cyber-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-cyber-amber text-cyber-amber" />
              ))}
            </div>
            <p className="text-xs text-titanium-300 leading-relaxed">
              "Sub-second checkout was super smooth. The hardware and materials are truly top notch. Highly recommended."
            </p>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-titanium-100">Engineered Combinations</h2>
            <p className="text-xs font-mono text-titanium-400">Complete the setup with matched tactical gear.</p>
          </div>
          <Link href="/" className="text-xs font-mono text-cyber-cyan hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.sku} product={p} viewMode="grid" />
          ))}
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            sku: product.sku,
            image: product.images,
            description: product.description,
            brand: {
              "@type": "Brand",
              name: product.brand,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: product.price,
              availability:
                product.inventory > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewsCount,
            },
          }),
        }}
      />
    </div>
  );
}
