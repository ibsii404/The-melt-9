import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = 'https://themelt9.com';

const staticRoutes = [
  '',
  '/menu',
  '/blog',
  '/about',
  '/cart',
  '/login',
  '/register',
  '/track-order'
];

const generateSitemap = async () => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticRoutes.forEach((route) => {
    const lastMod = new Date().toISOString().split('T')[0];
    sitemap += `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>\n`;
  });

  sitemap += '</urlset>';

  const sitemapPath = resolve('./public/sitemap.xml');
  writeFileSync(sitemapPath, sitemap);
  console.log('Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap().catch(console.error);
