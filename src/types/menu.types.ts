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

export type PizzaSize = 'Small' | 'Regular' | 'Large' | 'Jumbo';
export type PizzaInch = '6 inch' | '9 inch' | '12 inch' | '14 inch';

export interface SizePrice {
  name: PizzaSize | PizzaInch;
  price: number;
  discountPrice?: number; // For super mega discount
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string; // 'toppings', 'extras', 'sauces'
}

export interface PieceOption {
  count: number;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  subcategory?: string; // 'Standard', 'Premium', 'Xtreme' for pizzas
  imageUrl: string;
  imagePath?: string; // Path in Firebase Storage
  available: boolean;
  isFeatured?: boolean;
  
  // For items with multiple sizes (like pizzas)
  sizes?: SizePrice[];
  
  // For items with fixed price (like burgers, pasta)
  basePrice?: number;
  
  // For items with piece count (like wings, garlic bread)
  pieces?: PieceOption[];
  
  // Available add-ons
  addons?: AddOn[];
  
  // For deals inclusion
  availableInDeals?: boolean;
  
  // Special flags
  isPremium?: boolean;
  isXtreme?: boolean;
  hasDiscount?: boolean;
  discountNote?: string; // "Super Mega Discount", etc.
  
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategoryGroup {
  id: string;
  name: string;
  items: MenuItem[];
}