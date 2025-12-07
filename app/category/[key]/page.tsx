import { findByCategory, categories } from "@/lib/mockData";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category — E‑Commerce Portfolio",
  description: "Browse curated products with filters and sorting.",
};

export default function CategoryPage({ params, searchParams }: { params: { key: string }, searchParams?: Record<string, string | string[]> }) {
  const key = params.key;
  const valid = categories.includes(key);
  let items = valid ? findByCategory(key) : [];

  // Read sort and filters from URL
  const sortParam = typeof searchParams?.sort === "string" ? searchParams!.sort : "name";
  const priceBand = typeof searchParams?.price === "string" ? searchParams!.price : ""; // low|mid|high
  const flag = typeof searchParams?.flag === "string" ? searchParams!.flag : ""; // new|best|under50

  // Filter by price bands
  items = items.filter(p => {
    if (priceBand === "low") return p.price < 30;
    if (priceBand === "mid") return p.price >= 30 && p.price <= 80;
    if (priceBand === "high") return p.price > 80;
    return true;
  });

  // Filter by flags
  items = items.filter(p => {
    if (!flag) return true;
    const flags = (p.flags || []).map(f => f.toLowerCase());
    if (flag === "new") return flags.includes("new");
    if (flag === "best") return flags.includes("best");
    if (flag === "under50") return flags.includes("under50");
    return true;
  });

  // Sort
  const sort = sortParam;
  items = items.slice().sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <section className="space-y-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold capitalize">{key.replace(/-/g, " ")}</h1>
        <div className="text-ash text-sm">{items.length} products</div>
      </header>

      {!valid && (
        <p className="text-danger">Category not found.</p>
      )}

      {valid && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-ash flex items-center gap-4">
              <span>Price:</span>
              <Link href={`?price=low&sort=${sort}`} className="hover:underline">Low</Link>
              <Link href={`?price=mid&sort=${sort}`} className="hover:underline">Mid</Link>
              <Link href={`?price=high&sort=${sort}`} className="hover:underline">High</Link>
              <Link href={`?`} className="hover:underline">Reset</Link>
            </div>
            <div className="text-sm flex items-center gap-2">
              <span className="text-ash">Flags:</span>
              <Link href={`?flag=new&sort=${sort}`} className="hover:underline">New</Link>
              <Link href={`?flag=best&sort=${sort}`} className="hover:underline">Best</Link>
              <Link href={`?flag=under50&sort=${sort}`} className="hover:underline">Under50</Link>
            </div>
            <div className="text-sm">
              <span className="mr-2 text-ash">Sort</span>
              <Link href={`?sort=name`} className="mr-2 hover:underline">Name</Link>
              <Link href={`?sort=price-asc`} className="mr-2 hover:underline">Price ↑</Link>
              <Link href={`?sort=price-desc`} className="hover:underline">Price ↓</Link>
            </div>
          </div>
          <Suspense fallback={<p className="text-ash">Loading…</p>}>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {items.map(p => (
                <li key={p.sku} className="border border-mist rounded-subtle p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-ash">SKU {p.sku}</div>
                  <div className="mt-2 font-semibold">${p.price}</div>
                  <Link href={`/product/${p.sku}`} className="mt-3 inline-block text-indigo hover:underline">View</Link>
                </li>
              ))}
            </ul>
          </Suspense>
        </>
      )}
    </section>
  );
}
