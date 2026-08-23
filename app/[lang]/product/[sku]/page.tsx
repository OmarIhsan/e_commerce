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
import { ECOM_DICTIONARIES, Locale } from "@/lib/i18nDict";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = await fetchPlatziProductBySku(sku);
  if (!product) return { title: "Product Not Found | OmarStore" };
  return {
    title: `${product.name} | OmarStore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; sku: string }>;
}) {
  const { lang, sku } = await params;
  const currentLang = (["en", "ar", "fr"].includes(lang) ? lang : "en") as Locale;
  const dict = ECOM_DICTIONARIES[currentLang] || ECOM_DICTIONARIES.en;

  const product = await fetchPlatziProductBySku(sku);

  if (!product) {
    notFound();
  }

  const allProducts = await fetchPlatziProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.sku !== product.sku)
    .slice(0, 4);

  const categoryName = dict.categories[product.category as keyof typeof dict.categories] || product.category;

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-titanium-400">
        <Link
          href={`/${currentLang}`}
          className="hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{dict.product.breadcrumbCatalog}</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <Link
          href={`/${currentLang}?category=${product.category}`}
          className="hover:text-blue-400 transition-colors capitalize"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-titanium-600" />
        <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-titanium-950/80 aspect-4/3 relative group shadow-md">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Desktop Specs & Description */}
          <div className="hidden lg:block space-y-6 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-titanium-200">
                {dict.product.overview}
              </h3>
              <p className="text-sm text-titanium-300 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {product.specs && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-titanium-200">
                  {dict.product.specifications}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-lg bg-titanium-900 border border-white/5"
                    >
                      <div className="text-titanium-400 text-[10px] uppercase">{key}</div>
                      <div className="text-titanium-200 font-semibold mt-0.5">{val}</div>
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
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-titanium-300">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-titanium-500">({product.reviewsCount})</span>
                </div>
                <ProductReviewModal productName={product.name} sku={product.sku} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="text-xs text-titanium-400">
              SKU: <span className="text-titanium-300 font-medium">{product.sku}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-titanium-900 border border-white/10 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAt && (
              <span className="text-sm text-titanium-500 line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
            {product.discount && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 uppercase">
                -{product.discount}% {dict.card.off}
              </span>
            )}
          </div>

          <ProductActions product={product} />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-titanium-900/60 border border-white/5 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-tight text-titanium-300">
                <span className="font-semibold text-white block">{dict.product.freeDelivery}</span>
                {dict.benefits.shippingDesc}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-titanium-900/60 border border-white/5 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-[11px] leading-tight text-titanium-300">
                <span className="font-semibold text-white block">{dict.product.verifiedItem}</span>
                {dict.benefits.qualityDesc}
              </div>
            </div>
          </div>

          <div className="lg:hidden space-y-4 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-titanium-200">
                {dict.product.overview}
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
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span>{dict.product.reviews} ({product.reviewsCount})</span>
            </h2>
            <p className="text-xs text-titanium-400 mt-0.5">
              {dict.benefits.qualityDesc}
            </p>
          </div>
          <ProductReviewModal productName={product.name} sku={product.sku} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-titanium-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Alex M.</span>
              <div className="flex text-amber-400 text-xs">★★★★★</div>
            </div>
            <h4 className="font-semibold text-xs text-blue-400">
              {currentLang === "ar" ? "جودة ممتازة وخامة رائعة" : currentLang === "fr" ? "Très bonne qualité et belle matière" : "Great quality and super comfortable"}
            </h4>
            <p className="text-xs text-titanium-300 leading-relaxed">
              {currentLang === "ar" ? "المنتج وصل سريعاً وكان مطابقاً للوصف تماماً. أنصح به بشدة." : currentLang === "fr" ? "Le produit est arrivé rapidement et conforme à la description." : "Arrived quickly and exact match to pictures. Will buy again."}
            </p>
            <span className="text-[10px] text-titanium-500 block">
              {currentLang === "ar" ? "مشترٍ موثق • قبل يومين" : currentLang === "fr" ? "Acheteur vérifié • il y a 2 jours" : "Verified Buyer • 2 days ago"}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-titanium-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Sarah T.</span>
              <div className="flex text-amber-400 text-xs">★★★★★</div>
            </div>
            <h4 className="font-semibold text-xs text-blue-400">
              {currentLang === "ar" ? "مقاس مظبوط ومريح جداً" : currentLang === "fr" ? "Taille parfaite et agréable à porter" : "True to size and very pleasant"}
            </h4>
            <p className="text-xs text-titanium-300 leading-relaxed">
              {currentLang === "ar" ? "مريح جداً في اللبس اليومي والخامة ناعمة وعالية الجودة." : currentLang === "fr" ? "Très agréable au quotidien, tissu doux et résistant." : "Feels great for everyday use. Really happy with this purchase."}
            </p>
            <span className="text-[10px] text-titanium-500 block">
              {currentLang === "ar" ? "مشترٍ موثق • قبل 5 أيام" : currentLang === "fr" ? "Acheteur vérifié • il y a 5 jours" : "Verified Buyer • 5 days ago"}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-titanium-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">David L.</span>
              <div className="flex text-amber-400 text-xs">★★★★☆</div>
            </div>
            <h4 className="font-semibold text-xs text-blue-400">
              {currentLang === "ar" ? "سعر مناسب وممتاز" : currentLang === "fr" ? "Super rapport qualité prix" : "Great value for money"}
            </h4>
            <p className="text-xs text-titanium-300 leading-relaxed">
              {currentLang === "ar" ? "تصميم جميل وأنيق وسعر مناسب جداً مقابل الجودة." : currentLang === "fr" ? "Joli design sobre et prix très correct pour cette qualité." : "Clean look and great price for the quality provided."}
            </p>
            <span className="text-[10px] text-titanium-500 block">
              {currentLang === "ar" ? "مشترٍ موثق • قبل أسبوع" : currentLang === "fr" ? "Acheteur vérifié • il y a 1 semaine" : "Verified Buyer • 1 week ago"}
            </span>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {dict.product.relatedProducts}
              </h2>
              <p className="text-xs text-titanium-400 mt-0.5">
                {dict.hero.subtitle}
              </p>
            </div>
            <Link
              href={`/${currentLang}`}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>{dict.hero.explore}</span>
              <ChevronRight className="w-3.5 h-3.5" />
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