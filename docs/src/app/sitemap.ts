import { MetadataRoute } from 'next'
import fs from 'fs';
import path from 'path';

// Assuming the site is hosted at this URL
const BASE_URL = 'https://weibo-trending-hot-history.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // Construct the absolute path to the api directory relative to the project root
  // Note: This path might need adjustment depending on the build/runtime environment
  const apiDirectory = path.join(process.cwd(), '..', 'api'); 
  let dateFiles: string[] = [];

  try {
    dateFiles = fs.readdirSync(apiDirectory)
      .filter(file => file.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(file));
  } catch (error) {
    console.error('Error reading API directory for sitemap:', error);
    // Return a minimal sitemap if directory reading fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }

  const hotsUrls = dateFiles.map((file) => {
    const date = file.replace('.json', '');
    return {
      url: `${BASE_URL}/hots/${date}`,
      lastModified: new Date(), // Ideally, use file modification time or a fixed date
      changeFrequency: 'daily' as 'daily',
      priority: 0.8,
    };
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...hotsUrls,
  ];
}