import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MenuItem } from '../types';

export const sampleMenuData: Omit<MenuItem, 'id'>[] = [
  // Standard Pizzas
  {
    name: "Crunchy Pizza",
    description: "Crispy Chicken, Green Pepper, Tomatoes, Pickel & Special Sauce",
    category: "Pizza",
    imageUrl: "",
    available: true,
    sizes: [
      { name: "6 inch", price: 499 },
      { name: "9 inch", price: 899 },
      { name: "12 inch", price: 1399 },
      { name: "14 inch", price: 1599 }
    ],
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  },
  {
    name: "Melt 9 Special",
    description: "Chicken fajita chunks, onion, Capsicum, mushroom, black olive on a special sauce topped with mozzarella cheese & special yellow sauce",
    category: "Pizza",
    imageUrl: "",
    available: true,
    sizes: [
      { name: "6 inch", price: 499 },
      { name: "9 inch", price: 899 },
      { name: "12 inch", price: 1399 },
      { name: "14 inch", price: 1599 }
    ],
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  },
  // Premium Pizzas
  {
    name: "Crown Pizza",
    description: "Introducing Crown Pizza (Extra Toppings - Extra Loaded)",
    category: "Premium Pizza",
    imageUrl: "",
    available: true,
    sizes: [
      { name: "9 inch", price: 999 },
      { name: "12 inch", price: 1599 },
      { name: "14 inch", price: 1899 }
    ],
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  },
  // Appetizers
  {
    name: "Garlic Bread",
    description: "4 pieces of crispy garlic bread",
    category: "Appetizer",
    imageUrl: "",
    available: true,
    pieces: [
      { count: 4, price: 299 }
    ],
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  },
  // Burgers
  {
    name: "Zinger Burger",
    description: "Crispy chicken burger with lettuce and mayo",
    category: "Burger",
    imageUrl: "",
    available: true,
    basePrice: 400,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  },
  // Deals
  // We'll create deals separately
];

export const sampleDeals = [
  {
    name: "Deal 01",
    description: "1 Small Pizza, 1 Pc. Crispy Chicken with Fries",
    items: [
      { menuItemId: "", name: "Small Pizza", quantity: 1 },
      { menuItemId: "", name: "Crispy Chicken", quantity: 1 },
      { menuItemId: "", name: "French Fries", quantity: 1 }
    ],
    price: 550,
    available: true,
    applicableCategories: ["Standard Pizza"]
  },
  {
    name: "Deal 02",
    description: "1 Small Pizza, 1 Zinger Burger with A Drink",
    items: [
      { menuItemId: "", name: "Small Pizza", quantity: 1 },
      { menuItemId: "", name: "Zinger Burger", quantity: 1 },
      { menuItemId: "", name: "Soft Drink", quantity: 1 }
    ],
    price: 700,
    available: true,
    applicableCategories: ["Standard Pizza"]
  }
  // Add all 8 deals
];

// Function to populate menu (run once)
export const populateMenu = async () => {
  try {
    const menuRef = collection(db, 'menu');
    for (const item of sampleMenuData) {
      await addDoc(menuRef, item);
      console.log(`Added: ${item.name}`);
    }
    console.log('Menu populated successfully!');
  } catch (error) {
    console.error('Error populating menu:', error);
  }
};