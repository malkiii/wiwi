import '~/styles/globals.css';
import type { Metadata } from 'next';
// import { getServerAuthSession } from '~/server/auth';
import { Inter as FontSans } from 'next/font/google';
// import { SessionProvider } from '~/components/session-provider';
import { Toaster } from '~/components/ui/toaster';
import site from '~/constants/site';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  preload: true,
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: [
    { rel: 'icon', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // const session = await getServerAuthSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontSans.variable}>
        {/* <SessionProvider user={session?.user}> */}
        {children}
        {/* </SessionProvider> */}
        <Toaster />
      </body>
    </html>
  );
}
