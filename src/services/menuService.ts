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
import { MenuItem, MenuCategory } from '../types/menu.types';

const MENU_COLLECTION = 'menu';

// Get all menu items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem));

    return items.sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category: MenuCategory): Promise<MenuItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem));

    return items
      .filter(item => item.category === category && item.available !== false)
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting menu items by category:', error);
    throw error;
  }
};

// Get single menu item
export const getMenuItem = async (id: string): Promise<MenuItem | null> => {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MenuItem;
    }
    return null;
  } catch (error) {
    console.error('Error getting menu item:', error);
    throw error;
  }
};

// Add new menu item
export const addMenuItem = async (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, MENU_COLLECTION), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

// Update menu item
export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Toggle availability
export const toggleAvailability = async (id: string, available: boolean): Promise<void> => {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await updateDoc(docRef, {
      available,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling availability:', error);
    throw error;
  }
};

// Delete menu item
export const deleteMenuItem = async (id: string, imagePath?: string): Promise<void> => {
  try {
    // Delete image from storage if exists
    if (imagePath) {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef).catch(() => console.log('Image not found'));
    }
    
    // Delete document
    const docRef = doc(db, MENU_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Upload item image
export const uploadItemImage = async (file: File, itemName: string): Promise<{ url: string; path: string }> => {
  try {
    const timestamp = Date.now();
    const fileName = `${itemName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;
    const storageRef = ref(storage, `menu-items/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return { url, path: `menu-items/${fileName}` };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Group menu items by category
export const groupMenuByCategory = (items: MenuItem[]): Record<string, MenuItem[]> => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
};

// Get featured items
export const getFeaturedItems = async (): Promise<MenuItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem)).filter(item => item.isFeatured && item.available !== false);
  } catch (error) {
    console.error('Error getting featured items:', error);
    throw error;
  }
};

// Get items with discount (Super Mega Discount)
export const getDiscountedItems = async (): Promise<MenuItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem)).filter(item => item.hasDiscount && item.available !== false);
  } catch (error) {
    console.error('Error getting discounted items:', error);
    throw error;
  }
};
