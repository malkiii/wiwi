import '~/styles/globals.css';
import type { Metadata } from 'next';
import { auth } from '~/server/auth';
import { Inter as FontSans } from 'next/font/google';
import { SessionProvider } from '~/components/session-provider';
import { SoundsProvider } from '~/components/sounds-provider';
import Analytics from './analytics';

import site from '~/constants/site';
import { env } from '~/env';

const fontSans = FontSans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  authors: [{ name: site.author.name, url: site.author.url }],
  description: site.description,
  icons: [
    { rel: 'icon', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '192x192', url: '/icons/icon-192x192.png' },
  ],
  openGraph: {
    title: site.name,
    description: 'Full Stack Web Developer.',
    images: new URL('/og', env.AUTH_URL),
    url: env.AUTH_URL,
    siteName: site.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontSans.variable}>
        <SessionProvider user={session?.user}>
          <SoundsProvider>{children}</SoundsProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
