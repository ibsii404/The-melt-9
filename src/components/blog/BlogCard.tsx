import { useMemo, useState } from 'react';
import { BlogPost } from '../../types/blog.types';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548365328-9f547fb0953c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80'
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-PK', {
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

  const fallbackIndex = useMemo(
    () => post.slug.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % fallbackImages.length,
    [post.slug]
  );
  const [imageIndex, setImageIndex] = useState(
    post.featuredImage ? -1 : fallbackIndex
  );
  const [useLogoFallback, setUseLogoFallback] = useState(false);

  const cardImage = useLogoFallback
    ? '/melt-9-logo.png'
    : imageIndex === -1
      ? post.featuredImage
      : fallbackImages[imageIndex];

  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={cardImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => {
              if (imageIndex === -1) {
                setImageIndex(fallbackIndex);
                return;
              }
              if (imageIndex < fallbackImages.length - 1) {
                setImageIndex((prev) => prev + 1);
                return;
              }
              setUseLogoFallback(true);
            }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-white bg-opacity-90 text-xs px-2 py-1 rounded-full text-melt-charcoal"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-melt-charcoal mb-2 group-hover:text-melt-red transition line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-3 w-3" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-3 w-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3" />
              <span>{readingTime(post.content)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
