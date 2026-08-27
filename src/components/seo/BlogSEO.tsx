import SEOHead from './SEOHead';

interface BlogSEOProps {
  title: string;
  description: string;
  image?: string;
  publishedTime: string;
  author: string;
  slug: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  title,
  description,
  image,
  publishedTime,
  author,
  slug,
}) => {
  return (
    <SEOHead
      title={`${title} - THE MELT 9 Blog`}
      description={description}
      keywords="restaurant blog, food stories, pizza news, steak recipes, melt 9 updates"
      image={image}
      url={`https://themelt9.com/blog/${slug}`}
      type="article"
      publishedTime={publishedTime}
      author={author}
    />
  );
};

export default BlogSEO;