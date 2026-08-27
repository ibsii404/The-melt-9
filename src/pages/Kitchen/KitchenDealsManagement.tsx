import { useNavigate } from 'react-router-dom';
import DealManagement from '../../components/kitchen/DealManagement';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const KitchenDealsManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/kitchen')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-melt-charcoal">
              Deal Management
            </h1>
          </div>
        </div>
      </div>

      {/* Deal Management Component */}
      <DealManagement />
    </div>
  );
};

export default KitchenDealsManagement;