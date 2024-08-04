import type { MetadataRoute } from 'next';
import { env } from '~/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { pathname: '/', priority: 1 },
    { pathname: '/home', priority: 0.8 },
    { pathname: '/register', priority: 0.8 },
    { pathname: '/login', priority: 0.8 },
    { pathname: '/terms', priority: 0.64 },
    { pathname: '/privacy', priority: 0.64 },
  ];

  return routes.map(route => ({
    url: new URL(route.pathname, env.AUTH_URL).href,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route.priority,
  }));
}
