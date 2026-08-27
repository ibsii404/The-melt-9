import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Deal, DealItem, DealWithSavings } from '../types/deal.types';
import { getMenuItem } from './menuService';

const DEALS_COLLECTION = 'deals';

// Get all deals
export const getDeals = async (): Promise<Deal[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, DEALS_COLLECTION));
    const deals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Deal));

    return deals
      .filter((deal) => deal.available !== false)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting deals:', error);
    throw error;
  }
};

// Get all deals (including unavailable - for kitchen)
export const getAllDeals = async (): Promise<Deal[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, DEALS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Deal)).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting all deals:', error);
    throw error;
  }
};

// Get single deal
export const getDeal = async (id: string): Promise<Deal | null> => {
  try {
    const docRef = doc(db, DEALS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Deal;
    }
    return null;
  } catch (error) {
    console.error('Error getting deal:', error);
    throw error;
  }
};

// Add new deal
export const addDeal = async (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, DEALS_COLLECTION), {
      ...deal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding deal:', error);
    throw error;
  }
};

// Update deal
export const updateDeal = async (id: string, updates: Partial<Deal>): Promise<void> => {
  try {
    const docRef = doc(db, DEALS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};

// Delete deal
export const deleteDeal = async (id: string, imagePath?: string): Promise<void> => {
  try {
    // Delete image from storage if exists
    if (imagePath) {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef).catch(() => console.log('Image not found'));
    }
    
    const docRef = doc(db, DEALS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};

// Toggle deal availability
export const toggleDealAvailability = async (id: string, available: boolean): Promise<void> => {
  try {
    const docRef = doc(db, DEALS_COLLECTION, id);
    await updateDoc(docRef, {
      available,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling deal availability:', error);
    throw error;
  }
};

// Calculate savings for a deal
export const calculateDealSavings = async (deal: Deal): Promise<number> => {
  try {
    let originalTotal = 0;
    
    for (const item of deal.items) {
      const menuItem = await getMenuItem(item.menuItemId);
      if (menuItem) {
        if (item.size && menuItem.sizes) {
          const sizePrice = menuItem.sizes.find(s => s.name === item.size);
          originalTotal += (sizePrice?.price || 0) * item.quantity;
        } else if (menuItem.basePrice) {
          originalTotal += menuItem.basePrice * item.quantity;
        } else if (menuItem.pieces) {
          originalTotal += menuItem.pieces[0].price * item.quantity;
        }
      }
    }
    
    return originalTotal - deal.price;
  } catch (error) {
    console.error('Error calculating deal savings:', error);
    return 0;
  }
};

// Validate deal items (ensure only standard pizzas)
export const validateDealItems = async (deal: Deal): Promise<{ valid: boolean; message?: string }> => {
  try {
    for (const item of deal.items) {
      if (item.isPizza) {
        const menuItem = await getMenuItem(item.menuItemId);
        if (menuItem) {
          // Check if it's a standard pizza (not premium or xtreme)
          if (menuItem.isPremium || menuItem.isXtreme || menuItem.category !== 'Pizza') {
            return {
              valid: false,
              message: `${item.name} is not a standard pizza. Deals only include standard pizzas.`
            };
          }
        }
      }
    }
    return { valid: true };
  } catch (error) {
    console.error('Error validating deal items:', error);
    return { valid: false, message: 'Error validating deal items' };
  }
};

// Upload deal image
export const uploadDealImage = async (file: File, dealName: string): Promise<{ url: string; path: string }> => {
  try {
    const timestamp = Date.now();
    const fileName = `${dealName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;
    const storageRef = ref(storage, `deals/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return { url, path: `deals/${fileName}` };
  } catch (error) {
    console.error('Error uploading deal image:', error);
    throw error;
  }
};
