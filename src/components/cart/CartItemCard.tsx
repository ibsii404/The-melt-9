import { CartItem } from '../../contexts/CartContext';
import { useCart } from '../../contexts/CartContext';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon
} from '@heroicons/react/24/outline';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, getItemTotal } = useCart();
  const isDealBundle = !!item.isDealBundle;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Item Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-melt-gold to-melt-red flex items-center justify-center">
              <span className="text-2xl">🍕</span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-melt-charcoal leading-tight break-words">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {item.selectedSize && <span className="mr-2">{item.selectedSize}</span>}
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <span>+ {item.selectedAddons.map(a => a.name).join(', ')}</span>
                )}
              </p>
              {isDealBundle && item.bundleItems && item.bundleItems.length > 0 && (
                <ul className="mt-2 text-xs text-gray-500 list-disc pl-4 space-y-1">
                  {item.bundleItems.map((bundleItem, index) => (
                    <li key={`${item.cartId}-bundle-${index}`}>{bundleItem}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => removeFromCart(item.cartId)}
              className="text-gray-400 hover:text-red-500 transition shrink-0"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Quantity and Price */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-2">
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                className="p-1 border rounded-full hover:bg-gray-100"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                className="p-1 border rounded-full hover:bg-gray-100"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="font-bold text-melt-red text-xl sm:text-xl leading-tight text-right whitespace-nowrap">
              Rs. {getItemTotal(item)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
