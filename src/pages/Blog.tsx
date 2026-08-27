import { useState, useEffect } from 'react';
import { getPublishedPosts } from '../services/blogService';
import { BlogPost } from '../types/blog.types';
import BlogGrid from '../components/blog/BlogGrid';
import { NewspaperIcon } from '@heroicons/react/24/outline';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const publishedPosts = await getPublishedPosts();
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-melt-cream">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=2070&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-melt-red/85 to-melt-gold/85" />
        <div className="container-custom relative z-10 text-center text-white">
          <NewspaperIcon className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            The Melt 9 Blog
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            News, updates, and stories from our kitchen to your table
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container-custom py-12">
        <BlogGrid posts={posts} loading={loading} />
      </div>

      {/* Newsletter Section */}
      <div className="bg-white border-t py-12">
        <div className="container-custom max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-melt-charcoal mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest news, deals, and updates from The Melt 9!
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
            />
            <button type="submit" className="btn-primary px-6 py-3">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Blog;
