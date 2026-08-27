import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import HomeSEO from '../components/seo/HomeSEO';
import StructuredData from '../components/seo/StructuredData';
import FeaturedItems from '../components/home/FeaturedItems';
import DealsHighlight from '../components/home/DealsHighlight';
import RestaurantInfo from '../components/home/RestaurantInfo';
import { getLatestPosts } from '../services/blogService';
import { BlogPost } from '../types/blog.types';
import BlogCard from '../components/blog/BlogCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);

  useEffect(() => {
    loadLatestPosts();
  }, []);

  const loadLatestPosts = async () => {
    try {
      const posts = await getLatestPosts(3);
      setLatestPosts(posts);
    } catch (error) {
      console.error('Error loading latest posts:', error);
    } finally {
      setLoadingBlog(false);
    }
  };

  return (
    <>
      <HomeSEO />
      <StructuredData
        type="Restaurant"
        data={{
          telephone: '+92 300 1234567',
          priceRange: 'Rs. 250 - Rs. 2500',
          image: 'https://themelt9.com/og-image.jpg',
        }}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Items */}
      <FeaturedItems />

      {/* Deals Highlight */}
      <DealsHighlight />

      {/* Blog Section */}
      <section className="py-14 sm:py-20 bg-white animate-fade-up">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-melt-charcoal mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news, offers, and stories from our kitchen
            </p>
          </div>

          {/* Blog Grid */}
          {loadingBlog ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : latestPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center text-melt-red hover:text-melt-gold font-semibold group"
                >
                  Read All Posts
                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No blog posts yet. Check back soon for updates!
            </div>
          )}
        </div>
      </section>

      {/* Restaurant Info */}
      <RestaurantInfo />

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-melt-red to-melt-gold py-12 sm:py-16 animate-fade-up">
        <div className="container-custom text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Experience the Melt?
          </h2>
          <p className="text-base sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Order now and taste why we're Multan's favorite pizza and steak house!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/menu" 
              className="bg-white text-melt-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition transform hover:scale-105"
            >
              Order Online
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-melt-red transition transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;
