import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Restaurant' | 'Product' | 'BlogPosting' | 'BreadcrumbList';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'Restaurant':
        return {
          '@context': 'https://schema.org',
          '@type': 'Restaurant',
          name: 'THE MELT 9',
          image: data.image || 'https://themelt9.com/og-image.jpg',
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.streetAddress || 'Main Boulevard',
            addressLocality: data.addressLocality || 'Gulgasht Colony',
            addressRegion: data.addressRegion || 'Multan',
            postalCode: data.postalCode || '60000',
            addressCountry: 'PK',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.latitude || '30.1575',
            longitude: data.longitude || '71.5249',
          },
          url: 'https://themelt9.com',
          telephone: data.telephone || '+92 300 1234567',
          priceRange: data.priceRange || '$$',
          servesCuisine: ['Pizza', 'Steak', 'Burger', 'Pakistani'],
          openingHoursSpecification: data.hours || [
            { dayOfWeek: 'Monday', opens: '11:00', closes: '23:00' },
            { dayOfWeek: 'Tuesday', opens: '11:00', closes: '23:00' },
            { dayOfWeek: 'Wednesday', opens: '11:00', closes: '23:00' },
            { dayOfWeek: 'Thursday', opens: '11:00', closes: '23:00' },
            { dayOfWeek: 'Friday', opens: '14:00', closes: '00:00' },
            { dayOfWeek: 'Saturday', opens: '12:00', closes: '00:00' },
            { dayOfWeek: 'Sunday', opens: '12:00', closes: '23:00' },
          ],
          acceptsReservations: data.acceptsReservations || 'True',
          hasMenu: 'https://themelt9.com/menu',
        };

      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: data.image,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'PKR',
            availability: data.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: data.url,
          },
        };

      case 'BlogPosting':
        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          description: data.excerpt,
          image: data.image,
          datePublished: data.publishedAt,
          dateModified: data.updatedAt,
          author: {
            '@type': 'Person',
            name: data.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'THE MELT 9',
            logo: {
              '@type': 'ImageObject',
              url: 'https://themelt9.com/logo.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url,
          },
        };

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : '';

  useEffect(() => {
    if (!structuredDataJson) return;

    const scriptId = `ld-json-${type.toLowerCase()}`;
    let script = document.head.querySelector(`script[data-structured-data="${scriptId}"]`) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', scriptId);
      document.head.appendChild(script);
    }

    script.textContent = structuredDataJson;
  }, [type, structuredDataJson]);

  return null;
};

export default StructuredData;
