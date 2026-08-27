import { useCart } from '../../contexts/CartContext';
import { TruckIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const DeliveryTypeSelector = () => {
  const { deliveryType, setDeliveryType, setDeliveryFeeForZone } = useCart();

  const handleSelectDelivery = () => {
    setDeliveryType('delivery');
  };

  const handleSelectPickup = () => {
    setDeliveryType('pickup');
    setDeliveryFeeForZone(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl font-bold text-melt-charcoal mb-4">Delivery Method</h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={handleSelectDelivery}
          className={`p-3 sm:p-4 border-2 rounded-lg text-center transition ${
            deliveryType === 'delivery'
              ? 'border-melt-red bg-melt-red bg-opacity-10'
              : 'border-gray-200 hover:border-melt-gold'
          }`}
        >
          <TruckIcon
            className={`h-8 w-8 mx-auto mb-2 ${
              deliveryType === 'delivery' ? 'text-melt-red' : 'text-gray-400'
            }`}
          />
          <span
            className={`font-semibold ${
              deliveryType === 'delivery' ? 'text-melt-red' : 'text-gray-600'
            }`}
          >
            Delivery
          </span>
          <p className="text-xs text-gray-500 mt-1">Food delivered to your door</p>
        </button>

        <button
          onClick={handleSelectPickup}
          className={`p-3 sm:p-4 border-2 rounded-lg text-center transition ${
            deliveryType === 'pickup'
              ? 'border-melt-red bg-melt-red bg-opacity-10'
              : 'border-gray-200 hover:border-melt-gold'
          }`}
        >
          <BuildingStorefrontIcon
            className={`h-8 w-8 mx-auto mb-2 ${
              deliveryType === 'pickup' ? 'text-melt-red' : 'text-gray-400'
            }`}
          />
          <span
            className={`font-semibold ${
              deliveryType === 'pickup' ? 'text-melt-red' : 'text-gray-600'
            }`}
          >
            Pickup
          </span>
          <p className="text-xs text-gray-500 mt-1">Pick up from restaurant</p>
        </button>
      </div>

      {deliveryType === 'delivery' && (
        <p className="text-sm text-gray-500 mt-4">
          Delivery fee is based on selected area and shown in the next step.
        </p>
      )}

      {deliveryType === 'pickup' && (
        <p className="text-sm text-gray-500 mt-4">Pickup available from 11:00 AM to 11:00 PM</p>
      )}
    </div>
  );
};

export default DeliveryTypeSelector;
