import { Product, products as fallbackProducts, categories as fallbackCategories } from "./mockData";

export interface PlatziCategory {
  id: number;
  name: string;
  image: string;
}

export interface PlatziProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: PlatziCategory;
  images: string[];
}

const PLATZI_API_BASE = "https://api.escuelajs.co/api/v1";

/**
 * Cleans image URL strings which may be wrapped in json-like brackets
 */
function cleanImageUrl(url: string): string {
  if (!url) return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85&auto=format&fit=crop";
  let cleaned = url.trim();
  if (cleaned.startsWith('["') || cleaned.startsWith("['")) {
    cleaned = cleaned.replace(/^\[['"]|['"]\]$/g, "");
  }
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  if (!cleaned.startsWith("http")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85&auto=format&fit=crop";
  }
  return cleaned;
}

/**
 * Transforms a Platzi API Product to the app's internal Product schema
 */
export function mapPlatziToProduct(p: PlatziProduct): Product {
  const cleanedImages = Array.isArray(p.images) && p.images.length > 0
    ? p.images.map(cleanImageUrl).filter(Boolean)
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85&auto=format&fit=crop"];

  const categoryName = p.category?.name?.toLowerCase() || "accessories";
  const normalizedCategory = categoryName.includes("cloth") ? "men"
    : categoryName.includes("shoe") ? "footwear"
    : categoryName.includes("electron") ? "tech-accessories"
    : categoryName.includes("women") ? "women"
    : "accessories";

  return {
    sku: `PLZ-${p.id}`,
    name: p.title || "Product",
    brand: p.category?.name ? `${p.category.name} Studio` : "TITAN STUDIO",
    category: normalizedCategory,
    price: Number(p.price) || 29.99,
    compareAt: Math.round((Number(p.price) || 29.99) * 1.25),
    discount: 20,
    inventory: (p.id * 7) % 45 + 5,
    tags: [normalizedCategory, "featured", "in-stock"],
    attributes: {
      Size: ["S", "M", "L", "XL"],
      Color: ["Black", "White", "Navy", "Olive"],
    },
    rating: 4.5 + ((p.id % 5) * 0.1),
    reviewsCount: (p.id * 13) % 150 + 12,
    flags: p.id % 3 === 0 ? ["new", "best-seller"] : p.id % 2 === 0 ? ["new"] : [],
    images: cleanedImages.length > 0 ? cleanedImages : [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85&auto=format&fit=crop"
    ],
    description: p.description || "Premium crafted essential designed for everyday durability and modern style.",
    longDescription: `${p.description || "Engineered for daily resilience and effortless wear."} Featuring high-grade materials and reinforced seams for longevity.`,
    specs: {
      "Category": p.category?.name || "Apparel",
      "Model SKU": `PLZ-${p.id}`,
      "Warranty": "1 Year Standard",
      "Authenticity": "100% Genuine Platzi Store API",
    },
  };
}

/**
 * Fetch all products from Platzi API with fallback to local mock data
 */
export async function fetchPlatziProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${PLATZI_API_BASE}/products?offset=0&limit=30`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: PlatziProduct[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackProducts;
    return data.map(mapPlatziToProduct);
  } catch (err) {
    console.warn("Failed to fetch from Platzi API, using fallback data:", err);
    return fallbackProducts;
  }
}

/**
 * Fetch a single product by SKU or ID
 */
export async function fetchPlatziProductBySku(sku: string): Promise<Product | null> {
  const idStr = sku.replace(/^PLZ-/, "");
  const numericId = Number(idStr);

  if (!isNaN(numericId)) {
    try {
      const res = await fetch(`${PLATZI_API_BASE}/products/${numericId}`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const item: PlatziProduct = await res.json();
        return mapPlatziToProduct(item);
      }
    } catch (err) {
      console.warn(`Failed to fetch product ${sku} from Platzi API:`, err);
    }
  }

  // Fallback to local search
  return fallbackProducts.find((p) => p.sku === sku) || null;
}

/**
 * Fetch categories
 */
export async function fetchPlatziCategories() {
  try {
    const products = await fetchPlatziProducts();
    const catMap = new Map<string, number>();

    for (const p of products) {
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    }

    const categoriesList = [
      { id: "all", label: "All Items", count: products.length },
      { id: "men", label: "Men & Clothing", count: catMap.get("men") || 0 },
      { id: "women", label: "Women", count: catMap.get("women") || 0 },
      { id: "footwear", label: "Footwear", count: catMap.get("footwear") || 0 },
      { id: "accessories", label: "Accessories", count: catMap.get("accessories") || 0 },
      { id: "tech-accessories", label: "Tech & EDC", count: catMap.get("tech-accessories") || 0 },
    ];

    return categoriesList;
  } catch {
    return fallbackCategories;
  }
}
