import { Order, OrderStatus } from '../services/orderService';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  TruckIcon, 
  HomeIcon,
  FireIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { toDateSafe } from '../utils/dateTime';

interface OrderStatusTrackerProps {
  order: Order;
}

const statusSteps: { status: OrderStatus; label: string; icon: any; color: string }[] = [
  { status: 'pending', label: 'Order Received', icon: ClockIcon, color: 'text-yellow-500' },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircleIcon, color: 'text-blue-500' },
  { status: 'preparing', label: 'Preparing', icon: FireIcon, color: 'text-orange-500' },
  { status: 'ready', label: 'Ready', icon: ShoppingBagIcon, color: 'text-green-500' },
  { status: 'out-for-delivery', label: 'Out for Delivery', icon: TruckIcon, color: 'text-purple-500' },
  { status: 'delivered', label: 'Delivered', icon: HomeIcon, color: 'text-melt-gold' }
];

const getCurrentStepIndex = (status: OrderStatus): number => {
  return statusSteps.findIndex(step => step.status === status);
};

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ order }) => {
  const currentStepIndex = getCurrentStepIndex(order.status);
  const estimatedDelivery = toDateSafe(order.estimatedDeliveryTime);
  const estimatedPickup = toDateSafe(order.estimatedPickupTime);

  // Filter steps based on delivery type
  const visibleSteps = order.deliveryType === 'pickup' 
    ? statusSteps.filter(step => step.status !== 'out-for-delivery')
    : statusSteps;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-melt-charcoal mb-6">Order Status</h3>
      
      {/* Status Timeline */}
      <div className="relative">
        {visibleSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.status} className="flex items-start mb-8 last:mb-0">
              {/* Icon */}
              <div className={`
                relative flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 z-10
                ${isCompleted ? step.color : 'bg-gray-200 text-gray-400'}
                ${isCurrent ? 'ring-4 ring-melt-gold ring-opacity-30' : ''}
              `}>
                {isCompleted ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5" />
                )}
              </div>
              
              {/* Content */}
              <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className={`
                    font-semibold
                    ${isCompleted ? step.color : 'text-gray-400'}
                  `}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-xs bg-melt-gold text-melt-charcoal px-2 py-1 rounded-full animate-pulse">
                      Current
                    </span>
                  )}
                </div>
                
                {/* Show time for current/completed steps */}
                {isCompleted && (
                  <p className="text-sm text-gray-500 mt-1">
                    {(() => {
                      const historyItem = order.statusHistory?.find((h) => h.status === step.status);
                      const timestamp = toDateSafe(historyItem?.timestamp);
                      return timestamp ? timestamp.toLocaleTimeString() : 'Processing...';
                    })()}
                  </p>
                )}
              </div>
              
              {/* Connecting Line */}
              {index < visibleSteps.length - 1 && (
                <div className={`
                  absolute left-5 top-10 w-0.5 h-12 -ml-0.5
                  ${index < currentStepIndex ? 'bg-melt-gold' : 'bg-gray-200'}
                `} style={{ transform: 'translateX(-50%)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Time */}
      <div className="mt-6 p-4 bg-melt-cream rounded-lg">
        <p className="text-sm text-gray-600">
          {order.deliveryType === 'delivery' ? 'Estimated Delivery' : 'Ready for Pickup'}
        </p>
        <p className="text-xl font-bold text-melt-red">
          {estimatedDelivery
            ? estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : estimatedPickup
            ? estimatedPickup.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Calculating...'}
        </p>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
