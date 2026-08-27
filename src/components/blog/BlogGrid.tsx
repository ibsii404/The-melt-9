import { BlogPost } from '../../types/blog.types';
import BlogCard from './BlogCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface BlogGridProps {
  posts: BlogPost[];
  loading?: boolean;
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts, loading }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-melt-charcoal mb-2">
          No Blog Posts Yet
        </h3>
        <p className="text-gray-500">
          Check back soon for updates and news from The Melt 9!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogGrid;