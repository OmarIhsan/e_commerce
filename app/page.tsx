export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-soft bg-mist p-8">
        <h1 className="text-2xl font-semibold">Elevate Every Day</h1>
        <p className="text-ash">New Arrivals curated weekly</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Collections</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <li className="rounded-subtle border border-mist p-6">New Arrivals</li>
          <li className="rounded-subtle border border-mist p-6">Best Sellers</li>
          <li className="rounded-subtle border border-mist p-6">Under 50</li>
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
