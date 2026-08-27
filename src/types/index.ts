// User Roles
export type UserRole = 'customer' | 'kitchen' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: Date;
  favoriteItems?: string[]; // Array of menu item IDs
}

export interface Address {
  id: string;
  label: string; // 'Home', 'Work', etc.
  street: string;
  area: string;
  city: string;
  instructions?: string;
  isDefault: boolean;
}

// Menu Categories based on your menu
export type MenuCategory = 
  | 'Pizza' 
  | 'Premium Pizza' 
  | 'Xtreme Pizza' 
  | 'Calzone' 
  | 'Appetizer' 
  | 'Wings' 
  | 'Burger' 
  | 'Fried Chicken' 
  | 'Sandwich' 
  | 'Pasta' 
  | 'Salad' 
  | 'Platter' 
  | 'Dip' 
  | 'Dessert' 
  | 'Beverage';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  subcategory?: string; // For Standard, Premium, Xtreme within Pizza
  imageUrl: string;
  available: boolean;
  isFeatured?: boolean;
  
  // For items with multiple sizes (like pizzas)
  sizes?: {
    name: 'Small' | 'Regular' | 'Large' | 'Jumbo' | '6 inch' | '9 inch' | '12 inch' | '14 inch';
    price: number;
    discountPrice?: number; // For super mega discount
  }[];
  
  // For items with fixed price (like burgers, pasta)
  basePrice?: number;
  
  // For items with piece count
  pieces?: {
    count: number;
    price: number;
  }[];
  
  // Available add-ons
  addons?: AddOn[];
  
  // For deals inclusion
  availableInDeals?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string; // 'toppings', 'extras', 'sauces'
}

export interface Order {
  id: string;
  orderNumber: string; // Human readable number (e.g., #M9-1234)
  customerId: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: Address;
  
  status: OrderStatus;
  statusHistory: StatusHistory[];
  
  paymentMethod: 'cod'; // Cash on Delivery only for now
  paymentStatus: 'pending' | 'paid';
  
  specialInstructions?: string;
  
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'      // Order placed, waiting for kitchen acceptance
  | 'confirmed'    // Kitchen accepted
  | 'preparing'    // Being prepared
  | 'ready'        // Ready for pickup/delivery
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export interface StatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy: string; // userId who updated
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  selectedSize?: string;
  selectedAddons?: {
    id: string;
    name: string;
    price: number;
  }[];
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface Deal {
  id: string;
  name: string; // "Deal 01", "Deal 02", etc.
  description: string;
  items: DealItem[];
  price: number;
  imageUrl?: string;
  available: boolean;
  validFrom?: Date;
  validTo?: Date;
  applicableCategories?: string[]; // ['Standard Pizza'] etc.
}

export interface DealItem {
  menuItemId: string;
  name: string;
  quantity: number;
  size?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  tags?: string[];
}