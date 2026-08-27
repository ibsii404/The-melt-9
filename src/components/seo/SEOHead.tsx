import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
}

const defaultSEO = {
  title: 'THE MELT 9 - Best Pizza & Steak House in Multan',
  description: 'Experience the perfect blend of sizzling steaks and irresistible pizzas at The Melt 9. Fresh ingredients, perfect recipes, and that melt-in-your-mouth goodness! Order online for delivery or pickup.',
  keywords: 'pizza multan, steak house multan, best pizza multan, food delivery multan, restaurant multan, melt 9, pizza delivery, steak restaurant',
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  url: 'https://themelt9.com',
};

const SEOHead: React.FC<SEOProps> = ({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = 'website',
  publishedTime,
  author,
  noindex = false,
}) => {
  const siteTitle = title.includes('THE MELT 9') ? title : `${title} | THE MELT 9`;
  useEffect(() => {
    const setMetaByName = (name: string, content: string) => {
      let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      el.setAttribute('data-seo-managed', 'true');
    };

    const setMetaByProperty = (property: string, content: string) => {
      let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      el.setAttribute('data-seo-managed', 'true');
    };

    const setLink = (rel: string, href: string, attrs: Record<string, string> = {}) => {
      const selector = attrs.sizes
        ? `link[rel="${rel}"][sizes="${attrs.sizes}"]`
        : `link[rel="${rel}"]`;
      let el = document.head.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
      el.setAttribute('data-seo-managed', 'true');
    };

    document.title = siteTitle;

    setMetaByName('description', description);
    setMetaByName('keywords', keywords);
    setMetaByName('viewport', 'width=device-width, initial-scale=1.0');
    setMetaByName('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMetaByName('googlebot', noindex ? 'noindex, nofollow' : 'index, follow');
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:url', url);
    setMetaByName('twitter:title', siteTitle);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', image);
    setMetaByName('geo.region', 'PK-PB');
    setMetaByName('geo.placename', 'Multan');
    setMetaByName('geo.position', '30.1575;71.5249');
    setMetaByName('ICBM', '30.1575, 71.5249');
    setMetaByName('theme-color', '#E7272D');
    setMetaByName('apple-mobile-web-app-capable', 'yes');
    setMetaByName('mobile-web-app-capable', 'yes');
    setMetaByName('apple-mobile-web-app-status-bar-style', 'black-translucent');
    setMetaByName('apple-mobile-web-app-title', 'THE MELT 9');

    setMetaByProperty('og:type', type);
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:title', siteTitle);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:image', image);
    setMetaByProperty('og:image:width', '1200');
    setMetaByProperty('og:image:height', '630');
    setMetaByProperty('og:site_name', 'THE MELT 9');
    setMetaByProperty('og:locale', 'en_PK');

    if (type === 'article' && publishedTime) {
      setMetaByProperty('article:published_time', publishedTime);
    }
    if (type === 'article' && author) {
      setMetaByProperty('article:author', author);
    }

    setLink('canonical', url);
    setLink('icon', '/favicon-32x32.png', { type: 'image/png', sizes: '32x32' });
    setLink('icon', '/favicon-16x16.png', { type: 'image/png', sizes: '16x16' });
    setLink('apple-touch-icon', '/apple-touch-icon.png');
    setLink('manifest', '/site.webmanifest');
  }, [siteTitle, description, keywords, image, url, type, publishedTime, author, noindex]);

  return null;
};

export default SEOHead;
