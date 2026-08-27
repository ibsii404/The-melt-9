import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { CartAddress } from '../../contexts/CartContext';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddressFormProps {
  onAddressSelect: (address: CartAddress) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressSelect }) => {
  const { userData, addAddress } = useAuth();
  const { selectedAddress, setSelectedAddress } = useCart();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    area: '',
    city: 'Multan',
    instructions: '',
    isDefault: false
  });

  const sanitizeAddressText = (value: string, maxLength: number) =>
    value.replace(/[^a-zA-Z0-9\s-]/g, '').slice(0, maxLength);

  const handleSaveNewAddress = async () => {
    const safeStreet = sanitizeAddressText(newAddress.street, 80).trim();
    const safeArea = sanitizeAddressText(newAddress.area, 50).trim();
    const safeCity = sanitizeAddressText(newAddress.city, 30).trim();
    const safeInstructions = sanitizeAddressText(newAddress.instructions, 120).trim();

    if (!safeStreet || !safeArea || !safeCity) {
      return;
    }

    const success = await addAddress({
      ...newAddress,
      street: safeStreet,
      area: safeArea,
      city: safeCity,
      instructions: safeInstructions
    });
    if (success) {
      setShowNewAddressForm(false);
      // Reset form
      setNewAddress({
        label: 'Home',
        street: '',
        area: '',
        city: 'Multan',
        instructions: '',
        isDefault: false
      });
    }
  };

  const handleSelectAddress = (address: CartAddress) => {
    setSelectedAddress(address);
    onAddressSelect(address);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-melt-charcoal mb-4">
        Delivery Address
      </h2>

      {/* Saved Addresses */}
      {userData?.addresses && userData.addresses.length > 0 && (
        <div className="space-y-3 mb-6">
          {userData.addresses.map((address) => (
            <button
              key={address.id}
              onClick={() => handleSelectAddress(address)}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                selectedAddress?.id === address.id
                  ? 'border-melt-red bg-melt-red bg-opacity-10'
                  : 'border-gray-200 hover:border-melt-gold'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-melt-charcoal">
                  {address.label}
                </span>
                {address.isDefault && (
                  <span className="text-xs bg-melt-gold px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {address.street}, {address.area}
              </p>
              <p className="text-sm text-gray-600">{address.city}</p>
              {address.instructions && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  Note: {address.instructions}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Add New Address Button */}
      {!showNewAddressForm && (
        <button
          onClick={() => setShowNewAddressForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-melt-gold hover:text-melt-gold transition flex items-center justify-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Address</span>
        </button>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Label
            </label>
            <select
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: sanitizeAddressText(e.target.value, 80) })}
              placeholder="House/Shop No., Street Name"
              className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
              maxLength={80}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area/Locality
            </label>
            <input
              type="text"
              value={newAddress.area}
              onChange={(e) => setNewAddress({ ...newAddress, area: sanitizeAddressText(e.target.value, 50) })}
              placeholder="e.g., Gulgasht, Shah Rukn-e-Alam"
              className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: sanitizeAddressText(e.target.value, 30) })}
              placeholder="Multan"
              className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <textarea
              value={newAddress.instructions}
              onChange={(e) => setNewAddress({ ...newAddress, instructions: sanitizeAddressText(e.target.value, 120) })}
              placeholder="e.g., Near landmark, gate color, etc."
              className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
              rows={2}
              maxLength={120}
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newAddress.isDefault}
              onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
              className="rounded text-melt-gold"
            />
            <span className="text-sm text-gray-700">Set as default address</span>
          </label>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewAddressForm(false)}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewAddress}
              className="flex-1 btn-primary py-2"
            >
              Save Address
            </button>
          </div>
        </div>
      )}

      {(!userData?.addresses || userData.addresses.length === 0) && !showNewAddressForm && (
        <p className="text-center text-gray-500 py-4">
          No saved addresses. Please add a delivery address.
        </p>
      )}
    </div>
  );
};

export default AddressForm;
