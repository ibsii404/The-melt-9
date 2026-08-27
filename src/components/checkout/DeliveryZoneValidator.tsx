import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { validateDeliveryAddress, getDeliveryZones } from '../../services/operationalService';
import { DeliveryZone, DeliveryAddressValidation } from '../../types/operational.types';
import {
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';

interface DeliveryZoneValidatorProps {
  onValidationResult: (result: DeliveryAddressValidation) => void;
}

const DeliveryZoneValidator: React.FC<DeliveryZoneValidatorProps> = ({ onValidationResult }) => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [validation, setValidation] = useState<DeliveryAddressValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const { subtotal } = useCart();

  const nearbyMelt9Areas = [
    'Gulgasht Colony',
    'Bosan Road',
    'Gulgasht A Block',
    'Gulgasht B Block',
    'Shah Rukn-e-Alam',
    'Cantt',
    'Askari',
    'Model Town',
    'New Multan',
    'Nishtar Road',
    'Chungi No 6',
    'Chungi No 9'
  ];

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const deliveryZones = await getDeliveryZones();
      setZones(deliveryZones.filter((z) => z.isActive));
    } catch (error) {
      console.error('Error loading zones:', error);
    }
  };

  const handleAreaSelect = async (area: string) => {
    setSelectedArea(area);
    if (!area) {
      setValidation(null);
      onValidationResult({
        isValid: false,
        message: 'Please select your area to check delivery charges.',
        deliveryFee: 0
      });
      return;
    }
    await validateAddress(area);
  };

  const validateAddress = async (area: string) => {
    setLoading(true);
    try {
      const result = await validateDeliveryAddress(area, 'Multan');

      if (result.isValid && result.zone && result.zone.freeDeliveryThreshold) {
        if (subtotal >= result.zone.freeDeliveryThreshold) {
          result.deliveryFee = 0;
          result.message = `Free delivery! (Order above Rs. ${result.zone.freeDeliveryThreshold})`;
        }
      }

      setValidation(result);
      onValidationResult(result);
    } catch (error) {
      console.error('Error validating address:', error);
    } finally {
      setLoading(false);
    }
  };

  const allAreas = Array.from(new Set([...nearbyMelt9Areas, ...zones.flatMap((zone) => zone.areas)]));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-melt-charcoal mb-4 flex items-center">
        <MapPinIcon className="h-6 w-6 text-melt-red mr-2" />
        Check Delivery Availability
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select your area (around The Melt 9, Multan)
        </label>
        <select
          value={selectedArea}
          onChange={(e) => handleAreaSelect(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
        >
          <option value="">Choose your area</option>
          {allAreas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-melt-red mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Checking availability...</p>
        </div>
      )}

      {validation && !loading && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start">
            {validation.isValid ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-grow">
              <p className={`font-medium ${validation.isValid ? 'text-green-800' : 'text-red-800'}`}>
                {validation.message}
              </p>

              {validation.isValid && validation.zone && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded-md border border-melt-gold/40 bg-melt-cream p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Selected Area Charges</p>
                    <p className="text-sm font-semibold text-melt-charcoal mt-1">{selectedArea}</p>
                    <p className="text-base font-bold text-melt-red mt-1">
                      {validation.deliveryFee === 0 ? 'Delivery Fee: FREE' : `Delivery Fee: Rs. ${validation.deliveryFee}`}
                    </p>
                    {validation.zone.freeDeliveryThreshold && subtotal < validation.zone.freeDeliveryThreshold && (
                      <p className="text-xs text-gray-600 mt-1">
                        Add Rs. {validation.zone.freeDeliveryThreshold - subtotal} more for free delivery
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-semibold text-melt-red">
                      {validation.deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `Rs. ${validation.deliveryFee}`}
                    </span>
                  </div>

                  {validation.estimatedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Delivery:</span>
                      <span className="font-semibold">{validation.estimatedTime}</span>
                    </div>
                  )}

                  {validation.minimumOrder && validation.minimumOrder > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min. Order:</span>
                      <span className="font-semibold">Rs. {validation.minimumOrder}</span>
                    </div>
                  )}

                  {validation.zone.freeDeliveryThreshold && (
                    <div className="mt-2 p-2 bg-white rounded border border-green-200">
                      <div className="flex items-center text-xs text-gray-600">
                        <InformationCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                        Free delivery on orders above Rs. {validation.zone.freeDeliveryThreshold}
                      </div>
                      {subtotal < validation.zone.freeDeliveryThreshold && (
                        <div className="mt-1 text-xs">
                          Add Rs. {validation.zone.freeDeliveryThreshold - subtotal} more for free delivery
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold text-melt-charcoal mb-2 flex items-center">
          <TruckIcon className="h-4 w-4 mr-1" />
          Our Delivery Zones
        </h3>
        <div className="space-y-3">
          {zones.map((zone) => (
            <div key={zone.id} className="text-sm">
              <p className="font-medium text-melt-charcoal">{zone.name}</p>
              <p className="text-gray-500 text-xs mt-1">{zone.areas.join(' | ')}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Fee: Rs. {zone.deliveryFee}</span>
                <span>Time: {zone.estimatedTime}</span>
                {zone.freeDeliveryThreshold && <span>Free over Rs. {zone.freeDeliveryThreshold}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryZoneValidator;
