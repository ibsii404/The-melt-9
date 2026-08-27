import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-melt-cream py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-melt-charcoal mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
          If you believe this is a mistake, please contact the restaurant.
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn-primary inline-block">
            Go Home
          </Link>
          <Link to="/menu" className="btn-secondary inline-block">
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;