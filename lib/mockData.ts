export type Product = {
  sku: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  discount?: number;
  inventory: number;
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
  { sku: "W-TEE-ESSNT-001", name: "Essential Cotton Tee", category: "women", price: 28, inventory: 42, tags: ["basics", "cotton"], attributes: { size: ["S","M","L","XL"] }, rating: 4.5, reviewsCount: 182, flags: ["new"] },
  { sku: "W-TEE-OVRSZ-002", name: "Oversized Tee", category: "women", price: 32, inventory: 19, tags: ["relaxed", "cotton"], attributes: { size: ["XS","S","M","L","XL"] }, rating: 4.6, reviewsCount: 140 },
  { sku: "M-SHRT-LINN-003", name: "Linen Short Sleeve Shirt", category: "men", price: 58, inventory: 8, tags: ["linen","breathable"], attributes: { size: ["S","M","L","XL","XXL"] }, rating: 4.3, reviewsCount: 94 },
  { sku: "M-JNS-SLIM-004", name: "Slim Denim", category: "men", price: 88, compareAt: 110, discount: 20, inventory: 15, tags: ["denim","stretch"], attributes: { waist: ["28","30","32","34","36","38"] }, rating: 4.4, reviewsCount: 203, flags: ["best"] },
  { sku: "ACC-TOTE-CNV-005", name: "Canvas Tote", category: "accessories", price: 22, inventory: 63, tags: ["tote","organic"], attributes: { size: "OS" }, rating: 4.7, reviewsCount: 321, flags: ["under50"] },
  { sku: "FT-SNK-CLN-006", name: "Clean Court Sneaker", category: "footwear", price: 120, inventory: 11, tags: ["leather","white"], attributes: { size: ["7","8","9","10","11","12"] }, rating: 4.5, reviewsCount: 512, flags: ["best"] },
  { sku: "HM-MUG-STN-007", name: "Stoneware Mug", category: "home-and-living", price: 16, inventory: 84, tags: ["ceramic","400ml"], rating: 4.8, reviewsCount: 221, flags: ["under50"] },
  { sku: "BTY-SRM-VITC-008", name: "Vitamin C Serum", category: "beauty", price: 36, inventory: 27, tags: ["skincare","30ml"], rating: 4.2, reviewsCount: 77, flags: ["new"] },
  { sku: "TECH-CSE-SLIM-009", name: "Slim Phone Case", category: "tech-accessories", price: 28, inventory: 51, tags: ["iphone","matte"], rating: 4.4, reviewsCount: 90 },
  { sku: "W-DRS-SLIP-010", name: "Silk Slip Dress", category: "women", price: 140, inventory: 6, tags: ["silk","midi"], attributes: { size: ["XS","S","M","L"] }, rating: 4.6, reviewsCount: 65, flags: ["limited"] },
];

export const findByCategory = (key: string) =>
  products.filter(p => p.category === key);

export const findBySku = (sku: string) =>
  products.find(p => p.sku === sku);
