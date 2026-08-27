import { useState } from 'react';
import { MenuItem, SizePrice, AddOn } from '../../types/menu.types';
import { ShoppingCartIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import AddToCartModal from './AddToCartModal';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addToCart } = useCart();

  const getDisplayPrice = () => {
    if (item.sizes && item.sizes.length > 0) {
      const smallest = item.sizes[0];
      return `Rs. ${smallest.price}`;
    }
    if (item.basePrice) {
      return `Rs. ${item.basePrice}`;
    }
    if (item.pieces && item.pieces.length > 0) {
      return `Rs. ${item.pieces[0].price}`;
    }
    return 'Price on selection';
  };

  const getPriceRange = () => {
    if (item.sizes && item.sizes.length > 0) {
      const prices = item.sizes.map(s => s.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return `Rs. ${min} - ${max}`;
    }
    return null;
  };

  const handleQuickAdd = () => {
    if (item.sizes || item.addons) {
      setShowModal(true);
    } else {
      addToCart(item);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div 
          className="relative h-48 overflow-hidden cursor-pointer group"
          onClick={() => item.imageUrl && setSelectedImage(item.imageUrl)}
        >
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-melt-gold to-melt-red flex items-center justify-center">
              <span className="text-6xl">🍕</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {item.hasDiscount && (
            <div className="absolute top-2 left-2 bg-melt-red text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              {item.discountNote || 'SALE'}
            </div>
          )}
          
          {/* Premium/Xtreme Badges */}
          {item.isPremium && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              👑 PREMIUM
            </div>
          )}
          {item.isXtreme && (
            <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              ⚡ XTREME
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-melt-charcoal">{item.name}</h3>
            {!item.available && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          {/* Price Display */}
          <div className="mb-3">
            {item.sizes ? (
              <div className="text-melt-red font-bold">
                {getPriceRange()}
                {item.hasDiscount && item.sizes[0].discountPrice && (
                  <span className="ml-2 text-sm text-green-600">
                    (Discount available)
                  </span>
                )}
              </div>
            ) : (
              <div className="text-melt-red font-bold text-lg">{getDisplayPrice()}</div>
            )}
          </div>

          {/* Size Chips (Preview) */}
          {item.sizes && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.sizes.slice(0, 3).map((size) => (
                <span 
                  key={size.name}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                >
                  {size.name}
                </span>
              ))}
              {item.sizes.length > 3 && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  +{item.sizes.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            disabled={!item.available}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg transition-all transform hover:scale-105 ${
              item.available
                ? 'bg-melt-gold text-melt-charcoal hover:bg-opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>{item.available ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt={item.name}
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {showModal && (
        <AddToCartModal 
          item={item} 
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MenuCard;
