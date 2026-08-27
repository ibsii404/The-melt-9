import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HoursManagement from '../../components/kitchen/HoursManagement';
import DeliveryZoneManagement from '../../components/kitchen/DeliveryZoneManagement';
import { ArrowLeftIcon, ClockIcon, MapIcon } from '@heroicons/react/24/outline';

const KitchenOperations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hours' | 'zones'>('hours');

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
              Restaurant Operations
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container-custom">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('hours')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'hours'
                  ? 'border-melt-red text-melt-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ClockIcon className="h-5 w-5" />
              <span>Hours of Operation</span>
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'zones'
                  ? 'border-melt-red text-melt-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapIcon className="h-5 w-5" />
              <span>Delivery Zones</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {activeTab === 'hours' ? (
          <HoursManagement />
        ) : (
          <DeliveryZoneManagement />
        )}
      </div>
    </div>
  );
};

export default KitchenOperations;