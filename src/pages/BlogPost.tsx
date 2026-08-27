import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostBySlug, getLatestPosts } from '../services/blogService';
import { BlogPost as BlogPostType } from '../types/blog.types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  CalendarIcon, 
  UserIcon, 
  ClockIcon,
  ArrowLeftIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import BlogCard from '../components/blog/BlogCard';
import toast from 'react-hot-toast';
import BlogSEO from '../components/seo/BlogSEO';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await getPostBySlug(slug!);
      
      if (!postData) {
        navigate('/blog', { replace: true });
        toast.error('Blog post not found');
        return;
      }
      
      setPost(postData);
      
      // Load related posts (excluding current)
      const latest = await getLatestPosts(4);
      setRelatedPosts(latest.filter(p => p.id !== postData.id).slice(0, 3));
    } catch (error) {
      console.error('Error loading blog post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-PK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const readingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return null;
  }
  return (
    <>
      <BlogSEO
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        publishedTime={post.publishedAt instanceof Date ? post.publishedAt.toISOString() : new Date(post.publishedAt).toISOString()}
        author={post.author}
        slug={post.slug}
      />
      <div className="min-h-screen bg-melt-cream">
      {/* Back Button */}
      <div className="container-custom py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-melt-red hover:text-melt-gold transition"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Blog
        </button>
      </div>

      {/* Hero Image */}
      {post.featuredImage && (
        <div className="w-full h-[400px] overflow-hidden">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="container-custom max-w-4xl py-12">
        <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-melt-charcoal mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 border-b pb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{readingTime(post.content)}</span>
                </div>
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center text-melt-red hover:text-melt-gold"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Excerpt */}
          <div className="bg-melt-cream p-6 rounded-lg mb-8 italic text-gray-700">
            {post.excerpt}
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-melt-charcoal mb-6">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}

        {/* Comments Section Placeholder */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-melt-charcoal mb-4">
            Comments
          </h3>
          <p className="text-gray-500 text-center py-8">
            Comments feature coming soon!
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogPost;
