import { Shop, Product, Review, SavedAddress, UserLocation, ModerationReport, AuditLog, Order, ShopPost } from '../types';

export const DEFAULT_USER_LOCATION: UserLocation = {
  lat: 28.5355,
  lng: 77.3910,
  address: "Sector 62, Institutional Area, Park View Road",
  city: "Noida",
  postalCode: "201309",
  landmark: "Near Eco Park Metro Station"
};

export const PRESET_LOCATIONS: UserLocation[] = [
  {
    lat: 28.5355,
    lng: 77.3910,
    address: "Sector 62, Institutional Area, Park View Road",
    city: "Noida",
    postalCode: "201309",
    landmark: "Near Eco Park Metro Station"
  },
  {
    lat: 28.5672,
    lng: 77.3210,
    address: "Block B, Sector 18 Commercial Market",
    city: "Noida",
    postalCode: "201301",
    landmark: "Atta Market Junction"
  },
  {
    lat: 28.5100,
    lng: 77.4100,
    address: "Expressway Boulevard, Sector 137 Residential Square",
    city: "Noida",
    postalCode: "201305",
    landmark: "Paras Tierea Complex"
  },
  {
    lat: 28.6139,
    lng: 77.2090,
    address: "Connaught Place Inner Circle, Block F",
    city: "New Delhi",
    postalCode: "110001",
    landmark: "Radial Road 4"
  }
];

export const CATEGORIES = [
  { id: 'cat-all', name: 'All Shops', icon: 'Store', color: 'from-amber-500 to-orange-600' },
  { id: 'cat-grocery', name: 'Groceries & Staples', icon: 'ShoppingBag', color: 'from-emerald-500 to-teal-600' },
  { id: 'cat-bakery', name: 'Bakeries & Cafes', icon: 'Cake', color: 'from-amber-600 to-yellow-600' },
  { id: 'cat-produce', name: 'Fresh Farm Produce', icon: 'Apple', color: 'from-green-500 to-lime-600' },
  { id: 'cat-pharmacy', name: 'Pharmacy & Wellness', icon: 'ShieldPlus', color: 'from-blue-500 to-cyan-600' },
  { id: 'cat-electronics', name: 'Electronics & Repair', icon: 'Smartphone', color: 'from-indigo-500 to-purple-600' },
  { id: 'cat-fashion', name: 'Boutique & Fashion', icon: 'Shirt', color: 'from-pink-500 to-rose-600' },
  { id: 'cat-home', name: 'Home & Kitchen Essentials', icon: 'Home', color: 'from-orange-500 to-red-600' }
];

export const INITIAL_SHOPS: Shop[] = [
  {
    id: 'shop-1',
    name: 'Green Basket Fresh Organics',
    tagline: 'Farm-picked daily vegetables, seasonal fruits & cold-pressed oils',
    description: 'Serving our local neighborhood with pesticide-free regional greens, seasonal mangoes, heirloom tomatoes, and certified organic dairy items sourced directly from farmer cooperatives.',
    category: 'Fresh Farm Produce',
    categoryId: 'cat-produce',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80',
    ownerName: 'Sunil Aggarwal',
    ownerId: 'user-merchant-1',
    rating: 4.8,
    reviewCount: 142,
    address: 'Shop 14, Central Market, Sector 62',
    lat: 28.5368,
    lng: 77.3925,
    estimatedDeliveryMins: 20,
    minimumOrder: 150,
    deliveryFee: 25,
    freeDeliveryThreshold: 499,
    hours: {
      open: '07:30',
      close: '21:30',
      daysOpen: 'Everyday',
      isOpenNow: true
    },
    isVerified: true,
    isSponsored: true,
    status: 'active',
    allowsCod: true,
    allowsUpi: true,
    allowsCards: true,
    phoneMasked: '+91 98••• ••201',
    email: 'contact@greenbasketlocal.in',
    tags: ['Fresh Daily', 'Farm Direct', 'Organic Greens', 'Rapid Delivery']
  },
  {
    id: 'shop-2',
    name: 'Artisan Crust Bakehouse',
    tagline: 'Sourdough loaves, buttery croissants, and handcrafted desserts',
    description: 'Neighborhood wood-fire bakery baking fresh artisan batches every morning at 6 AM. Gluten-free loaves, Belgian chocolate cakes, and espresso available on call.',
    category: 'Bakeries & Cafes',
    categoryId: 'cat-bakery',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&auto=format&fit=crop&q=80',
    ownerName: 'Elena Varma',
    ownerId: 'user-merchant-2',
    rating: 4.9,
    reviewCount: 218,
    address: 'Plot 4A, Commercial Courtyard, Sector 62',
    lat: 28.5338,
    lng: 77.3892,
    estimatedDeliveryMins: 25,
    minimumOrder: 200,
    deliveryFee: 30,
    freeDeliveryThreshold: 599,
    hours: {
      open: '08:00',
      close: '22:00',
      daysOpen: 'Mon - Sun',
      isOpenNow: true
    },
    isVerified: true,
    isSponsored: false,
    status: 'active',
    allowsCod: true,
    allowsUpi: true,
    allowsCards: true,
    phoneMasked: '+91 97••• ••844',
    email: 'hello@artisancrust.com',
    tags: ['Sourdough', 'Baked Fresh', 'Custom Cakes', 'Top Rated']
  },
  {
    id: 'shop-3',
    name: 'HealthPlus Care & Wellness',
    tagline: 'Prescription medicines, baby care essentials & diagnostic kits',
    description: 'Licensed pharmacy serving the colony for over 12 years. Certified pharmacists, temperature-regulated insulin storage, senior citizen discounts, and quick emergency delivery.',
    category: 'Pharmacy & Wellness',
    categoryId: 'cat-pharmacy',
    logoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=80',
    ownerName: 'Dr. Ramesh Nair',
    ownerId: 'user-merchant-3',
    rating: 4.7,
    reviewCount: 96,
    address: 'G-2, Plaza Corner, Metro Gate 2 Road',
    lat: 28.5385,
    lng: 77.3940,
    estimatedDeliveryMins: 15,
    minimumOrder: 100,
    deliveryFee: 20,
    freeDeliveryThreshold: 399,
    hours: {
      open: '07:00',
      close: '23:30',
      daysOpen: '24/7 Support',
      isOpenNow: true
    },
    isVerified: true,
    isSponsored: false,
    status: 'active',
    allowsCod: true,
    allowsUpi: true,
    allowsCards: true,
    phoneMasked: '+91 99••• ••119',
    email: 'orders@healthpluslocal.org',
    tags: ['Express Medicines', 'Baby Care', 'Licensed Pharmacist']
  },
  {
    id: 'shop-4',
    name: 'CityTech Gadgets & Mobile Hub',
    tagline: 'Smartphone accessories, fast chargers, audio gear & instant repair',
    description: 'Official warranty accessories for Apple, Samsung, OnePlus. Instant screen replacement, original charging cables, powerbanks, and Bluetooth audio gear.',
    category: 'Electronics & Repair',
    categoryId: 'cat-electronics',
    logoUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    ownerName: 'Vikram Joshi',
    ownerId: 'user-merchant-4',
    rating: 4.6,
    reviewCount: 88,
    address: 'Shop 22, Cyber Plaza, Tech Zone',
    lat: 28.5410,
    lng: 77.3965,
    estimatedDeliveryMins: 30,
    minimumOrder: 300,
    deliveryFee: 40,
    freeDeliveryThreshold: 999,
    hours: {
      open: '10:00',
      close: '21:00',
      daysOpen: 'Mon - Sat',
      isOpenNow: true
    },
    isVerified: true,
    isSponsored: false,
    status: 'active',
    allowsCod: false,
    allowsUpi: true,
    allowsCards: true,
    phoneMasked: '+91 91••• ••552',
    email: 'support@citytechlocal.io',
    tags: ['Genuine Accessories', 'Express Repairs', 'Tech Gear']
  },
  {
    id: 'shop-5',
    name: 'Royal Heritage Spices & Pantry',
    tagline: 'Whole stone-ground spices, basmati rice, dry fruits & pulses',
    description: 'Third generation grocery merchant offering aromatic Kerala cardamom, Kashmiri saffron, cold-milled wheat flour, and premium dry fruit gift platters.',
    category: 'Groceries & Staples',
    categoryId: 'cat-grocery',
    logoUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=800&auto=format&fit=crop&q=80',
    ownerName: 'Harpreet Singh',
    ownerId: 'user-merchant-5',
    rating: 4.9,
    reviewCount: 310,
    address: 'B-7, Old Bazaar Street, Near Gurudwara',
    lat: 28.5312,
    lng: 77.3870,
    estimatedDeliveryMins: 20,
    minimumOrder: 250,
    deliveryFee: 20,
    freeDeliveryThreshold: 799,
    hours: {
      open: '08:00',
      close: '21:00',
      daysOpen: 'Everyday',
      isOpenNow: true
    },
    isVerified: true,
    isSponsored: true,
    status: 'active',
    allowsCod: true,
    allowsUpi: true,
    allowsCards: true,
    phoneMasked: '+91 98••• ••770',
    email: 'harpreet@royalheritagepantry.com',
    tags: ['Pure Spices', 'Dry Fruits', 'Daily Essentials']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Green Basket Fresh Organics
  {
    id: 'prod-1',
    shopId: 'shop-1',
    shopName: 'Green Basket Fresh Organics',
    name: 'Hydroponic English Spinach (Baby Palak)',
    description: 'Tender, washed and pesticide-free hydroponic spinach leaves packed in moisture-lock eco trays. Rich in iron and crisp for salads or smoothies.',
    category: 'Fresh Farm Produce',
    price: 65,
    discountPrice: 49,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    brand: 'Green Basket Bio',
    sku: 'GB-SPIN-250G',
    stock: 45,
    unit: '250g pack',
    variants: [
      { id: 'v-1', name: '250g Tray', price: 49, stock: 30 },
      { id: 'v-2', name: '500g Duo Pack', price: 89, discountPrice: 85, stock: 15 }
    ],
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-2',
    shopId: 'shop-1',
    shopName: 'Green Basket Fresh Organics',
    name: 'Vine-Ripened Cherry Tomatoes',
    description: 'Sweet, sun-ripened red and golden cherry tomatoes picked this morning. Perfect pop of freshness for pastas and toasts.',
    category: 'Fresh Farm Produce',
    price: 90,
    discountPrice: 75,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    brand: 'Green Basket Bio',
    sku: 'GB-CHERRY-TOM',
    stock: 28,
    unit: '250g box',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-3',
    shopId: 'shop-1',
    shopName: 'Green Basket Fresh Organics',
    name: 'Cold-Pressed Golden Mustard Oil',
    description: 'Traditional wood-pressed (Kachi Ghani) pure yellow mustard oil retaining natural pungency, omega-3, and antioxidants.',
    category: 'Fresh Farm Produce',
    price: 240,
    discountPrice: 215,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    brand: 'Veda Heritage',
    sku: 'GB-OIL-MUST-1L',
    stock: 19,
    unit: '1 Litre Glass Bottle',
    isAvailable: true
  },

  // Artisan Crust Bakehouse
  {
    id: 'prod-4',
    shopId: 'shop-2',
    shopName: 'Artisan Crust Bakehouse',
    name: '36-Hour Fermented Country Sourdough',
    description: 'Hand-shaped, naturally leavened artisan loaf with an open crumb, blistering crust, and gentle tanginess. Baked fresh daily in stone hearth ovens.',
    category: 'Bakeries & Cafes',
    price: 180,
    discountPrice: 160,
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80',
    brand: 'Artisan Crust',
    sku: 'AC-SOURDOUGH-REG',
    stock: 14,
    unit: '550g loaf',
    variants: [
      { id: 'v-3', name: 'Whole Loaf (Uncut)', price: 160, stock: 8 },
      { id: 'v-4', name: 'Sliced Medium', price: 160, stock: 6 }
    ],
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-5',
    shopId: 'shop-2',
    shopName: 'Artisan Crust Bakehouse',
    name: 'French Butter Croissant (Box of 2)',
    description: 'Laminated with 82% Normandy cultured butter, flaky exterior shattering into honeycomb layers. Best enjoyed warm.',
    category: 'Bakeries & Cafes',
    price: 220,
    discountPrice: 195,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
    brand: 'Artisan Crust',
    sku: 'AC-CROISSANT-2PC',
    stock: 22,
    unit: '2 pcs',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-6',
    shopId: 'shop-2',
    shopName: 'Artisan Crust Bakehouse',
    name: 'Dark Belgian Truffle Cake Slice',
    description: '70% single-origin Callebaut chocolate ganache layered with moist cacao sponge. Decadent and velvety.',
    category: 'Bakeries & Cafes',
    price: 190,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
    brand: 'Artisan Crust',
    sku: 'AC-CAKE-TRUFFLE',
    stock: 9,
    unit: 'Single Pastry',
    isAvailable: true
  },

  // HealthPlus Care
  {
    id: 'prod-7',
    shopId: 'shop-3',
    shopName: 'HealthPlus Care & Wellness',
    name: 'Advanced Electrolyte Hydration Formula',
    description: 'WHO-recommended oral rehydration salts with Vitamin C and Zinc. Fast recovery from fatigue, heat, and sports exertion.',
    category: 'Pharmacy & Wellness',
    price: 120,
    discountPrice: 105,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    brand: 'HydraCare Rx',
    sku: 'HP-ELECTRO-ORANGE',
    stock: 60,
    unit: 'Box of 10 Sachets',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-8',
    shopId: 'shop-3',
    shopName: 'HealthPlus Care & Wellness',
    name: 'Digital Infrared Forehead Thermometer',
    description: 'Touchless medical-grade thermometer with LCD color backlight, fever alert beeper, and 32-reading memory recall.',
    category: 'Pharmacy & Wellness',
    price: 1299,
    discountPrice: 899,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
    brand: 'AccuCheck Pro',
    sku: 'HP-THERMO-DIGI',
    stock: 12,
    unit: '1 Device',
    isAvailable: true
  },

  // CityTech Gadgets
  {
    id: 'prod-9',
    shopId: 'shop-4',
    shopName: 'CityTech Gadgets & Mobile Hub',
    name: '65W GaN Dual-Port Fast Charger',
    description: 'Compact Gallium Nitride (GaN) rapid power adapter compatible with laptops, iPhone, iPad, and Android flagship phones.',
    category: 'Electronics & Repair',
    price: 1899,
    discountPrice: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1622445262464-84b150777731?w=500&auto=format&fit=crop&q=80',
    brand: 'AnkerVolt',
    sku: 'CT-GAN-65W',
    stock: 18,
    unit: '1 Unit',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-10',
    shopId: 'shop-4',
    shopName: 'CityTech Gadgets & Mobile Hub',
    name: 'Braided Braided Type-C to Type-C 100W Cable',
    description: 'Kevlar-reinforced nylon braided 2-meter fast charging cable with smart E-marker chip.',
    category: 'Electronics & Repair',
    price: 499,
    discountPrice: 349,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    brand: 'KevlarFlex',
    sku: 'CT-CABLE-100W',
    stock: 40,
    unit: '2 Metre',
    isAvailable: true
  },

  // Royal Heritage Spices
  {
    id: 'prod-11',
    shopId: 'shop-5',
    shopName: 'Royal Heritage Spices & Pantry',
    name: 'Grade-1 Green Malabar Cardamom (Elaichi)',
    description: 'Hand-harvested jumbo green pods from Idukki, Kerala. Intense aroma, natural green hue, packed in airtight tin.',
    category: 'Groceries & Staples',
    price: 380,
    discountPrice: 340,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80',
    brand: 'Royal Heritage',
    sku: 'RH-ELAICHI-100G',
    stock: 35,
    unit: '100g Tin',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-12',
    shopId: 'shop-5',
    shopName: 'Royal Heritage Spices & Pantry',
    name: 'Californian Jumbo Almonds (Badam Giri)',
    description: 'Vacuum-packed crisp sweet almonds, zero cholesterol, ideal for daily soaked brain nutrition.',
    category: 'Groceries & Staples',
    price: 520,
    discountPrice: 475,
    imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=80',
    brand: 'Royal Heritage',
    sku: 'RH-ALMOND-500G',
    stock: 25,
    unit: '500g Pouch',
    isAvailable: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    shopId: 'shop-1',
    customerId: 'cust-101',
    customerName: 'Aarav Mehta',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Super crisp baby spinach delivered in just 18 minutes! Was still chilly and fresh. It is wonderful having our neighborhood store on this app without 40-minute dark store delays.',
    date: 'Yesterday at 4:20 PM',
    verifiedPurchase: true,
    shopReply: {
      comment: 'Thank you Aarav ji! We harvest batches directly from our polyhouse every morning. Glad you enjoyed the freshness!',
      date: 'Yesterday at 6:15 PM'
    }
  },
  {
    id: 'rev-2',
    shopId: 'shop-2',
    customerId: 'cust-102',
    customerName: 'Pooja Iyer',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The sourdough crust has that unmistakable crackle and chew. Also did a quick video call with Elena to pick our birthday cake design - super convenient and transparent!',
    date: '2 days ago',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    shopId: 'shop-3',
    customerId: 'cust-103',
    customerName: 'Kunal Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Got emergency medicine and ORS in 12 mins at 10 PM. Masked call worked smoothly without sharing phone numbers.',
    date: 'Sep 10, 2026',
    verifiedPurchase: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8492',
    customerId: 'cust-current',
    customerName: 'Saddam Hussain',
    customerPhoneMasked: '+91 98••• ••812',
    deliveryAddress: {
      id: 'addr-1',
      label: 'Home',
      address: 'Tower 4, Flat 602, Eco City Apartments',
      city: 'Noida',
      postalCode: '201309',
      landmark: 'Near Eco Park Metro Gate 2',
      lat: 28.5355,
      lng: 77.3910,
      isDefault: true
    },
    shopId: 'shop-1',
    shopName: 'Green Basket Fresh Organics',
    shopAddress: 'Shop 14, Central Market, Sector 62',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1
      }
    ],
    subtotal: 173,
    deliveryFee: 25,
    platformFee: 5,
    discount: 20,
    total: 183,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    paymentId: 'pay_upi_982421a98bc',
    signatureVerification: 'sha256_verified_e29b891',
    orderStatus: 'out_for_delivery',
    timeline: [
      {
        status: 'pending',
        label: 'Order Placed',
        timestamp: '12:30 PM',
        description: 'Order received and token generated securely.'
      },
      {
        status: 'accepted',
        label: 'Accepted by Shopkeeper',
        timestamp: '12:32 PM',
        description: 'Sunil Aggarwal confirmed stock availability.'
      },
      {
        status: 'preparing',
        label: 'Packed Fresh',
        timestamp: '12:38 PM',
        description: 'Packed in eco-friendly insulated bags.'
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        timestamp: '12:46 PM',
        description: 'Neighborhood delivery partner Ravi is en route (0.4 km away).'
      }
    ],
    createdAt: 'Today, 12:30 PM',
    estimatedDeliveryTime: '15 mins',
    courierLocation: { lat: 28.5360, lng: 77.3918 }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'admin-01',
    adminName: 'Security Admin Master',
    action: 'SHOP_VERIFIED',
    targetType: 'shop',
    targetId: 'shop-2',
    targetName: 'Artisan Crust Bakehouse',
    timestamp: '2026-09-11 10:14 AM',
    details: 'FSSAI food license and municipal trade permit verified successfully.'
  },
  {
    id: 'log-2',
    adminId: 'admin-01',
    adminName: 'Security Admin Master',
    action: 'SPONSORED_PROMOTION_APPROVED',
    targetType: 'promotion',
    targetId: 'shop-1',
    targetName: 'Green Basket Fresh Organics',
    timestamp: '2026-09-11 02:45 PM',
    details: '7-day local banner pin activated in Sector 62 radius.'
  }
];

export const INITIAL_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    reporterId: 'cust-102',
    reporterName: 'Pooja Iyer',
    targetType: 'review',
    targetId: 'rev-spam-9',
    targetName: 'Suspicious repetitive promo text',
    reason: 'Third-party Telegram link spam attempt detected in comments',
    status: 'pending',
    createdAt: '2026-09-12 11:05 AM'
  }
];

export const INITIAL_POSTS: ShopPost[] = [
  {
    id: 'post-1',
    shopId: 'shop-1',
    shopName: 'Green Basket Fresh Organics',
    shopLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100',
    title: 'Fresh Himachal Apples & Organic Berries Just Arrived!',
    content: 'Morning harvest from Shimla orchards arrived today at 6 AM. Crisp, sweet and 100% wax-free. Flat 15% off on 2kg boxes till 7 PM today!',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600',
    tag: 'Daily Special',
    likesCount: 28,
    hasLiked: false,
    createdAt: '2 hours ago',
    commentsCount: 6
  },
  {
    id: 'post-2',
    shopId: 'shop-2',
    shopName: 'Artisan Crust Bakehouse',
    shopLogo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100',
    title: 'Warm Sourdough Loaves Out of the Oven 🥖',
    content: 'Our naturally fermented 36-hour French sourdough batch is fresh off the stone deck. Pair with local garlic herb butter. Order before 4 PM for doorstep evening delivery.',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600',
    tag: 'New Arrival',
    likesCount: 42,
    hasLiked: true,
    createdAt: '4 hours ago',
    commentsCount: 9
  },
  {
    id: 'post-3',
    shopId: 'shop-3',
    shopName: 'Spice Route Supermarket',
    shopLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100',
    title: 'Weekend Mega Grocery Festival - Extra 10% Cashback on UPI',
    content: 'Stock up your kitchen essentials for the week! Buy 5kg basmati rice or cold-pressed mustard oil and get complimentary cumin seed sachets. Fast 20-minute delivery in Sector 62.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600',
    tag: 'Offer',
    likesCount: 19,
    hasLiked: false,
    createdAt: 'Today, 09:30 AM',
    commentsCount: 3
  }
];
