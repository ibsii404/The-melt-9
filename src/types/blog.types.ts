export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  imagePath?: string;
  author: string;
  authorId?: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  tags?: string[];
  views?: number;
}

export interface BlogPostFormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  imagePath?: string;
  author: string;
  status: 'draft' | 'published';
  tags?: string[];
}

// Sample blog posts for initial data
export const sampleBlogPosts: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt'>[] = [
  {
    title: "Introducing Our New Crown Pizza",
    slug: "introducing-crown-pizza",
    content: `We're excited to announce the arrival of our newest creation - the Crown Pizza! 🍕

    The Crown Pizza is our most loaded pizza yet, featuring extra toppings and extra cheese on every slice. Perfect for those who believe more is more when it comes to pizza toppings!

    **What makes it special?**
    - Extra loaded with premium toppings
    - Double cheese layer
    - Special crown-shaped crust
    - Available in Regular, Large, and Jumbo sizes

    Come try it today and experience pizza royalty! 👑`,
    excerpt: "Experience pizza royalty with our most loaded pizza yet - extra toppings, double cheese, and a special crown-shaped crust!",
    featuredImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    author: "The Melt 9 Kitchen",
    status: "published",
    tags: ["new arrival", "pizza", "special"]
  },
  {
    title: "Summer Special Deals Are Here!",
    slug: "summer-special-deals",
    content: `Beat the heat with our amazing summer special deals! ☀️

    This summer, we're bringing you exclusive combo offers that'll make your taste buds dance. From refreshing drinks to sizzling steaks, we've got something for everyone.

    **Hot Summer Deals:**
    - Any Large Pizza + 2 Drinks = Rs. 500 off
    - Family Feast: 2 Jumbo Pizzas + Pasta + Salad = Rs. 3000 only
    - Buy 1 Get 1 Free on all beverages

    Hurry in! These deals won't last long.`,
    excerpt: "Cool down this summer with our exclusive deals - special discounts on pizzas, drinks, and family combos!",
    featuredImage: "https://images.unsplash.com/photo-1548365328-9f547fb0953c?auto=format&fit=crop&w=1200&q=80",
    author: "The Melt 9 Team",
    status: "published",
    tags: ["summer", "deals", "specials"]
  },
  {
    title: "Behind the Scenes: How We Make Our Perfect Pizza",
    slug: "behind-the-scenes-pizza-making",
    content: `Ever wondered what goes into making The Melt 9's perfect pizza? Let's take you behind the scenes! 🍕

    **The Dough**
    Our dough is made fresh daily, using a special recipe that's been perfected over years. We let it rise for 24 hours to achieve that perfect texture.

    **The Sauce**
    Our signature tomato sauce is made from scratch using imported Italian tomatoes and a secret blend of herbs and spices.

    **The Cheese**
    We use 100% mozzarella cheese, freshly grated every morning. That's what gives you that perfect melt in every bite!

    **The Baking**
    Our pizzas are baked in a stone-fired oven at 500°F, giving you that perfect crispy crust with a soft, chewy center.

    Come watch our chefs in action during your next visit!`,
    excerpt: "Take a peek behind the curtain and see how we create the perfect pizza - from fresh dough to that amazing cheese pull!",
    featuredImage: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    author: "Chef Ahmad",
    status: "published",
    tags: ["behind the scenes", "pizza making", "kitchen"]
  },
  {
    title: "New Menu Items Coming This Fall",
    slug: "new-menu-items-fall",
    content: `Get ready for an exciting new menu launching this fall! 🍂

    We've been working hard in the kitchen to bring you some amazing new additions:

    **New Pizzas:**
    - Spicy Sriracha Chicken
    - Truffle Mushroom
    - BBQ Steakhouse

    **New Appetizers:**
    - Loaded Potato Skins
    - Spicy Wings Platter
    - Cheesy Bread Sticks

    Stay tuned for the official launch date!`,
    excerpt: "Exciting new additions coming to our menu - new pizzas, appetizers, and more! Get ready for a taste adventure.",
    featuredImage: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80",
    author: "The Melt 9 Kitchen",
    status: "draft",
    tags: ["new menu", "coming soon", "announcement"]
  }
];
