import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem, CartAddress } from '../contexts/CartContext';
import { toDateSafe } from '../utils/dateTime';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out-for-delivery' 
  | 'delivered' 
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: CartAddress;
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }>;
  paymentMethod: 'cod';
  paymentStatus: 'pending' | 'paid';
  specialInstructions?: string;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ORDERS_COLLECTION = 'orders';
const ACTIVE_ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery'];
const ORDER_NUMBER_COUNTER_KEY = 'melt9_order_counter';

const getUnitPrice = (item: CartItem): number => {
  if (item.selectedSize && item.sizes && item.sizes.length > 0) {
    return item.sizes.find((s) => s.name === item.selectedSize)?.price || 0;
  }
  if (item.basePrice) return item.basePrice;
  if (item.sizes && item.sizes.length > 0) return item.sizes[0].price;
  if (item.pieces && item.pieces.length > 0) return item.pieces[0].price;
  return 0;
};

// Generate order number
const generateOrderNumber = async (): Promise<string> => {
  let next = 1;
  try {
    const current = Number(localStorage.getItem(ORDER_NUMBER_COUNTER_KEY) || '0');
    next = current + 1;
    localStorage.setItem(ORDER_NUMBER_COUNTER_KEY, String(next));
  } catch (error) {
    next = Date.now() % 1000000;
  }
  return `MELT9-${next}`;
};

export const getUserActiveOrderCount = async (customerId: string): Promise<number> => {
  const q = query(collection(db, ORDERS_COLLECTION), where('customerId', '==', customerId));
  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map((d) => d.data() as Order);
  return orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length;
};

// Create new order
export const createOrder = async (
  customerId: string,
  customerInfo: { name: string; email: string; phone: string },
  items: CartItem[],
  subtotal: number,
  deliveryFee: number,
  total: number,
  deliveryType: 'delivery' | 'pickup',
  deliveryAddress?: CartAddress,
  specialInstructions?: string
): Promise<{ id: string; orderNumber: string }> => {
  try {
    const orderNumber = await generateOrderNumber();
    const serializedItems = items.map((item) => {
      const unitPrice = getUnitPrice(item);
      return {
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice,
        itemTotal: unitPrice * item.quantity,
        ...(item.selectedSize ? { selectedSize: item.selectedSize } : {}),
        ...(item.selectedAddons && item.selectedAddons.length > 0
          ? { selectedAddons: item.selectedAddons.map((addon) => ({ id: addon.id, name: addon.name, price: addon.price })) }
          : {}),
        ...(item.isDealBundle ? { isDealBundle: true } : {}),
        ...(item.bundleItems && item.bundleItems.length > 0 ? { bundleItems: item.bundleItems } : {})
      };
    });

    const orderData = {
      orderNumber,
      customerId,
      customerInfo,
      items: serializedItems,
      subtotal,
      deliveryFee,
      total,
      deliveryType,
      ...(deliveryAddress ? { deliveryAddress } : {}),
      status: 'pending' as OrderStatus,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed'
      }],
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      ...(specialInstructions ? { specialInstructions } : {}),
      ...(deliveryType === 'pickup'
        ? { estimatedPickupTime: new Date(Date.now() + 30 * 60000) }
        : {}),
      ...(deliveryType === 'delivery'
        ? { estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) }
        : {}),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    return { id: docRef.id, orderNumber };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order by ID
export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (customerId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), where('customerId', '==', customerId));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order)).sort((a, b) => {
      const aTime = toDateSafe((a as any).createdAt)?.getTime() ?? 0;
      const bTime = toDateSafe((b as any).createdAt)?.getTime() ?? 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: OrderStatus,
  note?: string
): Promise<void> => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }
    
    const currentStatusHistory = orderDoc.data().statusHistory || [];
    
    await updateDoc(orderRef, {
      status,
      statusHistory: [
        ...currentStatusHistory,
        {
          status,
          timestamp: new Date(),
          ...(note ? { note } : {}),
          updatedBy: 'system' // In real app, this would be kitchen staff ID
        }
      ],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Get pending orders (for kitchen)
export const getPendingOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('status', 'in', ['pending', 'confirmed', 'preparing']),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error getting pending orders:', error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
  try {
    await updateOrderStatus(orderId, 'cancelled', reason || 'Cancelled by customer');
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};
