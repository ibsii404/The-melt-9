import { useState } from 'react';
import { MenuItem, SizePrice, AddOn } from '../../types/menu.types';
import { useCart } from '../../contexts/CartContext';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface AddToCartModalProps {
  item: MenuItem;
  onClose: () => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ item, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<SizePrice | undefined>(
    item.sizes?.[0]
  );
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  const calculateTotal = () => {
    let total = 0;
    
    // Base price
    if (selectedSize) {
      total += selectedSize.price;
    } else if (item.basePrice) {
      total += item.basePrice;
    } else if (item.pieces) {
      total += item.pieces[0].price;
    }
    
    // Addons
    selectedAddons.forEach(addon => {
      total += addon.price;
    });
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(item, selectedSize?.name as string | undefined, selectedAddons);
    }
    onClose();
  };

  const toggleAddon = (addon: AddOn) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-melt-charcoal">{item.name}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Description */}
          <p className="text-gray-600 text-sm">{item.description}</p>

          {/* Size Selection */}
          {item.sizes && (
            <div>
              <h3 className="font-semibold mb-2">Select Size</h3>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 border rounded-lg text-center transition ${
                      selectedSize?.name === size.name
                        ? 'border-melt-red bg-melt-red bg-opacity-10'
                        : 'border-gray-200 hover:border-melt-gold'
                    }`}
                  >
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-melt-red">
                      Rs. {size.price}
                      {size.discountPrice && (
                        <span className="ml-1 text-xs text-green-600 line-through">
                          Rs. {size.discountPrice}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Add-ons (Optional)</h3>
              <div className="space-y-2">
                {item.addons.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedAddons.some(a => a.id === addon.id)}
                        onChange={() => toggleAddon(addon)}
                        className="h-4 w-4 text-melt-red rounded"
                      />
                      <span>{addon.name}</span>
                    </div>
                    <span className="text-melt-red">+ Rs. {addon.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-melt-red">Rs. {calculateTotal()}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary py-3 text-lg"
          >
            Add to Cart • Rs. {calculateTotal()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
