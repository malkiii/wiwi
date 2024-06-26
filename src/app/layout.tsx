import '~/styles/globals.css';
import type { Metadata } from 'next';
import { auth } from '~/server/auth';
import { Inter as FontSans } from 'next/font/google';
import { SessionProvider } from './session-provider';
import site from '~/constants/site';

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
  description: site.description,
  icons: [
    { rel: 'icon', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
  ],
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontSans.variable}>
        <SessionProvider user={session?.user}>{children}</SessionProvider>
      </body>
    </html>
  );
}
