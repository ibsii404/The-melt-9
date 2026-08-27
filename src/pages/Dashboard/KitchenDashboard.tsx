import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Order, OrderStatus } from '../../services/orderService';
import KitchenOrderCard from '../../components/kitchen/KitchenOrderCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ClockIcon,
  FireIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  CakeIcon,
  NewspaperIcon,
  TagIcon,
  ArrowPathIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

type FilterType = 'all' | 'pending' | 'preparing' | 'ready' | 'delivered';

const KitchenDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('pending');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    total: 0
  });

  // Sound notification for new orders
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3'); // You'll need to add this file
    audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
  };

  // Real-time orders listener
  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      where('status', 'in', ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery']),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders: Order[] = [];
      let newPendingCount = 0;
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = { id: change.doc.id, ...change.doc.data() } as Order;
          newOrders.push(order);
          
          // Play sound for new pending orders
          if (order.status === 'pending') {
            newPendingCount++;
          }
        }
      });

      // Play notification sound for new orders
      if (newPendingCount > 0) {
        playNotificationSound();
        toast.success(`${newPendingCount} new order${newPendingCount > 1 ? 's' : ''} received!`, {
          icon: '🔔',
          duration: 5000
        });
      }

      // Update all orders
      const allOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(allOrders);
      
      // Update stats
      const pending = allOrders.filter(o => o.status === 'pending').length;
      const preparing = allOrders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length;
      const ready = allOrders.filter(o => ['ready', 'out-for-delivery'].includes(o.status)).length;
      
      setStats({
        pending,
        preparing,
        ready,
        total: allOrders.length
      });
      
      setLoading(false);
    }, (error) => {
      console.error('Error listening to orders:', error);
      toast.error('Failed to connect to real-time updates');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter orders when filter changes or orders update
  useEffect(() => {
    let filtered = orders;
    
    switch (activeFilter) {
      case 'pending':
        filtered = orders.filter(o => o.status === 'pending');
        break;
      case 'preparing':
        filtered = orders.filter(o => ['confirmed', 'preparing'].includes(o.status));
        break;
      case 'ready':
        filtered = orders.filter(o => o.status === 'ready');
        break;
      case 'delivered':
        filtered = orders.filter(o => ['out-for-delivery', 'delivered'].includes(o.status));
        break;
      default:
        filtered = orders;
    }
    
    setFilteredOrders(filtered);
  }, [activeFilter, orders]);

  const getFilterButtonClass = (filter: FilterType) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2";
    return activeFilter === filter
      ? `${baseClass} bg-melt-red text-white`
      : `${baseClass} bg-white text-gray-600 hover:bg-gray-100`;
  };

  const getFilterIcon = (filter: FilterType) => {
    switch (filter) {
      case 'all': return <ArrowPathIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'preparing': return <FireIcon className="h-4 w-4" />;
      case 'ready': return <ShoppingBagIcon className="h-4 w-4" />;
      case 'delivered': return <CheckCircleIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-melt-charcoal flex items-center">
                <FireIcon className="h-8 w-8 text-melt-red mr-2" />
                Kitchen Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {userData?.displayName || 'Kitchen Staff'}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/kitchen/menu')}
                className="btn-secondary flex items-center space-x-2"
              >
                <CakeIcon className="h-5 w-5" />
                <span>Menu</span>
              </button>
              
              <button
                onClick={() => navigate('/kitchen/deals')}
                className="btn-secondary flex items-center space-x-2"
              >
                <TagIcon className="h-5 w-5" />
                <span>Deals</span>
              </button>

              <button
                onClick={() => navigate('/kitchen/operations')}
                className="btn-secondary flex items-center space-x-2"
              >
                <ClockIcon className="h-5 w-5" />
                <span>Operations</span>
              </button>

              <button
                onClick={() => navigate('/kitchen/blog')}
                className="btn-primary flex items-center space-x-2"
              >
                <NewspaperIcon className="h-5 w-5" />
                <span>Blog</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.preparing}</p>
              <p className="text-xs text-gray-600">Preparing</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
              <p className="text-xs text-gray-600">Ready</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container-custom py-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'preparing', 'ready', 'delivered'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={getFilterButtonClass(filter)}
            >
              {getFilterIcon(filter)}
              <span className="capitalize">{filter}</span>
              {filter === 'pending' && stats.pending > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="container-custom pb-8">
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <KitchenOrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={() => {
                  // Refresh handled by real-time listener
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-xl font-bold text-melt-charcoal mb-2">
              No orders in this category
            </h3>
            <p className="text-gray-500">
              {activeFilter === 'pending' 
                ? "Great! You're all caught up. New orders will appear here."
                : `No ${activeFilter} orders at the moment.`}
            </p>
          </div>
        )}
      </div>

      {/* Kitchen Quick Actions */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-melt-gold text-melt-charcoal p-3 rounded-full shadow-lg hover:shadow-xl transition"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default KitchenDashboard;
