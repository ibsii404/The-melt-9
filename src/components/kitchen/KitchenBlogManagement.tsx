import { useNavigate } from 'react-router-dom';
import BlogManagement from '../../components/kitchen/BlogManagement';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const KitchenBlogManagement = () => {
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
              Blog Management
            </h1>
          </div>
        </div>
      </div>

      {/* Blog Management Component */}
      <BlogManagement />
    </div>
  );
};

export default KitchenBlogManagement;