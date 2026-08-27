import { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { MenuItem } from '../types/menu.types';
import toast from 'react-hot-toast';

export interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
  selectedSize?: string;
  selectedAddons?: Array<{ id: string; name: string; price: number; }>;
  specialInstructions?: string;
  isDealBundle?: boolean;
  bundleItems?: string[];
  itemTotal: number;
}

export interface CartAddress {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  instructions?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  selectedAddress: CartAddress | null;
  
  addToCart: (item: MenuItem, size?: string, addons?: Array<{ id: string; name: string; price: number; }>, instructions?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  updateItemInstructions: (cartId: string, instructions: string) => void;
  clearCart: () => void;
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  setSelectedAddress: (address: CartAddress | null) => void;
  setDeliveryFeeForZone: (fee: number | null) => void;
  getItemTotal: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const DELIVERY_FEE = 99; // Fixed delivery fee
const FREE_DELIVERY_THRESHOLD = 1000; // Free delivery above Rs. 1000

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedAddress, setSelectedAddress] = useState<CartAddress | null>(null);
  const [zoneDeliveryFee, setZoneDeliveryFee] = useState<number | null>(null);
  const hasHydratedCart = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('melt9-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage');
      }
    }
    hasHydratedCart.current = true;
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!hasHydratedCart.current) {
      return;
    }
    localStorage.setItem('melt9-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const getItemTotal = (item: CartItem): number => {
    let total = item.basePrice || 0;
    
    // Add size price if applicable
    if (item.sizes && item.sizes.length > 0) {
      if (item.selectedSize) {
        const sizePrice = item.sizes.find(s => s.name === item.selectedSize)?.price || 0;
        total = sizePrice;
      } else {
        // Fallback for older cart entries that missed selected size.
        total = item.sizes[0].price;
      }
    } else if (item.pieces && item.pieces.length > 0 && !item.basePrice) {
      total = item.pieces[0].price;
    }
    
    // Add addons
    if (item.selectedAddons) {
      total += item.selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    }
    
    return total * item.quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  
  const defaultDeliveryFee = subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const deliveryFee = deliveryType === 'delivery'
    ? (zoneDeliveryFee ?? defaultDeliveryFee)
    : 0;
  
  const total = subtotal + deliveryFee;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (
    item: MenuItem, 
    size?: string, 
    addons?: Array<{ id: string; name: string; price: number; }>,
    instructions?: string
  ) => {
    const cartItem: CartItem = {
      ...item,
      cartId: `${item.id}-${size || ''}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quantity: 1,
      selectedSize: size,
      selectedAddons: addons,
      specialInstructions: instructions,
      itemTotal: 0 // Will be calculated
    };
    
    setCartItems(prev => [...prev, cartItem]);
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  const updateItemInstructions = (cartId: string, instructions: string) => {
    setCartItems(prev => 
      prev.map(item => 
        item.cartId === cartId ? { ...item, specialInstructions: instructions } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedAddress(null);
    setZoneDeliveryFee(null);
    toast.success('Cart cleared');
  };

  const value = {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    deliveryType,
    selectedAddress,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemInstructions,
    clearCart,
    setDeliveryType,
    setSelectedAddress,
    setDeliveryFeeForZone: setZoneDeliveryFee,
    getItemTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
