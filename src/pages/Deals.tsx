import { useState, useEffect } from 'react';
import { getDeals } from '../services/dealService';
import { Deal } from '../types/deal.types';
import DealsGrid from '../components/deals/DealsGrid';
import DealsSEO from '../components/seo/DealsSEO';
import { TagIcon } from '@heroicons/react/24/outline';

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const dealsData = await getDeals();
      setDeals(dealsData);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DealsSEO />
      <div className="min-h-screen bg-melt-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-melt-red to-melt-gold py-16">
        <div className="container-custom text-center text-white">
          <TagIcon className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Hot Deals & Combos
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Save big with our specially curated deals! Perfect for sharing with family and friends.
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container-custom py-12">
        <DealsGrid deals={deals} loading={loading} />
      </div>

      {/* Deal Terms */}
      <div className="bg-white border-t py-8">
        <div className="container-custom">
          <h2 className="text-lg font-semibold text-melt-charcoal mb-4">
            Deal Terms & Conditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-melt-red font-bold">•</span>
              <span>Deals include standard pizzas only (not applicable on Premium, Xtreme, Crown, or Kababish)</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-melt-red font-bold">•</span>
              <span>Cannot be combined with other offers or discounts</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-melt-red font-bold">•</span>
              <span>No substitutions on deal items</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-melt-red font-bold">•</span>
              <span>Valid for dine-in, takeaway, and delivery</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-melt-red font-bold">•</span>
              <span>Delivery charges may apply based on order value</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-melt-red font-bold">•</span>
              <span>Management reserves the right to modify or withdraw deals</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Deals;