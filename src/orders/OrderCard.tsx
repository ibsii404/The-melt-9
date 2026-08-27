import { Order } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  TruckIcon, 
  BuildingStorefrontIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: Order;
  onReorder?: () => void;
  showActions?: boolean;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  'out-for-delivery': 'bg-purple-100 text-purple-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onReorder, showActions = true }) => {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTrackOrder = () => {
    navigate(`/order-tracking/${order.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      {/* Order Header */}
      <div className="flex flex-wrap justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-melt-charcoal">
            Order #{order.orderNumber}
          </h3>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
            {order.status.replace('-', ' ').toUpperCase()}
          </span>
          <span className="text-sm bg-melt-cream px-3 py-1 rounded-full flex items-center">
            {order.deliveryType === 'delivery' ? (
              <TruckIcon className="h-4 w-4 mr-1 text-melt-red" />
            ) : (
              <BuildingStorefrontIcon className="h-4 w-4 mr-1 text-melt-red" />
            )}
            {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
          </span>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="border-t border-b py-4 my-4">
        <div className="space-y-2">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.name}
                {item.selectedSize && <span className="text-gray-400 ml-1">({item.selectedSize})</span>}
              </span>
              <span className="font-medium">Rs. {item.itemTotal}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-sm text-gray-500">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Order Footer */}
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-xl font-bold text-melt-red">Rs. {order.total}</p>
        </div>
        
        {showActions && (
          <div className="flex space-x-3">
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                onClick={handleTrackOrder}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Track Order
              </button>
            )}
            {onReorder && (
              <button
                onClick={onReorder}
                className="btn-primary px-4 py-2 text-sm flex items-center"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Reorder
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
