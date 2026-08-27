import { useState, useEffect } from 'react';
import { getRestaurantStatus, RestaurantStatus } from '../../services/operationalService';
import { ClockIcon } from '@heroicons/react/24/outline';

interface HoursBannerProps {
  className?: string;
}

const HoursBanner: React.FC<HoursBannerProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<RestaurantStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
    // Check every minute
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const currentStatus = await getRestaurantStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('Error checking restaurant status:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || !status) {
    return null;
  }

  return (
    <div className={`bg-melt-charcoal text-white py-2 ${className}`}>
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center md:justify-between text-sm">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-melt-gold" />
            <span className={status.isOpen ? 'text-green-400' : 'text-red-400'}>
              {status.isOpen ? '🟢 Open Now' : '🔴 Closed'}
            </span>
            <span>|</span>
            <span>{status.message}</span>
          </div>
          
          {!status.isOpen && status.nextOpenTime && (
            <div className="flex items-center space-x-2 mt-1 md:mt-0">
              <span>Opens at</span>
              <span className="font-bold text-melt-gold">
                {formatTime(status.nextOpenTime)}
              </span>
            </div>
          )}

          {status.hoursToday && (
            <div className="hidden md:flex items-center space-x-2">
              <span>Today:</span>
              <span className="font-medium">
                {status.hoursToday.openTime} - {status.hoursToday.closeTime}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoursBanner;