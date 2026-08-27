import { useState, useEffect } from 'react';
import { 
  query, 
  collection, 
  getDocs, 
  QueryConstraint,
  limit as firestoreLimit,
  orderBy,
  where,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface UseOptimizedQueryProps {
  collectionName: string;
  constraints?: QueryConstraint[];
  pageSize?: number;
  cacheTime?: number; // in milliseconds
}

interface CacheItem<T> {
  data: T[];
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();

export function useOptimizedQuery<T>({
  collectionName,
  constraints = [],
  pageSize = 10,
  cacheTime = 5 * 60 * 1000, // 5 minutes default
}: UseOptimizedQueryProps) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const cacheKey = `${collectionName}-${JSON.stringify(constraints)}`;

  useEffect(() => {
    loadInitialData();
  }, [collectionName, JSON.stringify(constraints)]);

  const loadInitialData = async () => {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, collectionName),
        ...constraints,
        firestoreLimit(pageSize)
      );
      
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      
      setData(items);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageSize);
      
      // Update cache
      cache.set(cacheKey, {
        data: items,
        timestamp: Date.now()
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      const q = query(
        collection(db, collectionName),
        ...constraints,
        startAfter(lastDoc),
        firestoreLimit(pageSize)
      );
      
      const querySnapshot = await getDocs(q);
      const newItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      
      setData(prev => [...prev, ...newItems]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageSize);
    } catch (err) {
      setError(err as Error);
    }
  };

  const refresh = () => {
    cache.delete(cacheKey);
    loadInitialData();
  };

  return { data, loading, error, hasMore, loadMore, refresh };
}

// Specific optimized queries
export const useMenuItems = (category?: string) => {
  const constraints: QueryConstraint[] = [where('available', '==', true)];
  
  if (category && category !== 'All') {
    constraints.push(where('category', '==', category));
  }
  
  constraints.push(orderBy('name'));
  
  return useOptimizedQuery({
    collectionName: 'menu',
    constraints,
    pageSize: 20,
  });
};

export const useBlogPosts = (limit = 6) => {
  return useOptimizedQuery({
    collectionName: 'blog',
    constraints: [
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
    ],
    pageSize: limit,
    cacheTime: 10 * 60 * 1000, // 10 minutes for blog posts
  });
};

export const useDeals = () => {
  return useOptimizedQuery({
    collectionName: 'deals',
    constraints: [
      where('available', '==', true),
      orderBy('name'),
    ],
    cacheTime: 15 * 60 * 1000, // 15 minutes for deals
  });
};

export const useUserOrders = (userId: string) => {
  return useOptimizedQuery({
    collectionName: 'orders',
    constraints: [
      where('customerId', '==', userId),
      orderBy('createdAt', 'desc'),
    ],
    pageSize: 5,
    cacheTime: 2 * 60 * 1000, // 2 minutes for orders
  });
};