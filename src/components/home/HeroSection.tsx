import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  return (
    <section className="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[640px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-melt-charcoal/90 to-melt-charcoal/70" />
        </div>
      </div>

      <div className="container-custom relative z-10 text-white py-10 sm:py-0">
        <div className="grid lg:grid-cols-12 items-center">
          <div className="max-w-3xl sm:max-w-4xl lg:col-span-8 xl:col-span-8 lg:max-w-5xl xl:max-w-6xl lg:pl-6 xl:pl-10">
          <div className="mb-6 animate-fade-up">
            <span className="inline-block bg-melt-gold text-melt-charcoal text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-4">
              Welcome to
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-2 leading-none">
              THE MELT 9
            </h1>
            <p className="text-2xl sm:text-3xl text-melt-gold font-semibold">Pizza & Steak House</p>
          </div>

          <p className="text-lg sm:text-2xl mb-8 text-gray-200 animate-fade-up lg:max-w-5xl" style={{ animationDelay: '120ms' }}>
            "Where Cheese Melts Perfectly"
            <span className="block text-base sm:text-lg text-gray-300 mt-2">
              Experience the perfect blend of sizzling steaks and irresistible pizzas
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <Link
              to="/menu"
              className="group bg-melt-gold text-melt-charcoal px-6 sm:px-8 py-4 rounded-lg font-bold text-xl sm:text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              View Full Menu
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div
            className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 sm:mt-12 max-w-md sm:max-w-lg animate-fade-up"
            style={{ animationDelay: '360ms' }}
          >
            <div className="text-center min-w-0">
              <div className="text-2xl sm:text-3xl font-bold text-melt-gold leading-none">50+</div>
              <div className="text-[10px] sm:text-sm text-gray-300 mt-1">Menu Items</div>
            </div>
            <div className="text-center min-w-0">
              <div className="text-2xl sm:text-3xl font-bold text-melt-gold leading-none">30min</div>
              <div className="text-[10px] sm:text-sm text-gray-300 mt-1">Fast Delivery</div>
            </div>
            <div className="text-center min-w-0">
              <div className="text-2xl sm:text-3xl font-bold text-melt-gold leading-none">1000+</div>
              <div className="text-[10px] sm:text-sm text-gray-300 mt-1">Happy Customers</div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#FBF7ED"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
