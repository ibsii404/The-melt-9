export interface Deal {
  id: string;
  name: string; // "Deal 01", "Deal 02", etc.
  description: string;
  items: DealItem[];
  price: number;
  originalPrice?: number; // For showing savings
  imageUrl?: string;
  imagePath?: string;
  available: boolean;
  applicableCategories?: string[]; // ['Standard Pizza'] etc.
  validFrom?: Date;
  validTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealItem {
  menuItemId: string;
  name: string;
  quantity: number;
  size?: string; // For items with sizes (Small, Regular, etc.)
  category?: string; // For validation
  isPizza?: boolean; // For pizza-specific logic
}

export interface DealWithSavings extends Deal {
  savings: number;
  savingsPercentage: number;
}

// The 8 deals from your menu
export const initialDeals: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Deal 01",
    description: "1 Small Pizza, 1 Pc. Crispy Chicken with Fries",
    items: [
      { menuItemId: "", name: "Small Pizza", quantity: 1, size: "Small", isPizza: true },
      { menuItemId: "", name: "Crispy Chicken", quantity: 1 },
      { menuItemId: "", name: "French Fries", quantity: 1 }
    ],
    price: 550,
    applicableCategories: ['Standard Pizza'],
    available: true
  },
  {
    name: "Deal 02",
    description: "1 Small Pizza, 1 Zinger Burger with A Drink",
    items: [
      { menuItemId: "", name: "Small Pizza", quantity: 1, size: "Small", isPizza: true },
      { menuItemId: "", name: "Zinger Burger", quantity: 1 },
      { menuItemId: "", name: "Soft Drink", quantity: 1, size: "300ml" }
    ],
    price: 700,
    applicableCategories: ['Standard Pizza'],
    available: true
  },
  {
    name: "Deal 03",
    description: "1 Regular Pizza, 1 Zinger Burger, 1 Pc. Crispy Chicken",
    items: [
      { menuItemId: "", name: "Regular Pizza", quantity: 1, size: "Regular", isPizza: true },
      { menuItemId: "", name: "Zinger Burger", quantity: 1 },
      { menuItemId: "", name: "Crispy Chicken", quantity: 1 }
    ],
    price: 1000,
    applicableCategories: ['Standard Pizza'],
    available: true
  },
  {
    name: "Deal 04",
    description: "2 Regular Pizzas, 1 Chicken Pasta with Fries",
    items: [
      { menuItemId: "", name: "Regular Pizza", quantity: 2, size: "Regular", isPizza: true },
      { menuItemId: "", name: "Chicken Pasta", quantity: 1 },
      { menuItemId: "", name: "French Fries", quantity: 1 }
    ],
    price: 1400,
    applicableCategories: ['Standard Pizza'],
    available: true
  },
  {
    name: "Deal 05",
    description: "1 Large Pizza, 3 Pcs. Crispy Chicken with Fries",
    items: [
      { menuItemId: "", name: "Large Pizza", quantity: 1, size: "Large", isPizza: true },
      { menuItemId: "", name: "Crispy Chicken", quantity: 3 },
      { menuItemId: "", name: "French Fries", quantity: 1 }
    ],
    price: 1500,
    applicableCategories: ['Standard Pizza'],
    available: true
  },
  {
    name: "Deal 06",
    description: "1 Large Pizza, 1 Chicken Pasta, 1 Salad with Fries",
    items: [
      { menuItemId: "", name: "Large Pizza", quantity: 1, size: "Large", isPizza: true },
      { menuItemId: "", name: "Chicken Pasta", quantity: 1 },
      { menuItemId: "", name: "Mix Salad", quantity: 1 },
      { menuItemId: "", name: "French Fries", quantity: 1 }
    ],
    price: 1600,
    applicableCategories: ['Standard Pizza'],
    available: true
  },
  {
    name: "Deal 07",
    description: "1 Jumbo Pizza, 3 Pcs. Crispy Chicken with Fries",
    items: [
      { menuItemId: "", name: "Jumbo Pizza", quantity: 1, size: "Jumbo", isPizza: true },
      { menuItemId: "", name: "Crispy Chicken", quantity: 3 },
      { menuItemId: "", name: "French Fries", quantity: 1 }
    ],
    price: 1600,
    applicableCategories: ['Standard Pizza'],
    available: true
  },
  {
    name: "Deal 08",
    description: "2 Jumbo Pizzas, 1 Chicken Pasta, 1 Salad with Fries",
    items: [
      { menuItemId: "", name: "Jumbo Pizza", quantity: 2, size: "Jumbo", isPizza: true },
      { menuItemId: "", name: "Chicken Pasta", quantity: 1 },
      { menuItemId: "", name: "Mix Salad", quantity: 1 },
      { menuItemId: "", name: "French Fries", quantity: 1 }
    ],
    price: 2500,
    applicableCategories: ['Standard Pizza'],
    available: true
  }
];