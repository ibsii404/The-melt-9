import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, OrderStatus, getUserOrders } from '../services/orderService';
import OrderStatusTracker from '../orders/OrderStatusTracker';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { toDateSafe } from '../utils/dateTime';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SUPPORT_PHONE = '+92 300 0000000';
const ACTIVE_ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery'];
const CANCELLED_VISIBILITY_MS = 24 * 60 * 60 * 1000;

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [accountOrders, setAccountOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'orders', orderId),
      (snapshot) => {
        if (snapshot.exists()) {
          const orderData = { id: snapshot.id, ...snapshot.data() } as Order;
          setOrder(orderData);
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error tracking order:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  useEffect(() => {
    const loadOrders = async () => {
      if (orderId || !user) return;
      setLoading(true);
      try {
        const orders = await getUserOrders(user.uid);
        setAccountOrders(orders);
      } catch (error) {
        console.error('Error loading account orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [orderId, user]);

  const visibleOrders = useMemo(() => {
    const now = Date.now();
    return accountOrders.filter((accountOrder) => {
      if (ACTIVE_ORDER_STATUSES.includes(accountOrder.status)) {
        return true;
      }

      if (accountOrder.status === 'cancelled') {
        const cancelledStatusTime = accountOrder.statusHistory
          ?.filter((entry) => entry.status === 'cancelled')
          .map((entry) => toDateSafe(entry.timestamp))
          .filter((d): d is Date => !!d)
          .sort((a, b) => b.getTime() - a.getTime())[0];

        const fallbackTime = toDateSafe(accountOrder.updatedAt) ?? toDateSafe(accountOrder.createdAt);
        const reference = cancelledStatusTime ?? fallbackTime;
        if (!reference) return false;
        return now - reference.getTime() <= CANCELLED_VISIBILITY_MS;
      }

      return false;
    });
  }, [accountOrders]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-melt-cream py-10 lg:py-14">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 lg:p-10">
            <h1 className="text-2xl lg:text-3xl font-bold text-melt-charcoal mb-3">Your Active Orders</h1>
            <p className="text-gray-600 mb-6 lg:mb-8">
              Showing active orders and cancelled orders from the last 24 hours.
            </p>
            {visibleOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No active orders found on this account.</p>
            ) : (
              <div className="space-y-3">
                {visibleOrders.slice(0, 10).map((accountOrder) => (
                  <button
                    key={accountOrder.id}
                    onClick={() => navigate(`/track-order/${accountOrder.id}`)}
                    className="w-full text-left border rounded-xl p-4 hover:border-melt-gold transition bg-melt-cream/40"
                  >
                    <p className="font-semibold text-melt-charcoal">{accountOrder.orderNumber}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                      <span className={accountOrder.status === 'cancelled' ? 'text-red-600 font-semibold' : ''}>
                        Status: {accountOrder.status}
                      </span>
                      <span>Rs. {accountOrder.total}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-melt-cream py-12">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-melt-charcoal mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">
            The order you are looking for does not exist or has been removed.
          </p>
          <button onClick={() => navigate('/track-order')} className="btn-primary px-6 py-3">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-melt-cream py-8 lg:py-12">
      <div className="container-custom max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-melt-red hover:text-melt-gold mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-t-2xl shadow-lg p-5 sm:p-6 lg:p-8 border-b">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-melt-charcoal">Order #{order.orderNumber}</h1>
              <p className="text-gray-500 mt-1">
                Placed on {(toDateSafe(order.createdAt) ?? new Date()).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-melt-red">Rs. {order.total}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
          <div className="lg:col-span-2">
            <OrderStatusTracker order={order} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-5 lg:p-6">
              <h3 className="font-semibold text-melt-charcoal mb-4">Order Items</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {order.items.map((item, index) => (
                  <div key={index} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium">{item.quantity}x {item.name}</span>
                      <span className="text-melt-red shrink-0">Rs. {item.itemTotal}</span>
                    </div>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Add-ons: {item.selectedAddons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>Rs. {order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-melt-red">Rs. {order.total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSupportModal(true)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Need Help? Contact Support
            </button>
          </div>
        </div>
      </div>

      {showSupportModal && (
        <div className="fixed inset-0 z-[60] bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold text-melt-charcoal">Need Help?</h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Close help dialog"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-gray-700 mb-2">Call The Melt 9 support at:</p>
              <p className="text-xl font-bold text-melt-red">{SUPPORT_PHONE}</p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => setShowSupportModal(false)}
                className="btn-primary w-full py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
