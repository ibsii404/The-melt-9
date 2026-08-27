import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deal } from '../../types/deal.types';
import { getDeals } from '../../services/dealService';
import { TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';

const DEALS_MENU_LINK = '/menu?category=Deals';

const DealsHighlight = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const activeDeals = await getDeals();
      setDeals(activeDeals.slice(0, 3));
    } catch (error) {
      console.error('Error loading deals:', error);
    }
  };

  const fallbackDeals = [
    {
      id: '1',
      name: 'Deal 01',
      description: '1 Small Pizza, 1 Pc. Crispy Chicken with Fries',
      price: 550,
      items: [],
    },
    {
      id: '2',
      name: 'Deal 02',
      description: '1 Small Pizza, 1 Zinger Burger with A Drink',
      price: 700,
      items: [],
    },
    {
      id: '3',
      name: 'Deal 03',
      description: '1 Regular Pizza, 1 Zinger Burger, 1 Pc. Crispy Chicken',
      price: 1000,
      items: [],
    },
  ];

  const displayDeals = deals.length > 0 ? deals : fallbackDeals;

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-melt-red to-melt-gold">
      <div className="container-custom">
        <div className="text-center text-white mb-10 sm:mb-12 animate-fade-up">
          <FireIcon className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hot Deals & Combos</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Save big with our specially curated deals. Perfect for sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {displayDeals.map((deal, index) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <TagIcon className="h-8 w-8 text-melt-gold" />
                <span className="bg-melt-red text-white px-3 py-1 rounded-full text-sm font-bold">{deal.name}</span>
              </div>

              <h3 className="text-lg font-bold text-melt-charcoal mb-3">{deal.description}</h3>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Just</p>
                  <p className="text-2xl font-bold text-melt-red">Rs. {deal.price}</p>
                </div>
                <Link
                  to={DEALS_MENU_LINK}
                  className="bg-melt-gold text-melt-charcoal px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  Grab Deal
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to={DEALS_MENU_LINK}
            className="inline-flex items-center bg-white text-melt-red px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition transform hover:scale-105"
          >
            View All Deals
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealsHighlight;
