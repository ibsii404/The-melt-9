import { useEffect, useState } from 'react';
import { getDeliveryZones, DeliveryZone } from '../../services/operationalService';
import toast from 'react-hot-toast';

const DeliveryZoneManagement = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setLoading(true);
      const data = await getDeliveryZones();
      setZones(data);
    } catch (error) {
      console.error('Error loading delivery zones:', error);
      toast.error('Failed to load delivery zones');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading delivery zones...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-melt-charcoal mb-4">Delivery Zones</h2>
      {zones.length === 0 ? (
        <p className="text-gray-500">No delivery zones configured yet.</p>
      ) : (
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-melt-charcoal">{zone.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    zone.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {zone.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Areas: {zone.areas.join(', ')}</p>
              <p className="text-sm text-gray-600 mt-1">
                Fee: Rs. {zone.deliveryFee} | Min Order: Rs. {zone.minimumOrder} | ETA: {zone.estimatedTime}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryZoneManagement;
