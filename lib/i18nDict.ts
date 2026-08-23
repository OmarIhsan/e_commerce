export type Locale = "en" | "ar" | "fr";

export interface EcomTranslations {
  localeName: string;
  topBanner: string;
  storeName: string;
  storeSubtitle: string;
  nav: {
    all: string;
    women: string;
    men: string;
    footwear: string;
    accessories: string;
    wishlist: string;
    cart: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    shopMen: string;
    shopWomen: string;
    shopFootwear: string;
    explore: string;
  };
  benefits: {
    shippingTitle: string;
    shippingDesc: string;
    returnsTitle: string;
    returnsDesc: string;
    securityTitle: string;
    securityDesc: string;
    qualityTitle: string;
    qualityDesc: string;
  };
  filter: {
    searchPlaceholder: string;
    filtersBtn: string;
    resetFilters: string;
    clearFilters: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    noProducts: string;
    noProductsDesc: string;
    priceRange: string;
    minRating: string;
    allRatings: string;
    ratingAbove: string;
    availability: string;
    inStockOnly: string;
    inStockDesc: string;
    showingCount: string;
    advancedFilters: string;
  };
  categories: {
    all: string;
    women: string;
    men: string;
    footwear: string;
    accessories: string;
    "tech-accessories": string;
  };
  card: {
    addToCart: string;
    added: string;
    outOfStock: string;
    off: string;
    newBadge: string;
    saveWishlist: string;
    removeWishlist: string;
    viewProduct: string;
  };
  product: {
    selectSize: string;
    selectColor: string;
    quantity: string;
    overview: string;
    specifications: string;
    reviews: string;
    writeReview: string;
    yourRating: string;
    yourName: string;
    reviewTitle: string;
    comment: string;
    submitReview: string;
    reviewSubmitted: string;
    relatedProducts: string;
    lowStockWarning: string;
    freeDelivery: string;
    easyReturns: string;
    verifiedItem: string;
    breadcrumbCatalog: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyDesc: string;
    startShopping: string;
    checkout: string;
    subtotal: string;
    shipping: string;
    free: string;
    discount: string;
    tax: string;
    total: string;
    promoCode: string;
    apply: string;
    remove: string;
    freeShippingBar: string;
    unlockFreeShipping: string;
    clearCart: string;
    itemCount: string;
    each: string;
  };
  checkout: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
    contactInfo: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    deliveryMethod: string;
    economy: string;
    standard: string;
    express: string;
    economyTime: string;
    standardTime: string;
    expressTime: string;
    paymentInfo: string;
    cardName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    placeOrder: string;
    processing: string;
    orderSummary: string;
    continueToDelivery: string;
    continueToPayment: string;
    backStep: string;
    freeShippingApplied: string;
  };
  confirmation: {
    title: string;
    subtitle: string;
    orderId: string;
    copy: string;
    copied: string;
    itemsOrdered: string;
    shippingAddress: string;
    deliveryMethod: string;
    paymentMethod: string;
    printInvoice: string;
    continueShopping: string;
    deliveryNotice: string;
  };
  wishlist: {
    title: string;
    subtitle: string;
    empty: string;
    emptyDesc: string;
    moveAllToCart: string;
    clear: string;
    exploreBtn: string;
  };
  invoice: {
    title: string;
    printBtn: string;
    orderNo: string;
    date: string;
    status: string;
    paid: string;
    customer: string;
    item: string;
    qty: string;
    price: string;
    total: string;
    subtotal: string;
    discount: string;
    shipping: string;
    finalTotal: string;
  };
  footer: {
    about: string;
    quickLinks: string;
    support: string;
    guarantee: string;
    guaranteeText: string;
    rights: string;
    platform: string;
  };
  theme: {
    light: string;
    dark: string;
    toggle: string;
  };
}

export const ECOM_DICTIONARIES: Record<Locale, EcomTranslations> = {
  en: {
    localeName: "English",
    topBanner: "🔥 Summer Sale: Use code SUMMER15 for 15% OFF | Free Shipping over $75",
    storeName: "OmarStore",
    storeSubtitle: "Easy Online Shopping",
    nav: {
      all: "All Items",
      women: "Women",
      men: "Men",
      footwear: "Shoes",
      accessories: "Accessories",
      wishlist: "Saved",
      cart: "Cart",
    },
    hero: {
      badge: "New 2026 Collection",
      title: "Simple, Comfortable Clothes and Shoes for Everyday",
      subtitle: "Find clean styles, easy everyday shirts, good shoes, and useful accessories. Fast free shipping over $75 and 30 days to return.",
      shopMen: "Shop Men",
      shopWomen: "Shop Women",
      shopFootwear: "Shop Shoes",
      explore: "See All",
    },
    benefits: {
      shippingTitle: "Free Fast Shipping",
      shippingDesc: "On orders over $75",
      returnsTitle: "Easy 30-Day Returns",
      returnsDesc: "Full money back guarantee",
      securityTitle: "Safe & Secure Pay",
      securityDesc: "100% protected payments",
      qualityTitle: "Good Quality",
      qualityDesc: "Real, verified products",
    },
    filter: {
      searchPlaceholder: "Search clothes, shoes, bags, accessories...",
      filtersBtn: "Filters",
      resetFilters: "Reset Filters",
      clearFilters: "Clear filters",
      sortFeatured: "Featured",
      sortPriceAsc: "Price: Low to High",
      sortPriceDesc: "Price: High to Low",
      sortRating: "Best Rating",
      noProducts: "No products found",
      noProductsDesc: "Try typing different words or clear the filters to see items.",
      priceRange: "Price Range ($USD)",
      minRating: "Minimum Rating",
      allRatings: "All Ratings",
      ratingAbove: "★ and up",
      availability: "Availability",
      inStockOnly: "In-Stock Only",
      inStockDesc: "Only show items ready to ship",
      showingCount: "Showing items",
      advancedFilters: "Filters & Options",
    },
    categories: {
      all: "All Items",
      women: "Women",
      men: "Men",
      footwear: "Shoes",
      accessories: "Bags & Gear",
      "tech-accessories": "Accessories",
    },
    card: {
      addToCart: "Add to Cart",
      added: "Added",
      outOfStock: "Out of Stock",
      off: "OFF",
      newBadge: "NEW",
      saveWishlist: "Save item",
      removeWishlist: "Remove item",
      viewProduct: "View Details",
    },
    product: {
      selectSize: "Pick a Size",
      selectColor: "Pick a Color",
      quantity: "Qty",
      overview: "About this item",
      specifications: "Item Details",
      reviews: "Customer Reviews",
      writeReview: "Write a Review",
      yourRating: "Your Rating",
      yourName: "Your Name",
      reviewTitle: "Review Title",
      comment: "Your Message",
      submitReview: "Send Review",
      reviewSubmitted: "Thank you! Your review was sent.",
      relatedProducts: "You may also like",
      lowStockWarning: "Hurry! Only a few items left in stock.",
      freeDelivery: "Free Fast Delivery",
      easyReturns: "30-Day Return",
      verifiedItem: "100% Original Item",
      breadcrumbCatalog: "Shop Catalog",
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptyDesc: "You have no items in your cart. Check our shop to find something you like.",
      startShopping: "Start Shopping",
      checkout: "Go to Checkout",
      subtotal: "Subtotal",
      shipping: "Shipping",
      free: "FREE",
      discount: "Discount",
      tax: "Tax (Estimated)",
      total: "Total",
      promoCode: "Promo code",
      apply: "Apply",
      remove: "Remove",
      freeShippingBar: "You have unlocked Free Shipping!",
      unlockFreeShipping: "Add more to get Free Shipping",
      clearCart: "Empty Cart",
      itemCount: "items",
      each: "each",
    },
    checkout: {
      title: "Checkout",
      step1: "1. Your Information",
      step2: "2. Shipping Method",
      step3: "3. Payment",
      contactInfo: "Delivery Information",
      email: "Email Address",
      firstName: "First Name",
      lastName: "Last Name",
      address: "Street Address",
      apartment: "Apartment, suite, etc. (optional)",
      city: "City",
      state: "State / Province",
      postalCode: "Postal / ZIP Code",
      country: "Country",
      phone: "Phone Number",
      deliveryMethod: "Pick Delivery Method",
      economy: "Standard Delivery",
      standard: "Fast Delivery",
      express: "Express Delivery",
      economyTime: "5 to 8 business days",
      standardTime: "3 to 5 business days",
      expressTime: "1 to 2 business days",
      paymentInfo: "Payment Card Details",
      cardName: "Name on Card",
      cardNumber: "Card Number",
      expiry: "Expiry (MM/YY)",
      cvc: "CVC / Code",
      placeOrder: "Pay and Complete Order",
      processing: "Processing your order...",
      orderSummary: "Order Summary",
      continueToDelivery: "Continue to Delivery",
      continueToPayment: "Continue to Payment",
      backStep: "Back",
      freeShippingApplied: "Free Delivery Applied",
    },
    confirmation: {
      title: "Order Confirmed!",
      subtitle: "Thank you for your order. We are preparing your items for delivery.",
      orderId: "Order Number",
      copy: "Copy",
      copied: "Copied!",
      itemsOrdered: "Items in your order",
      shippingAddress: "Delivering to",
      deliveryMethod: "Delivery Type",
      paymentMethod: "Payment Method",
      printInvoice: "Print Invoice / Receipt",
      continueShopping: "Keep Shopping",
      deliveryNotice: "You will get an email confirmation with your tracking link soon.",
    },
    wishlist: {
      title: "Saved Items",
      subtitle: "All your saved favorite products in one place.",
      empty: "No saved items yet",
      emptyDesc: "Click the heart button on any item to save it here for later.",
      moveAllToCart: "Move All to Cart",
      clear: "Clear All",
      exploreBtn: "Explore Store",
    },
    invoice: {
      title: "Store Receipt & Invoice",
      printBtn: "Print / Save PDF",
      orderNo: "Invoice #",
      date: "Date",
      status: "Payment Status",
      paid: "PAID",
      customer: "Customer Details",
      item: "Item",
      qty: "Qty",
      price: "Price",
      total: "Total",
      subtotal: "Subtotal",
      discount: "Discount",
      shipping: "Shipping",
      finalTotal: "Grand Total",
    },
    footer: {
      about: "Simple and easy online shopping with fast delivery and high quality products.",
      quickLinks: "Shop Links",
      support: "Customer Help",
      guarantee: "Safe & Protected",
      guaranteeText: "Secure payments and simple 30 days money-back guarantee.",
      rights: "All rights reserved.",
      platform: "Built with Next.js",
    },
    theme: {
      light: "Light Mode",
      dark: "Dark Mode",
      toggle: "Switch theme",
    },
  },
  ar: {
    localeName: "العربية",
    topBanner: "🔥 خصومات الصيف: استخدم كود SUMMER15 لخصم 15% | شحن مجاني للطلبات فوق 75$",
    storeName: "متجر عمر",
    storeSubtitle: "تسوق إلكتروني سهل وسريع",
    nav: {
      all: "كل المنتجات",
      women: "نساء",
      men: "رجال",
      footwear: "أحذية",
      accessories: "إكسسوارات",
      wishlist: "المفضلة",
      cart: "السلة",
    },
    hero: {
      badge: "تشكيلة 2026 الجديدة",
      title: "ملابس وأحذية يومية مريحة وبجودة ممتازة",
      subtitle: "تسوق ملابس مريحة، أحذية جميلة، وإكسسوارات لكل يوم. شحن سريع ومجاني للطلبات فوق 75$ وإرجاع سهل خلال 30 يوم.",
      shopMen: "ملابس رجالية",
      shopWomen: "ملابس نسائية",
      shopFootwear: "أحذية",
      explore: "عرض الكل",
    },
    benefits: {
      shippingTitle: "شحن سريع ومجاني",
      shippingDesc: "للطلبات فوق 75$",
      returnsTitle: "إرجاع سهل خلال 30 يوم",
      returnsDesc: "استرجاع فلوسك بكل سهولة",
      securityTitle: "دفع آمن 100%",
      securityDesc: "بياناتك محمية ومشفرة",
      qualityTitle: "جودة أصلية ممتازة",
      qualityDesc: "منتجات مضمونة ومفحوصة",
    },
    filter: {
      searchPlaceholder: "ابحث عن ملابس، أحذية، حقائب، إكسسوارات...",
      filtersBtn: "تصفية",
      resetFilters: "إعادة ضبط",
      clearFilters: "مسح الفلاتر",
      sortFeatured: "المميز",
      sortPriceAsc: "السعر: من الأقل للأعلى",
      sortPriceDesc: "السعر: من الأعلى للأقل",
      sortRating: "الأعلى تقييماً",
      noProducts: "لم نجد أي منتج",
      noProductsDesc: "جرب كلمات بحث ثانية أو امسح الفلاتر لرؤية المنتجات.",
      priceRange: "نطاق السعر ($)",
      minRating: "التقييم الأدنى",
      allRatings: "كل التقييمات",
      ratingAbove: "★ وأكثر",
      availability: "التوفر",
      inStockOnly: "المتوفر بالمخزن فقط",
      inStockDesc: "عرض المنتجات الجاهزة للشحن فقط",
      showingCount: "عرض المنتجات",
      advancedFilters: "خيارات التصفية",
    },
    categories: {
      all: "كل المنتجات",
      women: "نساء",
      men: "رجال",
      footwear: "أحذية",
      accessories: "حقائب ومستلزمات",
      "tech-accessories": "إكسسوارات",
    },
    card: {
      addToCart: "أضف للسلة",
      added: "تمت الإضافة",
      outOfStock: "نفذت الكمية",
      off: "خصم",
      newBadge: "جديد",
      saveWishlist: "حفظ في المفضلة",
      removeWishlist: "حذف من المفضلة",
      viewProduct: "عرض التفاصيل",
    },
    product: {
      selectSize: "اختر المقاس",
      selectColor: "اختر اللون",
      quantity: "الكمية",
      overview: "عن المنتج",
      specifications: "تفاصيل المنتج",
      reviews: "تقييمات العملاء",
      writeReview: "اكتب تقييمك",
      yourRating: "تقييمك",
      yourName: "اسمك",
      reviewTitle: "عنوان التقييم",
      comment: "رسالتك",
      submitReview: "إرسال التقييم",
      reviewSubmitted: "شكراً لك! تم إرسال تقييمك بنجاح.",
      relatedProducts: "منتجات قد تعجبك",
      lowStockWarning: "سارع بالشراء! تبقت قطع قليلة فقط.",
      freeDelivery: "توصيل سريع مجاني",
      easyReturns: "إرجاع سهل 30 يوم",
      verifiedItem: "منتج أصلي 100%",
      breadcrumbCatalog: "المتجر",
    },
    cart: {
      title: "سلة المشتريات",
      empty: "سلة المشتريات فارغة",
      emptyDesc: "ما عندك أي منتج في السلة حالياً. تصفح المتجر واختر ما يناسبك.",
      startShopping: "ابدأ التسوق",
      checkout: "إتمام الطلب",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      free: "مجاني",
      discount: "الخصم",
      tax: "الضريبة التقديرية",
      total: "المجموع الكلي",
      promoCode: "كود الخصم",
      apply: "تطبيق",
      remove: "حذف",
      freeShippingBar: "مبروك! حصلت على شحن مجاني!",
      unlockFreeShipping: "أضف المزيد للحصول على شحن مجاني",
      clearCart: "تفريغ السلة",
      itemCount: "منتجات",
      each: "للقطعة",
    },
    checkout: {
      title: "إتمام الشراء",
      step1: "1. معلوماتك الشخصية",
      step2: "2. طريقة التوصيل",
      step3: "3. الدفع",
      contactInfo: "معلومات التوصيل",
      email: "البريد الإلكتروني",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      address: "عنوان الشارع والمنزل",
      apartment: "رقم الشقة أو العمارة (اختياري)",
      city: "المدينة",
      state: "المنطقة / المحافظة",
      postalCode: "الرمز البريدي",
      country: "الدولة",
      phone: "رقم الهاتف",
      deliveryMethod: "اختر طريقة التوصيل",
      economy: "توصيل اقتصادي",
      standard: "توصيل سريع",
      express: "توصيل فائق السرعة",
      economyTime: "5 إلى 8 أيام عمل",
      standardTime: "3 إلى 5 أيام عمل",
      expressTime: "1 إلى 2 يوم عمل",
      paymentInfo: "بيانات بطاقة الدفع",
      cardName: "الاسم المكتوب على البطاقة",
      cardNumber: "رقم البطاقة",
      expiry: "تاريخ الانتهاء (شهر/سنة)",
      cvc: "رمز الأمان (CVC)",
      placeOrder: "دفع وتأكيد الطلب",
      processing: "جاري تجهيز وتأكيد طلبك...",
      orderSummary: "ملخص الطلب",
      continueToDelivery: "المتابعة لطريقة التوصيل",
      continueToPayment: "المتابعة للدفع",
      backStep: "رجوع",
      freeShippingApplied: "تم تفعيل التوصيل المجاني",
    },
    confirmation: {
      title: "تم تأكيد طلبك بنجاح!",
      subtitle: "شكراً لتسوقك معنا. جاري تجهيز طلبك الآن للشحن.",
      orderId: "رقم الطلب",
      copy: "نسخ",
      copied: "تم النسخ!",
      itemsOrdered: "المنتجات المطلوبة",
      shippingAddress: "عنوان التوصيل",
      deliveryMethod: "نوع الشحن",
      paymentMethod: "طريقة الدفع",
      printInvoice: "طباعة الفاتورة / الإيصال",
      continueShopping: "متابعة التسوق",
      deliveryNotice: "سنرسل لك رسالة تأكيد مع رابط تتبع الشحنة قريباً.",
    },
    wishlist: {
      title: "المنتجات المحفوظة",
      subtitle: "كل المنتجات التي أعجبتك في مكان واحد.",
      empty: "قائمة المفضلة فارغة",
      emptyDesc: "اضغط على رمز القلب عند أي منتج لحفظه هنا.",
      moveAllToCart: "نقل الكل للسلة",
      clear: "مسح الكل",
      exploreBtn: "تصفح المتجر",
    },
    invoice: {
      title: "فاتورة الشراء الرسمية",
      printBtn: "طباعة / حفظ كملف PDF",
      orderNo: "رقم الفاتورة",
      date: "التاريخ",
      status: "حالة الدفع",
      paid: "تم الدفع",
      customer: "بيانات العميل",
      item: "المنتج",
      qty: "الكمية",
      price: "السعر",
      total: "المجموع",
      subtotal: "المجموع الفرعي",
      discount: "الخصم",
      shipping: "الشحن",
      finalTotal: "المجموع الكلي",
    },
    footer: {
      about: "متجر إلكتروني سهل وموثوق يوفر لك تجربة شراء سهلة مع توصيل سريع وجودة عالية.",
      quickLinks: "روابط المتجر",
      support: "مساعدة العملاء",
      guarantee: "تسوق آمن ومضمون",
      guaranteeText: "دفع آمن 100% مع ضمان استرجاع فلوسك خلال 30 يوم.",
      rights: "جميع الحقوق محفوظة.",
      platform: "تم التطوير باستخدام Next.js",
    },
    theme: {
      light: "الوضع الفاتح",
      dark: "الوضع الداكن",
      toggle: "تغيير المظهر",
    },
  },
  fr: {
    localeName: "Français",
    topBanner: "🔥 Soldes d'été : Code SUMMER15 pour -15% | Livraison gratuite dès 75$",
    storeName: "OmarStore",
    storeSubtitle: "Boutique en ligne facile",
    nav: {
      all: "Tous les articles",
      women: "Femmes",
      men: "Hommes",
      footwear: "Chaussures",
      accessories: "Accessoires",
      wishlist: "Favoris",
      cart: "Panier",
    },
    hero: {
      badge: "Nouvelle Collection 2026",
      title: "Vêtements et chaussures simples et confortables pour tous les jours",
      subtitle: "Trouvez des vêtements faciles à porter, de bonnes chaussures et des accessoires pratiques. Livraison rapide gratuite dès 75$ et retours faciles sous 30 jours.",
      shopMen: "Rayon Homme",
      shopWomen: "Rayon Femme",
      shopFootwear: "Rayon Chaussures",
      explore: "Tout voir",
    },
    benefits: {
      shippingTitle: "Livraison rapide gratuite",
      shippingDesc: "Dès 75$ d'achats",
      returnsTitle: "Retour facile 30 jours",
      returnsDesc: "Remboursement simple et garanti",
      securityTitle: "Paiement 100% sécurisé",
      securityDesc: "Paiement direct et protégé",
      qualityTitle: "Bonne qualité",
      qualityDesc: "Articles vérifiés et authentiques",
    },
    filter: {
      searchPlaceholder: "Chercher des vêtements, chaussures, sacs...",
      filtersBtn: "Filtres",
      resetFilters: "Réinitialiser",
      clearFilters: "Effacer les filtres",
      sortFeatured: "Recommandés",
      sortPriceAsc: "Prix : Moins cher au plus cher",
      sortPriceDesc: "Prix : Plus cher au moins cher",
      sortRating: "Mieux notés",
      noProducts: "Aucun produit trouvé",
      noProductsDesc: "Essayez avec d'autres mots simples ou effacez les filtres.",
      priceRange: "Fourchette de prix ($USD)",
      minRating: "Note minimum",
      allRatings: "Toutes les notes",
      ratingAbove: "★ et plus",
      availability: "Disponibilité",
      inStockOnly: "En stock uniquement",
      inStockDesc: "Afficher seulement les articles prêts à partir",
      showingCount: "Articles affichés",
      advancedFilters: "Options de tri et filtres",
    },
    categories: {
      all: "Tous les articles",
      women: "Femmes",
      men: "Hommes",
      footwear: "Chaussures",
      accessories: "Sacs et accessoires",
      "tech-accessories": "Accessoires",
    },
    card: {
      addToCart: "Ajouter au panier",
      added: "Ajouté",
      outOfStock: "Épuisé",
      off: "DE RÉDUCTION",
      newBadge: "NOUVEAU",
      saveWishlist: "Mettre en favoris",
      removeWishlist: "Retirer des favoris",
      viewProduct: "Voir l'article",
    },
    product: {
      selectSize: "Choisir la taille",
      selectColor: "Choisir la couleur",
      quantity: "Quantité",
      overview: "À propos de l'article",
      specifications: "Détails et matières",
      reviews: "Avis clients",
      writeReview: "Donner votre avis",
      yourRating: "Votre note",
      yourName: "Votre nom",
      reviewTitle: "Titre de l'avis",
      comment: "Votre message",
      submitReview: "Envoyer l'avis",
      reviewSubmitted: "Merci ! Votre avis a bien été envoyé.",
      relatedProducts: "Vous aimerez aussi",
      lowStockWarning: "Attention ! Il ne reste que quelques pièces en stock.",
      freeDelivery: "Livraison rapide gratuite",
      easyReturns: "Retour sous 30 jours",
      verifiedItem: "Produit 100% original",
      breadcrumbCatalog: "Boutique",
    },
    cart: {
      title: "Mon Panier",
      empty: "Votre panier est vide",
      emptyDesc: "Vous n'avez pas encore d'articles dans votre panier. Allez voir notre boutique !",
      startShopping: "Commencer mes achats",
      checkout: "Passer la commande",
      subtotal: "Sous-total",
      shipping: "Livraison",
      free: "GRATUIT",
      discount: "Réduction",
      tax: "Taxe (estimée)",
      total: "Total",
      promoCode: "Code promo",
      apply: "Appliquer",
      remove: "Supprimer",
      freeShippingBar: "Bravo ! Vous avez la livraison gratuite !",
      unlockFreeShipping: "Ajoutez des articles pour la livraison gratuite",
      clearCart: "Vider le panier",
      itemCount: "articles",
      each: "l'unité",
    },
    checkout: {
      title: "Commande",
      step1: "1. Vos informations",
      step2: "2. Mode de livraison",
      step3: "3. Paiement",
      contactInfo: "Adresse de livraison",
      email: "Adresse e-mail",
      firstName: "Prénom",
      lastName: "Nom de famille",
      address: "Adresse (rue et numéro)",
      apartment: "Appartement, bâtiment (facultatif)",
      city: "Ville",
      state: "Région / Département",
      postalCode: "Code postal",
      country: "Pays",
      phone: "Numéro de téléphone",
      deliveryMethod: "Choisir le mode de livraison",
      economy: "Livraison standard",
      standard: "Livraison rapide",
      express: "Livraison express",
      economyTime: "5 à 8 jours ouvrés",
      standardTime: "3 à 5 jours ouvrés",
      expressTime: "1 à 2 jours ouvrés",
      paymentInfo: "Informations de la carte",
      cardName: "Nom sur la carte",
      cardNumber: "Numéro de carte",
      expiry: "Date d'expiration (MM/AA)",
      cvc: "Code CVC",
      placeOrder: "Payer et valider la commande",
      processing: "Validation de votre commande...",
      orderSummary: "Résumé de la commande",
      continueToDelivery: "Continuer vers la livraison",
      continueToPayment: "Continuer vers le paiement",
      backStep: "Retour",
      freeShippingApplied: "Livraison gratuite offerte",
    },
    confirmation: {
      title: "Commande confirmée !",
      subtitle: "Merci pour votre achat. Nous préparons votre colis avec soin.",
      orderId: "Numéro de commande",
      copy: "Copier",
      copied: "Copié !",
      itemsOrdered: "Articles commandés",
      shippingAddress: "Livré à",
      deliveryMethod: "Mode de livraison",
      paymentMethod: "Moyen de paiement",
      printInvoice: "Imprimer la facture / Reçu",
      continueShopping: "Continuer mes achats",
      deliveryNotice: "Vous recevrez bientôt un e-mail avec le lien de suivi de votre colis.",
    },
    wishlist: {
      title: "Mes Favoris",
      subtitle: "Retrouvez tous vos articles préférés au même endroit.",
      empty: "Aucun favori pour le moment",
      emptyDesc: "Cliquez sur le petit cœur d'un produit pour l'enregistrer ici.",
      moveAllToCart: "Tout mettre au panier",
      clear: "Tout effacer",
      exploreBtn: "Voir la boutique",
    },
    invoice: {
      title: "Facture et Reçu d'achat",
      printBtn: "Imprimer / Enregistrer en PDF",
      orderNo: "Facture n°",
      date: "Date",
      status: "État du paiement",
      paid: "PAYÉ",
      customer: "Client",
      item: "Article",
      qty: "Qté",
      price: "Prix",
      total: "Total",
      subtotal: "Sous-total",
      discount: "Réduction",
      shipping: "Livraison",
      finalTotal: "Total TTC",
    },
    footer: {
      about: "Votre boutique en ligne simple et rapide. Vêtements de qualité, livraison soignée et prix clairs.",
      quickLinks: "Liens utiles",
      support: "Service client",
      guarantee: "Achat sécurisé",
      guaranteeText: "Paiement 100% protégé et retours simples sous 30 jours.",
      rights: "Tous droits réservés.",
      platform: "Créé avec Next.js",
    },
    theme: {
      light: "Mode clair",
      dark: "Mode sombre",
      toggle: "Changer de thème",
    },
  },
};
