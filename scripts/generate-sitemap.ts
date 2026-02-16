import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const BASE_URL = 'https://open-ev-data.github.io/open-ev-data-ui';
const GITHUB_API = 'https://api.github.com/repos/open-ev-data/open-ev-data-dataset/releases/latest';

interface Vehicle {
  unique_code: string;
}

interface Dataset {
  vehicles: Vehicle[];
}

async function generateSitemap() {
  try {
    console.log('📦 Fetching latest vehicle dataset...');

    // Fetch latest release info
    const releaseResponse = await fetch(GITHUB_API);
    if (!releaseResponse.ok) {
      throw new Error(`Failed to fetch release info: ${releaseResponse.statusText}`);
    }

    const release = await releaseResponse.json();
    const tag = release.tag_name;

    // Construct dataset URL
    const datasetUrl = `https://github.com/open-ev-data/open-ev-data-dataset/releases/download/${tag}/open-ev-data-${tag}.json`;

    console.log(`📥 Downloading dataset from tag: ${tag}`);
    const datasetResponse = await fetch(datasetUrl);
    if (!datasetResponse.ok) {
      throw new Error(`Failed to fetch dataset: ${datasetResponse.statusText}`);
    }

    const dataset: Dataset = await datasetResponse.json();
    console.log(`✅ Found ${dataset.vehicles.length} vehicles`);

    // Create sitemap
    const sitemap = new SitemapStream({ hostname: BASE_URL });
    const writeStream = createWriteStream(resolve('./dist/sitemap.xml'));

    sitemap.pipe(writeStream);

    // Add static pages
    sitemap.write({
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });

    sitemap.write({
      url: '/compare',
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });

    // Add all vehicle pages
    for (const vehicle of dataset.vehicles) {
      sitemap.write({
        url: `/vehicle/${vehicle.unique_code}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    }

    sitemap.end();

    await streamToPromise(sitemap);

    console.log(`✅ Sitemap generated successfully with ${dataset.vehicles.length + 2} URLs`);
    console.log(`📍 Location: dist/sitemap.xml`);
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
