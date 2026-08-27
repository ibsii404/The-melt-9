import { useState, useEffect } from 'react';
import { Deal } from '../../types/deal.types';
import { useCart } from '../../contexts/CartContext';
import { 
  ShoppingCartIcon, 
  TagIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { calculateDealSavings } from '../../services/dealService';
import { getMenuItems } from '../../services/menuService';
import { MenuItem } from '../../types/menu.types';
import toast from 'react-hot-toast';

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const [savings, setSavings] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [selectedPizzaIds, setSelectedPizzaIds] = useState<string[]>([]);
  const [selectedDrinkId, setSelectedDrinkId] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    loadSavings();
  }, [deal]);

  const loadSavings = async () => {
    const calculatedSavings = await calculateDealSavings(deal);
    setSavings(calculatedSavings);
  };

  const isPizzaItem = (item: { isPizza?: boolean; name: string }) =>
    !!item.isPizza || /pizza/i.test(item.name);
  const isDrinkItem = (item: { name: string }) =>
    /drink|beverage|soda/i.test(item.name);

  const requiresPizzaSelection = deal.items.some(isPizzaItem);
  const requiresDrinkSelection = deal.items.some(item => /drink|beverage|soda/i.test(item.name));

  const pizzaSlots = deal.items.reduce<Array<{ size?: string }>>((acc, item) => {
    if (!isPizzaItem(item)) return acc;
    for (let i = 0; i < item.quantity; i += 1) {
      acc.push({ size: item.size });
    }
    return acc;
  }, []);

  const pizzaOptions = menuItems.filter(item =>
    item.category === 'Pizza' && item.available !== false
  );

  const drinkOptions = menuItems.filter(item =>
    item.category === 'Beverage' && item.available !== false && /drink|cola|pepsi|7up|sprite|dew/i.test(item.name)
  );

  const ensureOptionsLoaded = async () => {
    if (menuItems.length > 0 || (!requiresPizzaSelection && !requiresDrinkSelection)) {
      return;
    }
    try {
      setSelectionLoading(true);
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading options for deal:', error);
      toast.error('Failed to load deal options');
    } finally {
      setSelectionLoading(false);
    }
  };

  const addDealBundleToCart = () => {
    let pizzaIndex = 0;
    const bundleItems: string[] = [];

    deal.items.forEach(item => {
      if (isPizzaItem(item) && selectedPizzaIds.length > 0) {
        for (let i = 0; i < item.quantity; i += 1) {
          const chosenPizzaId = selectedPizzaIds[pizzaIndex];
          const pizza = pizzaOptions.find(option => option.id === chosenPizzaId);
          bundleItems.push(`1x ${pizza?.name || item.name}${item.size ? ` (${item.size})` : ''}`);
          pizzaIndex += 1;
        }
        return;
      }

      if (isDrinkItem(item) && selectedDrinkId) {
        const drink = drinkOptions.find(option => option.id === selectedDrinkId);
        bundleItems.push(`${item.quantity}x ${drink?.name || item.name}${item.size ? ` (${item.size})` : ''}`);
        return;
      }

      bundleItems.push(`${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''}`);
    });

    addToCart({
      id: `deal-bundle-${deal.id}`,
      name: deal.name,
      description: deal.description,
      category: 'Platter',
      imageUrl: deal.imageUrl || '',
      available: true,
      basePrice: deal.price,
      isDealBundle: true,
      bundleItems
    } as any, undefined, [], `Fixed deal items`);
  };

  const handleAddToCart = async () => {
    if (requiresPizzaSelection || requiresDrinkSelection) {
      await ensureOptionsLoaded();
      if (requiresPizzaSelection) {
        setSelectedPizzaIds(Array(pizzaSlots.length).fill(''));
      }
      if (requiresDrinkSelection) {
        setSelectedDrinkId('');
      }
      setShowCustomize(true);
      return;
    }

    setLoading(true);
    
    try {
      addDealBundleToCart();
    } catch (error) {
      console.error('Error adding deal to cart:', error);
      toast.error('Failed to add deal to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCustomization = () => {
    if (requiresPizzaSelection && selectedPizzaIds.some((id) => !id)) {
      toast.error('Please select flavor for all pizzas');
      return;
    }
    if (requiresPizzaSelection && selectedPizzaIds.length > 1) {
      const uniqueCount = new Set(selectedPizzaIds).size;
      if (uniqueCount !== selectedPizzaIds.length) {
        toast.error('Please select different flavors for each pizza');
        return;
      }
    }
    if (requiresPizzaSelection && pizzaOptions.length === 0) {
      toast.error('No pizza flavors available');
      return;
    }
    if (requiresDrinkSelection && !selectedDrinkId) {
      toast.error('Please select a drink flavor');
      return;
    }

    setLoading(true);
    try {
      addDealBundleToCart();
      setShowCustomize(false);
    } catch (error) {
      console.error('Error adding customized deal:', error);
      toast.error('Failed to add deal to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Deal Header */}
      <div className="relative bg-gradient-to-r from-melt-red to-melt-gold p-4 sm:p-5">
        <div className="absolute top-2 right-2">
          <span className="bg-white text-melt-red text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {deal.name}
          </span>
        </div>
        <h3 className="text-2xl sm:text-xl leading-tight font-bold text-white mb-2 pr-20">{deal.description}</h3>
        {savings > 0 && (
          <div className="flex items-center text-white text-sm">
            <TagIcon className="h-4 w-4 mr-1" />
            <span>Save Rs. {savings}</span>
          </div>
        )}
      </div>

      {/* Deal Items */}
      <div className="p-4 sm:p-5">
        <div className="space-y-2 mb-4">
          {deal.items.map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">
                {item.quantity}x {item.name}
                {item.size && <span className="text-gray-500 ml-1">({item.size})</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Price and Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">Deal Price</p>
            <p className="text-4xl sm:text-2xl font-bold text-melt-red leading-tight">Rs. {deal.price}</p>
            {savings > 0 && (
              <p className="text-xs text-green-600">
                Save Rs. {savings} ({(savings / (deal.price + savings) * 100).toFixed(0)}% off)
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-melt-red rounded-full hover:bg-gray-100"
              title="View Details"
            >
              <InformationCircleIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleAddToCart}
              disabled={loading || !deal.available}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition ${
                deal.available
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>{loading ? 'Adding...' : 'Add Deal'}</span>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 p-3 bg-melt-cream rounded-lg text-sm">
            <p className="font-semibold text-melt-charcoal mb-2">Deal Details:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• All items are prepared fresh</li>
              <li>• Cannot be combined with other offers</li>
              <li>• No substitutions on deal items</li>
              {deal.applicableCategories && (
                <li>• Includes standard pizzas only</li>
              )}
            </ul>
          </div>
        )}

        {/* Unavailable Badge */}
        {!deal.available && (
          <div className="mt-3 text-center text-sm text-red-500 font-medium">
            Currently unavailable
          </div>
        )}
      </div>
    </div>

      {showCustomize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-melt-charcoal">Customize {deal.name}</h3>
              <button onClick={() => setShowCustomize(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {selectionLoading && (
                <p className="text-sm text-gray-500">Loading options...</p>
              )}

              {requiresPizzaSelection && !selectionLoading && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pizza Flavor Selection</label>
                  <div className="space-y-2">
                    {pizzaSlots.map((slot, index) => (
                      <select
                        key={`pizza-slot-${index}`}
                        value={selectedPizzaIds[index] || ''}
                        onChange={(e) => {
                          const next = [...selectedPizzaIds];
                          next[index] = e.target.value;
                          setSelectedPizzaIds(next);
                        }}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="">
                          Select pizza {index + 1}{slot.size ? ` (${slot.size})` : ''}
                        </option>
                        {pizzaOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
              )}

              {requiresDrinkSelection && !selectionLoading && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drink Flavor</label>
                  <select
                    value={selectedDrinkId}
                    onChange={(e) => setSelectedDrinkId(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="">Select drink</option>
                    {drinkOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleConfirmCustomization}
                disabled={loading || selectionLoading}
                className="w-full btn-primary py-2"
              >
                {loading ? 'Adding...' : `Add Deal - Rs. ${deal.price}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DealCard;
