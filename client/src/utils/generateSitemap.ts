import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';

async function generate() {
  try {
    const pages = await globby([
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      '!src/app/**/error.tsx',
      '!src/app/**/loading.tsx',
      '!src/app/**/_*.tsx',
    ]);

    const currentDate = new Date().toISOString().split('T')[0];

  // Base URLs that should always be in the sitemap
  const staticUrls = [
    {
      url: 'https://satxbounce.com',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://satxbounce.com/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://satxbounce.com/products',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://satxbounce.com/contact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://satxbounce.com/blogs',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://satxbounce.com/faq',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
  ];

  // TODO: Add dynamic product and blog URLs by fetching from your API
  // Example:
  // const products = await fetch('https://satxbounce.com/api/products').then(res => res.json());
  // const productUrls = products.map(product => ({
  //   url: `https://satxbounce.com/products/${product.slug}`,
  //   lastmod: product.updatedAt.split('T')[0],
  //   changefreq: 'weekly',
  //   priority: 0.8,
  // }));

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls
        .map(
          ({ url, lastmod, changefreq, priority }) => `
        <url>
          <loc>${url}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
      `
        )
        .join('')}
    </urlset>
  `;

  const formatted = await prettier.format(sitemap, {
    parser: 'html',
  });

  writeFileSync('public/sitemap.xml', formatted);
  console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generate();
