export type Product = {
  sku: string;
  name: string;
  category: string;
  price: number;
  images?: string[];
  compareAt?: number;
  discount?: number;
  inventory: number;
  description?: string;
  longDescription?: string;
  tags?: string[];
  attributes?: Record<string, string | string[]>;
  rating?: number;
  reviewsCount?: number;
  flags?: string[];
};

export const categories = [
  "women",
  "men",
  "accessories",
  "footwear",
  "home-and-living",
  "beauty",
  "tech-accessories",
  "sale",
];

export const collections = [
  "new-arrivals",
  "best-sellers",
  "summer-essentials",
  "under-50",
  "editors-picks",
  "limited-drops",
];

export const products: Product[] = [
  {
    sku: "W-TEE-ESSNT-001",
    name: "Essential Cotton Tee",
    category: "women",
    price: 28,
    inventory: 42,
    tags: ["basics", "cotton"],
    attributes: { size: ["S", "M", "L", "XL"] },
    rating: 4.5,
    reviewsCount: 182,
    flags: ["new"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975919627-4a64c3c3a0f1?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "A soft, breathable cotton tee designed for everyday wear.",
    longDescription: "Made from 100% organic cotton with a relaxed fit and reinforced seams. Machine washable and pre-shrunk for consistent sizing.",
  },
  {
    sku: "W-TEE-OVRSZ-002",
    name: "Oversized Tee",
    category: "women",
    price: 32,
    inventory: 19,
    tags: ["relaxed", "cotton"],
    attributes: { size: ["XS", "S", "M", "L", "XL"] },
    rating: 4.6,
    reviewsCount: 140,
    images: [
      "https://images.unsplash.com/photo-1503342452485-86f7f7f5f4a3?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547586696-84d4d3f1b9c2?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Roomy, lightweight tee with a modern silhouette.",
  },
  {
    sku: "M-SHRT-LINN-003",
    name: "Linen Short Sleeve Shirt",
    category: "men",
    price: 58,
    inventory: 8,
    tags: ["linen", "breathable"],
    attributes: { size: ["S", "M", "L", "XL", "XXL"] },
    rating: 4.3,
    reviewsCount: 94,
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Lightweight linen shirt, perfect for warm days.",
  },
  {
    sku: "M-JNS-SLIM-004",
    name: "Slim Denim",
    category: "men",
    price: 88,
    compareAt: 110,
    discount: 20,
    inventory: 15,
    tags: ["denim", "stretch"],
    attributes: { waist: ["28", "30", "32", "34", "36", "38"] },
    rating: 4.4,
    reviewsCount: 203,
    flags: ["best"],
    images: [
      "https://images.unsplash.com/photo-1520975681913-1f7b8ca4bdab?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Classic slim denim with subtle stretch for comfort.",
  },
  {
    sku: "ACC-TOTE-CNV-005",
    name: "Canvas Tote",
    category: "accessories",
    price: 22,
    inventory: 63,
    tags: ["tote", "organic"],
    attributes: { size: "OS" },
    rating: 4.7,
    reviewsCount: 321,
    flags: ["under50"],
    images: [
      "https://images.unsplash.com/photo-1519741490799-51e3d226a7f6?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Durable canvas tote with reinforced handles and roomy interior.",
  },
  {
    sku: "FT-SNK-CLN-006",
    name: "Clean Court Sneaker",
    category: "footwear",
    price: 120,
    inventory: 11,
    tags: ["leather", "white"],
    attributes: { size: ["7", "8", "9", "10", "11", "12"] },
    rating: 4.5,
    reviewsCount: 512,
    flags: ["best"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Minimal white sneaker with cushioned insole for daily comfort.",
  },
  {
    sku: "HM-MUG-STN-007",
    name: "Stoneware Mug",
    category: "home-and-living",
    price: 16,
    inventory: 84,
    tags: ["ceramic", "400ml"],
    rating: 4.8,
    reviewsCount: 221,
    flags: ["under50"],
    images: [
      "https://images.unsplash.com/photo-1505577058444-a3dab3a6f3a8?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Handmade stoneware mug with an imperfect, artisanal finish.",
  },
  {
    sku: "BTY-SRM-VITC-008",
    name: "Vitamin C Serum",
    category: "beauty",
    price: 36,
    inventory: 27,
    tags: ["skincare", "30ml"],
    rating: 4.2,
    reviewsCount: 77,
    flags: ["new"],
    images: [
      "https://images.unsplash.com/photo-1589987605022-8a7d7f7b6e1c?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Brightening serum with stabilized vitamin C for daily use.",
  },
  {
    sku: "TECH-CSE-SLIM-009",
    name: "Slim Phone Case",
    category: "tech-accessories",
    price: 28,
    inventory: 51,
    tags: ["iphone", "matte"],
    rating: 4.4,
    reviewsCount: 90,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Ultra-slim protective case with matte finish and anti-grip texture.",
  },
  {
    sku: "W-DRS-SLIP-010",
    name: "Silk Slip Dress",
    category: "women",
    price: 140,
    inventory: 6,
    tags: ["silk", "midi"],
    attributes: { size: ["XS", "S", "M", "L"] },
    rating: 4.6,
    reviewsCount: 65,
    flags: ["limited"],
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80&auto=format&fit=crop",
    ],
    description: "Luxurious silk slip with bias cut for elegant drape.",
  },
];

export const findByCategory = (key: string) =>
  products.filter(p => p.category === key);

export const findBySku = (sku: string) =>
  products.find(p => p.sku === sku);
