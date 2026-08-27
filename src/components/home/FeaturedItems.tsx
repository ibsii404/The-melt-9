import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../../types/menu.types';
import { getFeaturedItems } from '../../services/menuService';
import { StarIcon, FireIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../common/LoadingSpinner';

const FeaturedItems = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  const loadFeaturedItems = async () => {
    try {
      const featured = await getFeaturedItems();
      // If no featured items set, show some default popular items
      if (featured.length === 0) {
        // You can set some default items here or fetch popular ones
        setItems([]);
      } else {
        setItems(featured.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading featured items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback featured items based on your menu
  const fallbackItems = [
    {
      id: '1',
      name: 'Melt 9 Special',
      description: 'Chicken fajita chunks, onion, Capsicum, mushroom, black olive with special sauce',
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      basePrice: 899,
      sizes: [
        { name: 'Regular', price: 899 },
        { name: 'Large', price: 1399 }
      ]
    },
    {
      id: '2',
      name: 'Crown Pizza',
      description: 'Extra Toppings - Extra Loaded, our most premium pizza',
      category: 'Premium Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      basePrice: 999,
      sizes: [
        { name: 'Regular', price: 999 },
        { name: 'Large', price: 1599 },
        { name: 'Jumbo', price: 1899 }
      ]
    },
    {
      id: '3',
      name: 'Zinger Burger',
      description: 'Crispy chicken fillet with lettuce, mayo, and our special sauce',
      category: 'Burger',
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      basePrice: 400
    },
    {
      id: '4',
      name: 'Chicken Tikka Pizza',
      description: 'Chicken tikka chunks, onion, on a marinara sauce with mozzarella',
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      basePrice: 899,
      sizes: [
        { name: 'Regular', price: 899 },
        { name: 'Large', price: 1399 }
      ]
    }
  ];

  const displayItems = items.length > 0 ? items : fallbackItems;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="py-14 sm:py-20 bg-melt-cream">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 animate-fade-up">
          <FireIcon className="h-12 w-12 text-melt-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-melt-charcoal mb-4">
            Customer Favorites
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most loved dishes, crafted to perfection with the finest ingredients
          </p>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, index) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-melt-gold text-melt-charcoal px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <StarIcon className="h-3 w-3 mr-1" />
                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-melt-charcoal mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Price */}
                <div className="flex justify-between items-center">
                  <div>
                    {item.sizes ? (
                      <p className="text-melt-red font-bold">
                        From Rs. {Math.min(...item.sizes.map(s => s.price))}
                      </p>
                    ) : (
                      <p className="text-melt-red font-bold">Rs. {item.basePrice}</p>
                    )}
                  </div>
                  <Link 
                    to="/menu" 
                    className="text-melt-red hover:text-melt-gold font-semibold text-sm"
                  >
                    Order Now →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/menu" 
            className="inline-flex items-center bg-melt-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition transform hover:scale-105"
          >
            View Full Menu
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
