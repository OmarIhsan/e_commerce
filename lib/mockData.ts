import { z } from "zod";

export const ProductSchema = z.object({
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number().positive(),
  compareAt: z.number().optional(),
  discount: z.number().optional(),
  inventory: z.number().int().nonnegative(),
  description: z.string(),
  longDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  attributes: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  rating: z.number().min(0).max(5).default(4.5),
  reviewsCount: z.number().int().nonnegative().default(0),
  flags: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1),
  brand: z.string().default("TITAN STUDIO"),
  specs: z.record(z.string(), z.string()).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const categories = [
  { id: "all", label: "All Items", count: 16 },
  { id: "women", label: "Women", count: 4 },
  { id: "men", label: "Men", count: 4 },
  { id: "footwear", label: "Footwear", count: 3 },
  { id: "accessories", label: "Accessories", count: 3 },
  { id: "tech-accessories", label: "Tech & EDC", count: 2 },
];

export const products: Product[] = [
  {
    sku: "W-TEE-ESSNT-001",
    name: "AeroForm Heavyweight Tee",
    brand: "TITAN STUDIO",
    category: "women",
    price: 34.0,
    compareAt: 45.0,
    discount: 24,
    inventory: 28,
    tags: ["basics", "organic-cotton", "oversized"],
    attributes: { size: ["XS", "S", "M", "L", "XL"], color: ["Onyx Black", "Chalk White", "Slate Gray"] },
    rating: 4.8,
    reviewsCount: 182,
    flags: ["new", "best-seller"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Architectural silhouette engineered from 280GSM ring-spun organic cotton with reinforced double-needle hems.",
    longDescription: "Engineered for daily resilience and effortless draping. Features dropped shoulder seams, breathable open-weave fibers, and a dense ribbed collar that resists stretching even after repeated industrial washes.",
    specs: {
      "Material": "100% GOTS Organic Combed Cotton",
      "Weight": "280 GSM (8.25 oz)",
      "Origin": "Porto, Portugal",
      "Fit": "Engineered Boxy / Relaxed",
      "Care": "Cold wash, hang dry"
    }
  },
  {
    sku: "M-CHN-CHRO-013",
    name: "Tactical Chore Overshirt",
    brand: "KINETIC LAB",
    category: "men",
    price: 138.0,
    compareAt: 165.0,
    discount: 16,
    inventory: 14,
    tags: ["outerwear", "canvas", "water-resistant"],
    attributes: { size: ["S", "M", "L", "XL", "XXL"], color: ["Titanium Dark", "Olive Drab"] },
    rating: 4.9,
    reviewsCount: 124,
    flags: ["featured", "limited"],
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "DWR-coated Cordura canvas overshirt with concealed magnetic storm flaps and laser-cut utility pockets.",
    longDescription: "Constructed to transition seamlessly between alpine weather and metropolitan transit. Outfitted with heavy-gauge YKK matte black zippers and reinforced elbow patches.",
    specs: {
      "Shell": "500D Cordura® Water-Repellent Canvas",
      "Hardware": "Matte PVD YKK Vislon Zippers",
      "Pockets": "4 Exterior + 2 Internal Device Sleeves",
      "Weather Rating": "Moderate Wind & Light Rain Proof"
    }
  },
  {
    sku: "FT-BTS-CHLS-025",
    name: "Vanguard Vibram Chelsea Boot",
    brand: "NORDIC CRAFT",
    category: "footwear",
    price: 195.0,
    compareAt: 240.0,
    discount: 19,
    inventory: 9,
    tags: ["leather", "vibram", "waterproof"],
    attributes: { size: ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU", "45 EU"], color: ["Matte Obsidian", "Smoked Brown"] },
    rating: 4.9,
    reviewsCount: 215,
    flags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Full-grain Tuscan calfskin boots equipped with lightweight Vibram Arctic Grip lugged outsoles.",
    longDescription: "Handcrafted using Goodyear welt construction for lifetime recraftability. Elasticized side gussets and dual nylon pull tabs ensure effortless entry and blister-free support.",
    specs: {
      "Upper": "1.8mm Full-Grain Waxed Italian Calfskin",
      "Sole": "Vibram® Morflex Lugged Outsole",
      "Construction": "Goodyear Welted",
      "Insole": "Ortholite High-Rebound Memory Foam"
    }
  },
  {
    sku: "TECH-CSE-SLIM-009",
    name: "Aramid Matrix MagSafe Case",
    brand: "CYBERPULSE",
    category: "tech-accessories",
    price: 48.0,
    inventory: 45,
    tags: ["edc", "magsafe", "carbon-fiber"],
    attributes: { model: ["iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16 Pro", "iPhone 16 Pro Max"] },
    rating: 4.7,
    reviewsCount: 310,
    flags: ["new"],
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "0.65mm ultra-thin case woven from authentic 1500D aerospace-grade 600D Aramid fibers with N52 Neodymium magnets.",
    longDescription: "Provides military-grade scratch resistance and drop protection while adding virtually zero bulk to your device. Precision cutouts ensure clicky feedback and compatibility with all high-speed Qi2 chargers.",
    specs: {
      "Thickness": "0.65 mm",
      "Material": "100% 1500D Aramid Fiber",
      "Magnets": "38x N52 High-Flux Magnets",
      "Finish": "Matte Oleophobic Soft-Touch Coating"
    }
  },
  {
    sku: "ACC-BAG-CRO-032",
    name: "Prism Modular Crossbody Pack",
    brand: "KINETIC LAB",
    category: "accessories",
    price: 88.0,
    compareAt: 110.0,
    discount: 20,
    inventory: 18,
    tags: ["bag", "x-pac", "waterproof"],
    attributes: { color: ["Stealth Black", "Cyber Fog", "Glacier White"] },
    rating: 4.8,
    reviewsCount: 96,
    flags: ["featured"],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Dimension-Polyant X-Pac® waterproof sling with Fidlock V-Buckle magnetic hardware and hidden RFID card sleeve.",
    longDescription: "An ergonomic 4.5-liter everyday carry bag designed for rapid access on the move. Features weather-sealed AquaGuard zippers and a breathable air-mesh back panel.",
    specs: {
      "Capacity": "4.5 Liters",
      "Material": "X-Pac® VX21 Waterproof Fabric",
      "Hardware": "German Fidlock® V-Buckle",
      "Zippers": "YKK® AquaGuard® Water-Repellent"
    }
  },
  {
    sku: "W-DRS-SLIP-010",
    name: "Monochrome Raw Silk Slip Dress",
    brand: "TITAN STUDIO",
    category: "women",
    price: 145.0,
    compareAt: 180.0,
    discount: 19,
    inventory: 8,
    tags: ["silk", "minimalist", "evening"],
    attributes: { size: ["XS", "S", "M", "L"], color: ["Champagne Pearl", "Obsidian Black"] },
    rating: 4.7,
    reviewsCount: 65,
    flags: ["limited"],
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Fluid 22-momme Mulberry silk slip dress with delicate bias cut, adjustable micro straps, and subtle side slit.",
    longDescription: "Pure luxury meets contemporary lines. Thermoregulating natural silk drapes effortlessly over the body, delivering day-to-night versatility with hypoallergenic softness.",
    specs: {
      "Composition": "100% Grade 6A Mulberry Silk (22 Momme)",
      "Hemline": "Midi Length (46 inches)",
      "Straps": "Adjustable 14k Gold-Tone Metal Sliders",
      "Care": "Dry Clean or Gentle Silk Hand Wash"
    }
  },
  {
    sku: "M-JNS-SLIM-004",
    name: "Selvedge Raw Tapered Denim",
    brand: "NORDIC CRAFT",
    category: "men",
    price: 115.0,
    compareAt: 140.0,
    discount: 18,
    inventory: 22,
    tags: ["denim", "selvedge", "raw"],
    attributes: { size: ["30x32", "32x32", "34x32", "36x32"], color: ["Indigo Raw", "Washed Charcoal"] },
    rating: 4.6,
    reviewsCount: 203,
    flags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "14oz Kuroki Mills Japanese selvedge denim with 2% elastane for unrestricted mobility and unique fade potential.",
    longDescription: "Woven on vintage shuttle looms in Okayama, Japan. Features custom debossed gunmetal rivets, chain-stitched hems, and a genuine vegetable-tanned leather waistband patch.",
    specs: {
      "Fabric": "14 oz Okayama Selvedge Denim",
      "Cut": "Slim Tapered",
      "Hardware": "Solid Gunmetal Shank Buttons",
      "Detail": "Red-Line Selvedge ID"
    }
  },
  {
    sku: "TECH-PWR-5K-028",
    name: "MagVolt 100W GaN Station",
    brand: "CYBERPULSE",
    category: "tech-accessories",
    price: 65.0,
    compareAt: 80.0,
    discount: 19,
    inventory: 35,
    tags: ["charging", "gan", "edc"],
    attributes: { color: ["Space Gray", "Silver Frost"] },
    rating: 4.9,
    reviewsCount: 240,
    flags: ["featured"],
    images: [
      "https://images.unsplash.com/photo-1609592426815-566d8e2fd87f?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Ultra-compact Gallium Nitride (GaN III) fast charger with 3x USB-C PD 3.1 ports and dynamic power allocation.",
    longDescription: "Powers your MacBook Pro, iPad, and iPhone concurrently at peak thermal efficiency. Includes folding prongs and intelligent active temperature monitoring 80,000 times per hour.",
    specs: {
      "Output": "100W Max USB-PD 3.1",
      "Technology": "Navitas GaNFast™ III Power IC",
      "Ports": "3x USB-C (100W/65W/30W) + 1x USB-A (22.5W)",
      "Dimensions": "65 x 65 x 30 mm (210g)"
    }
  },
  {
    sku: "FT-SNK-CLN-006",
    name: "Matrix Knit Low Minimalist Sneaker",
    brand: "NORDIC CRAFT",
    category: "footwear",
    price: 128.0,
    compareAt: 150.0,
    discount: 15,
    inventory: 16,
    tags: ["sneaker", "minimal", "recycled"],
    attributes: { size: ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU", "45 EU"], color: ["Off-White", "Triple Black"] },
    rating: 4.8,
    reviewsCount: 412,
    flags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Engineered single-piece recycled flyknit upper with natural cork footbeds and vulcanized rubber outsoles.",
    longDescription: "Designed for 20,000+ daily steps in total comfort. The breathable knit adapts dynamically to your foot's shape while zero-drop sole geometry promotes natural posture.",
    specs: {
      "Upper": "100% Recycled PET Breathable Knit",
      "Footbed": "Sustainably Harvested Cork & EVA",
      "Sole": "30% Recycled Natural Gum Rubber",
      "Weight": "240g per shoe"
    }
  },
  {
    sku: "ACC-CAP-WOOL-014",
    name: "Architectural Cashmere Beanie",
    brand: "TITAN STUDIO",
    category: "accessories",
    price: 44.0,
    inventory: 50,
    tags: ["wool", "cashmere", "winter"],
    attributes: { color: ["Charcoal Heather", "Camel", "Moss Green"] },
    rating: 4.7,
    reviewsCount: 88,
    flags: ["new"],
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "7-gauge ribbed knit blend of 70% Extrafine Merino and 30% Mongolian Cashmere for featherweight warmth.",
    longDescription: "Seamless circular knit prevents pressure points. Foldable cuff allows for shallow docker or deep ear coverage styling.",
    specs: {
      "Blend": "70% Merino Wool / 30% Grade-A Cashmere",
      "Knit Structure": "7-Gauge Fisherman Rib",
      "Origin": "Biella, Italy",
      "Sizing": "Universal One Size Stretch Fit"
    }
  },
  {
    sku: "W-KNT-CARD-011",
    name: "Merino Boxy Chunky Cardigan",
    brand: "TITAN STUDIO",
    category: "women",
    price: 110.0,
    compareAt: 135.0,
    discount: 19,
    inventory: 12,
    tags: ["knitwear", "merino", "cozy"],
    attributes: { size: ["XS", "S", "M", "L"], color: ["Oatmeal Melange", "Deep Navy"] },
    rating: 4.8,
    reviewsCount: 88,
    flags: ["featured"],
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Oversized silhouette knitted from un-dyed 19.5 micron Australian Merino wool with natural horn buttons.",
    longDescription: "A statement layering piece with deep patch pockets, dropped armholes, and dense textured waffle weave. Naturally odor resistant and moisture wicking.",
    specs: {
      "Yarn": "100% 19.5 Micron Extra-Fine Merino",
      "Buttons": "Real Buffalo Horn (Polished Matte)",
      "Fit": "Sculptural Boxy Cut",
      "Care": "Hand Wash Cold with Wool Detergent"
    }
  },
  {
    sku: "M-SWT-FLC-022",
    name: "Thermal Heavyweight 480GSM Hoodie",
    brand: "KINETIC LAB",
    category: "men",
    price: 88.0,
    inventory: 26,
    tags: ["fleece", "heavyweight", "streetwear"],
    attributes: { size: ["S", "M", "L", "XL", "XXL"], color: ["Washed Cement", "Pitch Black"] },
    rating: 4.9,
    reviewsCount: 205,
    flags: ["best-seller"],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1200&q=85&auto=format&fit=crop",
    ],
    description: "Custom-milled 480GSM French Terry hoodie with double-layered hood and zero drawstrings for pure minimalist lines.",
    longDescription: "Cross-grain cut prevents vertical shrinkage. Reinforced flatlock stitch construction throughout ensures this hoodie will outlast everything else in your wardrobe.",
    specs: {
      "Fabric": "480 GSM 100% Cotton French Terry",
      "Pocket": "Seamless Kangaroo Pouch",
      "Ribbing": "Heavy 2x2 Spandex Cotton Ribs",
      "Weight": "Approx 1.15 kg"
    }
  }
];

export function findBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
}

export function searchProducts(query?: string, category?: string, minPrice?: number, maxPrice?: number, inStockOnly?: boolean, minRating?: number, sortBy?: string): Product[] {
  let result = [...products];

  if (category && category !== "all") {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter((p) => 
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    result = result.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    result = result.filter((p) => p.price <= maxPrice);
  }

  if (inStockOnly) {
    result = result.filter((p) => p.inventory > 0);
  }

  if (minRating !== undefined && !isNaN(minRating)) {
    result = result.filter((p) => p.rating >= minRating);
  }

  if (sortBy) {
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default: // "featured" / "relevance"
        break;
    }
  }

  return result;
}
