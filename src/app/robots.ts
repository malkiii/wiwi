import type { MetadataRoute } from 'next';
import { env } from '~/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: new URL('/sitemap.xml', env.AUTH_URL).toString(),
    host: env.AUTH_URL,
  };
}
