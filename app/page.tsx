import { products } from "@/lib/mockData";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-soft bg-gradient-to-r from-brandA-50 to-brandB-50 p-8">
        <h1 className="text-3xl font-bold">Elevate Every Day</h1>
        <p className="text-ash">New Arrivals curated weekly</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.slice(0, 6).map(p => (
            <li key={p.sku} className="card overflow-hidden">
              <Link href={`/product/${p.sku}`} className="block">
                <div className="w-full h-44 bg-mist overflow-hidden">
                  <img src={p.images?.[0] || '/placeholder-1.jpg'} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-sm text-ash">{p.category}</div>
                  <h3 className="font-semibold mt-1">{p.name}</h3>
                  <div className="mt-2 font-bold">${p.price}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'E‑Commerce Portfolio',
          url: 'https://localhost:3000/',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://localhost:3000/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </section>
  );
}
