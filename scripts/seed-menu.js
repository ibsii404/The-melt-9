import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const requiredEnv = ['VITE_FIREBASE_PROJECT_ID'];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error('Missing required env vars:', missing.join(', '));
  process.exit(1);
}

const loadServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
      if (raw.startsWith('{')) return JSON.parse(raw);
      const filePath = resolve(raw);
      return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON value.');
      throw error;
    }
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    return JSON.parse(decoded);
  }

  return null;
};

const serviceAccount = loadServiceAccount();
if (!serviceAccount) {
  console.error(
    'Missing service account. Set FIREBASE_SERVICE_ACCOUNT_JSON (JSON string or file path) or FIREBASE_SERVICE_ACCOUNT_BASE64.'
  );
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID
  });
}

const db = getFirestore();

const standardPizzaSizes = [
  { name: 'Small', price: 499, discountPrice: 399 },
  { name: 'Regular', price: 899, discountPrice: 599 },
  { name: 'Large', price: 1399, discountPrice: 699 },
  { name: 'Jumbo', price: 1599, discountPrice: 799 }
];

const menuItems = [
  {
    name: 'Crunchy Pizza',
    description: 'Crispy Chicken, Green Pepper, Tomatoes, Pickel & Special Sauce',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Melt 9 Special',
    description: 'Chicken fajita chunks, onion, capsicum, mushroom, black olive on a special sauce topped with mozzarella cheese & special yellow sauce',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Chicken Arabia',
    description: 'Spicy chicken chunks, onion, jalapeno, black olive, pickles, sweet corn, on a creamy mayo sauce with 100% mozzarella cheese',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Creamy Chicken',
    description: 'Black pepper chicken, onion, mozzarella cheese and special creamy garlic sauce garnished with special creamy mayo on top',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Spicy Sriracha Pizza',
    description: 'Spicy chicken, onion, green pepper, red jalapeno, green jalapeno & spicy sauce',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Chicken Bonfire',
    description: 'Chicken fajita, hot white sauce, onions, tomatoes, capsicum, jalapenos and mozzarella cheese garnished with creamy garlic sauce',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Italiano Star',
    description: 'Chicken fajita chunks, seekh kabab chunks, capsicum, mushroom, on a cream mayo sauce & 100% mozzarella cheese',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Cheese Lover',
    description: 'Topped & loaded with 100% mozzarella cheese',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Chicken Tikka',
    description: 'Chicken tikka chunks, onion, on a marinara sauce & 100% mozzarella cheese',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Vegi Lover',
    description: 'Onion, tomato, capsicum, olive, mushrooms, sweet corn & mozzarella cheese with marinara sauce',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Chicken Fajita',
    description: 'Chicken fajita chunks, onion, capsicum, on a marinara sauce & 100% mozzarella cheese',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Cheese & Pepperoni',
    description: 'Lots of pepperoni & 100% mozzarella cheese on a marinara sauce',
    category: 'Pizza',
    subcategory: 'Standard',
    sizes: standardPizzaSizes,
    hasDiscount: true,
    discountNote: 'Super Mega Discount'
  },
  {
    name: 'Crown Pizza',
    description: 'Introducing Crown Pizza (Extra Toppings - Extra Loaded)',
    category: 'Premium Pizza',
    subcategory: 'Premium',
    sizes: [
      { name: 'Regular', price: 999 },
      { name: 'Large', price: 1599 },
      { name: 'Jumbo', price: 1899 }
    ],
    isPremium: true
  },
  {
    name: 'Chicken Kababish Pizza',
    description: 'Extra Toppings - Extra Loaded',
    category: 'Premium Pizza',
    subcategory: 'Premium',
    sizes: [
      { name: 'Regular', price: 999 },
      { name: 'Large', price: 1599 },
      { name: 'Jumbo', price: 1899 }
    ],
    isPremium: true
  },
  {
    name: 'Chicken Tikka (Xtreme)',
    description: 'Double layered pizza with center filling meat & cheese and a loaded mix of vegetables',
    category: 'Xtreme Pizza',
    subcategory: 'Xtreme',
    sizes: [
      { name: 'Regular', price: 1199 },
      { name: 'Large', price: 1799 }
    ],
    isXtreme: true
  },
  {
    name: 'Hot Peri Peri (Xtreme)',
    description: 'Double layered pizza with center filling meat & cheese plus jalapenos for extra heat',
    category: 'Xtreme Pizza',
    subcategory: 'Xtreme',
    sizes: [
      { name: 'Regular', price: 1199 },
      { name: 'Large', price: 1799 }
    ],
    isXtreme: true
  },
  {
    name: 'Calzone Quesadilla',
    description: 'Signature calzone quesadilla',
    category: 'Calzone',
    basePrice: 799
  },
  {
    name: 'Garlic Bread',
    description: 'Freshly baked garlic bread',
    category: 'Appetizer',
    pieces: [{ count: 4, price: 299 }]
  },
  {
    name: 'Cheesy Garlic Bread',
    description: 'Garlic bread topped with cheese',
    category: 'Appetizer',
    pieces: [{ count: 4, price: 399 }]
  },
  {
    name: 'Chicken Popcorns',
    description: 'Crispy chicken popcorn',
    category: 'Appetizer',
    pieces: [{ count: 6, price: 399 }]
  },
  {
    name: 'Chicken Nuggets',
    description: 'Crispy nuggets (6 pcs). Note: alternate menu mention shows Rs. 300.',
    category: 'Appetizer',
    pieces: [{ count: 6, price: 399 }]
  },
  {
    name: 'Behari Spin Roll',
    description: 'Behari spin roll',
    category: 'Appetizer',
    pieces: [
      { count: 2, price: 350 },
      { count: 4, price: 600 }
    ]
  },
  {
    name: 'Kababi Spin Roll',
    description: 'Kababi spin roll',
    category: 'Appetizer',
    pieces: [
      { count: 2, price: 350 },
      { count: 4, price: 600 }
    ]
  },
  {
    name: 'French Fries',
    description: 'Classic fries (also listed as Rs. 150 in another menu section)',
    category: 'Appetizer',
    subcategory: 'Side',
    basePrice: 250
  },
  {
    name: 'Garlic Mayo Fries',
    description: 'Fries with garlic mayo (also listed as Rs. 200 in another menu section)',
    category: 'Appetizer',
    subcategory: 'Side',
    basePrice: 350
  },
  {
    name: 'Plain Wings',
    description: 'Oven baked plain wings',
    category: 'Wings',
    pieces: [{ count: 6, price: 449 }]
  },
  {
    name: 'BBQ Wings',
    description: 'Oven baked BBQ wings',
    category: 'Wings',
    pieces: [{ count: 6, price: 499 }]
  },
  {
    name: 'Zinger Burger',
    description: 'Classic zinger burger',
    category: 'Burger',
    basePrice: 400
  },
  {
    name: 'Spicy Zinger',
    description: 'Spicy zinger burger',
    category: 'Burger',
    basePrice: 500
  },
  {
    name: 'Mighty Zinger',
    description: 'Loaded mighty zinger burger',
    category: 'Burger',
    basePrice: 600
  },
  {
    name: 'Crispy Chicken',
    description: 'Fried crispy chicken',
    category: 'Fried Chicken',
    pieces: [{ count: 1, price: 250 }]
  },
  {
    name: 'Arabic Creamy Sandwich',
    description: 'Signature creamy Arabic sandwich',
    category: 'Sandwich',
    basePrice: 549
  },
  {
    name: 'Spicy Bonfire Sandwich',
    description: 'Spicy bonfire sandwich',
    category: 'Sandwich',
    basePrice: 549
  },
  {
    name: 'Creamy Pasta',
    description: 'Creamy chicken pasta',
    category: 'Pasta',
    basePrice: 549
  },
  {
    name: 'Spicy Bonfire Pasta',
    description: 'Spicy bonfire pasta',
    category: 'Pasta',
    basePrice: 549
  },
  {
    name: 'Crunchy Chicken Pasta',
    description: 'Crunchy chicken pasta',
    category: 'Pasta',
    basePrice: 549
  },
  {
    name: 'Mix Salad',
    description: 'Only Delivery',
    category: 'Salad',
    basePrice: 499
  },
  {
    name: 'Social Platter',
    description: 'Plain Wings 6 pcs, Garlic Bread 4 pcs, Behari Spin Roll 2 pcs, French Fries, 2 Dip Sauces',
    category: 'Platter',
    basePrice: 999
  },
  {
    name: 'Dip Sauce',
    description: 'Sauce options: Jalapeno, BBQ Smoky, Sriracha, Bonfire',
    category: 'Dip',
    basePrice: 60
  },
  {
    name: 'Three Milk Cake',
    description: 'Fresh dessert',
    category: 'Dessert',
    basePrice: 499
  },
  {
    name: 'Brownie',
    description: 'Chocolate brownie',
    category: 'Dessert',
    pieces: [{ count: 4, price: 399 }]
  },
  {
    name: 'Choco Lava Cake',
    description: 'Warm chocolate lava cake',
    category: 'Dessert',
    basePrice: 249
  },
  {
    name: 'Purified Water Small',
    description: 'Small bottled water',
    category: 'Beverage',
    basePrice: 100
  },
  {
    name: 'Soft Drink 300ml',
    description: 'Cold drink 300ml',
    category: 'Beverage',
    basePrice: 120
  },
  {
    name: 'Soft Drink 500ml',
    description: 'Cold drink 500ml',
    category: 'Beverage',
    basePrice: 200
  }
];

const toId = (item) => {
  const base = `${item.category}-${item.subcategory || ''}-${item.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base;
};

const seed = async () => {
  console.log(`Seeding ${menuItems.length} menu items...`);

  let count = 0;
  for (const item of menuItems) {
    const id = toId(item);
    await db.collection('menu').doc(id).set(
      {
        ...item,
        imageUrl: item.imageUrl || '',
        available: true,
        isFeatured: item.isFeatured || false,
        availableInDeals: item.availableInDeals || false,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
    count += 1;
  }

  console.log(`Done. Upserted ${count} items into 'menu' collection.`);
};

seed().catch((err) => {
  console.error('Menu seed failed:', err);
  process.exit(1);
});
