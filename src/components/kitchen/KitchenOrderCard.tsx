import { useState, useEffect } from 'react';
import { Order, OrderStatus, updateOrderStatus } from '../../services/orderService';
import { toDateSafe } from '../../utils/dateTime';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  TruckIcon,
  HomeIcon,
  FireIcon,
  ShoppingBagIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface KitchenOrderCardProps {
  order: Order;
  onStatusUpdate: () => void;
}

const statusColors: Record<string, string> = {
  pending: 'border-yellow-500 bg-yellow-50',
  confirmed: 'border-blue-500 bg-blue-50',
  preparing: 'border-orange-500 bg-orange-50',
  ready: 'border-green-500 bg-green-50',
  'out-for-delivery': 'border-purple-500 bg-purple-50',
  delivered: 'border-gray-500 bg-gray-50',
  cancelled: 'border-red-500 bg-red-50'
};

const statusBadges: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, label: 'Confirmed' },
  preparing: { color: 'bg-orange-100 text-orange-800', icon: FireIcon, label: 'Preparing' },
  ready: { color: 'bg-green-100 text-green-800', icon: ShoppingBagIcon, label: 'Ready' },
  'out-for-delivery': { color: 'bg-purple-100 text-purple-800', icon: TruckIcon, label: 'Out for Delivery' },
  delivered: { color: 'bg-gray-100 text-gray-800', icon: HomeIcon, label: 'Delivered' }
};

const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ order, onStatusUpdate }) => {
  const [timer, setTimer] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Calculate time elapsed
  useEffect(() => {
    const updateTimer = () => {
      const created = toDateSafe(order.createdAt)?.getTime() ?? Date.now();
      const now = new Date().getTime();
      const elapsed = now - created;

      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimer(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimer(`${minutes}m ${seconds}s`);
      } else {
        setTimer(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success(`Order #${order.orderNumber} status updated to ${newStatus}`);
      onStatusUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getAvailableActions = () => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          { status: 'confirmed', label: 'Accept Order', color: 'bg-blue-500 hover:bg-blue-600' },
          { status: 'cancelled', label: 'Reject', color: 'bg-red-500 hover:bg-red-600' }
        );
        break;
      case 'confirmed':
        actions.push(
          { status: 'preparing', label: 'Start Preparing', color: 'bg-orange-500 hover:bg-orange-600' }
        );
        break;
      case 'preparing':
        actions.push(
          { status: 'ready', label: 'Mark as Ready', color: 'bg-green-500 hover:bg-green-600' }
        );
        break;
      case 'ready':
        if (order.deliveryType === 'delivery') {
          actions.push(
            { status: 'out-for-delivery', label: 'Out for Delivery', color: 'bg-purple-500 hover:bg-purple-600' }
          );
        } else {
          actions.push(
            { status: 'delivered', label: 'Picked Up', color: 'bg-gray-500 hover:bg-gray-600' }
          );
        }
        break;
      case 'out-for-delivery':
        actions.push(
          { status: 'delivered', label: 'Mark Delivered', color: 'bg-green-500 hover:bg-green-600' }
        );
        break;
    }
    
    return actions;
  };

  const CurrentStatusBadge = statusBadges[order.status] || statusBadges.pending;

  return (
    <div className={`bg-white rounded-lg shadow-lg border-l-4 ${statusColors[order.status]} mb-4 overflow-hidden transition-all hover:shadow-xl`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${CurrentStatusBadge.color}`}>
              <CurrentStatusBadge.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-melt-charcoal">
                Order #{order.orderNumber}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {order.customerInfo.name}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {timer}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CurrentStatusBadge.color}`}>
              {CurrentStatusBadge.label}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-melt-red"
            >
              {expanded ? '▼' : '▶'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Items */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.quantity}x {item.name}</span>
                    <span className="text-melt-red">Rs. {item.itemTotal}</span>
                  </div>
                  {item.selectedSize && (
                    <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize}</p>
                  )}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Add-ons: {item.selectedAddons.map(a => a.name).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Special Instructions</p>
                  <p className="text-sm text-yellow-700">{order.specialInstructions}</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Contact</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {order.customerInfo.phone}
                </p>
              </div>
            </div>

            {/* Delivery/Pickup Info */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                {order.deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup'}
              </h4>
              {order.deliveryType === 'delivery' && order.deliveryAddress ? (
                <div className="text-sm">
                  <p className="flex items-start">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      {order.deliveryAddress.street}, {order.deliveryAddress.area}
                      <br />
                      {order.deliveryAddress.city}
                      {order.deliveryAddress.instructions && (
                        <span className="block text-gray-500 text-xs mt-1">
                          Note: {order.deliveryAddress.instructions}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Customer will pick up</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span>Rs. {order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee:</span>
              <span>Rs. {order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total:</span>
              <span className="text-melt-red">Rs. {order.total}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {getAvailableActions().map((action) => (
              <button
                key={action.status}
                onClick={() => handleStatusUpdate(action.status as OrderStatus)}
                disabled={updating}
                className={`${action.color} text-white px-4 py-2 rounded-lg text-sm font-medium transition transform hover:scale-105 disabled:opacity-50`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenOrderCard;
