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
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
    if (raw.startsWith('{')) return JSON.parse(raw);
    return JSON.parse(readFileSync(resolve(raw), 'utf8'));
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

const deals = [
  {
    id: 'deal-01',
    name: 'Deal 01',
    description: '1 Small Pizza, 1 Pc. Crispy Chicken with Fries',
    price: 550,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Small Pizza', quantity: 1, size: 'Small', isPizza: true },
      { menuItemId: 'fried-chicken-crispy-chicken', name: 'Crispy Chicken', quantity: 1 },
      { menuItemId: 'appetizer-side-french-fries', name: 'French Fries', quantity: 1 }
    ]
  },
  {
    id: 'deal-02',
    name: 'Deal 02',
    description: '1 Small Pizza, 1 Zinger Burger with A Drink',
    price: 700,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Small Pizza', quantity: 1, size: 'Small', isPizza: true },
      { menuItemId: 'burger-zinger-burger', name: 'Zinger Burger', quantity: 1 },
      { menuItemId: 'beverage-soft-drink-300ml', name: 'Soft Drink', quantity: 1, size: '300ml' }
    ]
  },
  {
    id: 'deal-03',
    name: 'Deal 03',
    description: '1 Regular Pizza, 1 Zinger Burger, 1 Pc. Crispy Chicken',
    price: 1000,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Regular Pizza', quantity: 1, size: 'Regular', isPizza: true },
      { menuItemId: 'burger-zinger-burger', name: 'Zinger Burger', quantity: 1 },
      { menuItemId: 'fried-chicken-crispy-chicken', name: 'Crispy Chicken', quantity: 1 }
    ]
  },
  {
    id: 'deal-04',
    name: 'Deal 04',
    description: '2 Regular Pizza, 1 Chicken Pasta with Fries',
    price: 1400,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Regular Pizza', quantity: 2, size: 'Regular', isPizza: true },
      { menuItemId: 'pasta-creamy-pasta', name: 'Chicken Pasta', quantity: 1 },
      { menuItemId: 'appetizer-side-french-fries', name: 'French Fries', quantity: 1 }
    ]
  },
  {
    id: 'deal-05',
    name: 'Deal 05',
    description: '1 Large Pizza, 3 Pcs. Crispy Chicken with Fries',
    price: 1500,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Large Pizza', quantity: 1, size: 'Large', isPizza: true },
      { menuItemId: 'fried-chicken-crispy-chicken', name: 'Crispy Chicken', quantity: 3 },
      { menuItemId: 'appetizer-side-french-fries', name: 'French Fries', quantity: 1 }
    ]
  },
  {
    id: 'deal-06',
    name: 'Deal 06',
    description: '1 Large Pizza, 1 Chicken Pasta, 1 Salad with Fries',
    price: 1600,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Large Pizza', quantity: 1, size: 'Large', isPizza: true },
      { menuItemId: 'pasta-creamy-pasta', name: 'Chicken Pasta', quantity: 1 },
      { menuItemId: 'salad-mix-salad', name: 'Mix Salad', quantity: 1 },
      { menuItemId: 'appetizer-side-french-fries', name: 'French Fries', quantity: 1 }
    ]
  },
  {
    id: 'deal-07',
    name: 'Deal 07',
    description: '1 Jumbo Pizza, 3 Pcs. Crispy Chicken with Fries',
    price: 1600,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Jumbo Pizza', quantity: 1, size: 'Jumbo', isPizza: true },
      { menuItemId: 'fried-chicken-crispy-chicken', name: 'Crispy Chicken', quantity: 3 },
      { menuItemId: 'appetizer-side-french-fries', name: 'French Fries', quantity: 1 }
    ]
  },
  {
    id: 'deal-08',
    name: 'Deal 08',
    description: '2 Jumbo Pizza, 1 Chicken Pasta, 1 Salad with Fries',
    price: 2500,
    available: true,
    applicableCategories: ['Standard Pizza'],
    items: [
      { menuItemId: 'pizza-standard-crunchy-pizza', name: 'Jumbo Pizza', quantity: 2, size: 'Jumbo', isPizza: true },
      { menuItemId: 'pasta-creamy-pasta', name: 'Chicken Pasta', quantity: 1 },
      { menuItemId: 'salad-mix-salad', name: 'Mix Salad', quantity: 1 },
      { menuItemId: 'appetizer-side-french-fries', name: 'French Fries', quantity: 1 }
    ]
  }
];

const seed = async () => {
  console.log(`Seeding ${deals.length} deals...`);

  for (const deal of deals) {
    await db.collection('deals').doc(deal.id).set(
      {
        ...deal,
        imageUrl: '',
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  }

  console.log(`Done. Upserted ${deals.length} deals into 'deals' collection.`);
};

seed().catch((err) => {
  console.error('Deal seed failed:', err);
  process.exit(1);
});
