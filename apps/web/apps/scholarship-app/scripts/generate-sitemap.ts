/**
 * Generate XML sitemap for iCaptur SSO
 * Run with: pnpm tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const baseUrl = process.env.VITE_APP_URL || 'https://scholarship.icaptur.ai';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const urls: SitemapUrl[] = [
  {
    loc: '/signin',
    changefreq: 'monthly',
    priority: 1.0,
  },
  {
    loc: '/forgot-password',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: '/reset-password',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: '/create-password',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: '/account-activated',
    changefreq: 'monthly',
    priority: 0.5,
  },
];

const generateSitemap = (): string => {
  const currentDate = new Date().toISOString().split('T')[0];

  const urlEntries = urls
    .map((url) => {
      return `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : `<lastmod>${currentDate}</lastmod>`}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

const main = () => {
  const sitemap = generateSitemap();
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap generated at ${outputPath}`);
  console.log(`   Total URLs: ${urls.length}`);
};

main();

