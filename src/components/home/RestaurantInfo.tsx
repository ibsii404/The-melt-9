import { 
  ClockIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const RestaurantInfo = () => {
  const hours = [
    { day: 'Monday - Thursday', hours: '11:00 AM - 11:00 PM' },
    { day: 'Friday', hours: '2:00 PM - 12:00 AM' },
    { day: 'Saturday - Sunday', hours: '12:00 PM - 12:00 AM' },
  ];

  const deliveryZones = [
    'Gulgasht Colony (Free over Rs. 1000)',
    'Shah Rukn-e-Alam Colony',
    'Multan Cantt',
    'New Multan',
    'Bosan Road',
    'Vehari Road (up to 5km)'
  ];

  const features = [
    'Free delivery above Rs. 1000',
    '30-45 min delivery time',
    'Cash on Delivery only',
    'Fresh ingredients daily',
    'Family-friendly atmosphere',
    'Takeaway available'
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Contact & Hours */}
          <div className="animate-fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-melt-charcoal mb-6 sm:mb-8">
              Visit Us Today
            </h2>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <MapPinIcon className="h-6 w-6 text-melt-red flex-shrink-0" />
                <div>
                  <p className="font-semibold text-melt-charcoal">Location</p>
                  <p className="text-gray-600">
                    Main Boulevard, Gulgasht Colony<br />
                    Multan, Punjab 60000
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <PhoneIcon className="h-6 w-6 text-melt-red flex-shrink-0" />
                <div>
                  <p className="font-semibold text-melt-charcoal">Phone</p>
                  <p className="text-gray-600">+92 300 1234567</p>
                  <p className="text-gray-600">+92 61 1234567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="h-6 w-6 text-melt-red flex-shrink-0" />
                <div>
                  <p className="font-semibold text-melt-charcoal">Email</p>
                  <p className="text-gray-600">info@themelt9.com</p>
                  <p className="text-gray-600">orders@themelt9.com</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-melt-cream rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ClockIcon className="h-6 w-6 text-melt-red" />
                <h3 className="text-xl font-bold text-melt-charcoal">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {hours.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="font-semibold text-melt-charcoal">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Delivery Zones & Features */}
          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-melt-charcoal mb-6 sm:mb-8">
              Delivery Information
            </h2>

            {/* Delivery Zones */}
            <div className="bg-melt-cream rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <TruckIcon className="h-6 w-6 text-melt-red" />
                <h3 className="text-xl font-bold text-melt-charcoal">Delivery Zones</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deliveryZones.map((zone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{zone}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                *Delivery within 5km radius. Contact us for areas outside these zones.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-melt-cream rounded-lg p-3 text-center">
                  <p className="text-sm text-melt-charcoal font-medium">{feature}</p>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500">📍 Map will be embedded here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantInfo;
