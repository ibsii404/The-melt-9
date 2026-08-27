import { Deal } from '../../types/deal.types';
import DealCard from './DealCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface DealsGridProps {
  deals: Deal[];
  loading?: boolean;
}

const DealsGrid: React.FC<DealsGridProps> = ({ deals, loading }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏷️</div>
        <h3 className="text-xl font-bold text-melt-charcoal mb-2">
          No Deals Available
        </h3>
        <p className="text-gray-500">
          Check back later for exciting new deals!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
};

export default DealsGrid;
