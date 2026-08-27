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

const posts = [
  {
    id: 'blog-crown-pizza-launch',
    title: 'Introducing Our New Crown Pizza',
    slug: 'introducing-crown-pizza',
    excerpt: 'Experience pizza royalty with extra toppings, extra cheese, and premium flavor.',
    content:
      'We are excited to announce our new Crown Pizza. It is extra loaded, extra cheesy, and built for full flavor in every bite. Available now in Regular, Large, and Jumbo sizes.',
    featuredImage: '',
    author: 'The Melt 9 Kitchen',
    status: 'published',
    tags: ['new', 'pizza', 'launch']
  },
  {
    id: 'blog-weekend-combo-guide',
    title: 'Weekend Combo Guide for Families',
    slug: 'weekend-combo-guide-for-families',
    excerpt: 'Best combo picks for family nights with pizza, fries, chicken, and drinks.',
    content:
      'Planning a family meal? Start with a large pizza combo, add crispy chicken, and include drinks for everyone. Our deals are designed to save cost while keeping portions generous.',
    featuredImage: '',
    author: 'The Melt 9 Team',
    status: 'published',
    tags: ['deals', 'family', 'guide']
  },
  {
    id: 'blog-kitchen-quality-standards',
    title: 'How We Keep Quality Consistent Every Day',
    slug: 'how-we-keep-quality-consistent',
    excerpt: 'A quick look at our daily prep, ingredient checks, and service standards.',
    content:
      'From dough preparation to final packaging, our kitchen follows a strict workflow to keep taste and quality consistent. Fresh ingredients and process discipline are our core standards.',
    featuredImage: '',
    author: 'Chef Team',
    status: 'published',
    tags: ['kitchen', 'quality']
  }
];

const seed = async () => {
  console.log(`Seeding ${posts.length} blog posts...`);

  for (const post of posts) {
    await db.collection('blog').doc(post.id).set(
      {
        ...post,
        views: 0,
        updatedAt: FieldValue.serverTimestamp(),
        publishedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  }

  console.log(`Done. Upserted ${posts.length} posts into 'blog' collection.`);
};

seed().catch((err) => {
  console.error('Blog seed failed:', err);
  process.exit(1);
});
