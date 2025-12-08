import { findBySku } from "@/lib/mockData";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";

export default function ProductPage({ params }: { params: { sku: string } }) {
  const product = findBySku(params.sku);
  if (!product) return <p className="text-danger">Product not found.</p>;

  

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductGallery images={product.images} />
      <div>
        <div className="card p-6">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-ash text-sm">SKU {product.sku}</div>
          <div className="mt-2 text-2xl font-extrabold">${product.price}</div>
          <p className="mt-4 text-ash">{product.description ?? 'Premium materials and timeless design.'}</p>
          <div className="mt-4">
            <h2 className="font-semibold">Reviews</h2>
            <p className="text-sm text-ash">Average {product.rating ?? 4.5} from {product.reviewsCount ?? 0} reviews.</p>
          </div>
          <ProductActions product={product} />
        </div>
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            sku: product.sku,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: product.price,
              availability: product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            },
            aggregateRating: product.rating ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewsCount ?? 0,
            } : undefined
          })}
        </script>
      </div>
    </section>
  );
}
