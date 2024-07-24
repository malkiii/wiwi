import { Suspense } from 'react';
import { redirect, notFound } from 'next/navigation';
import { extractMeetingCode } from '~/lib/utils';
import { auth } from '~/server/auth';

import { LoadingAnimation } from '~/components/loading-animation';
import { Toaster } from '~/components/ui/sonner';

type LayoutProps = React.PropsWithChildren<{
  params: { code: string };
}>;

export default async function Layout({ params, children }: LayoutProps) {
  extractMeetingCode(params.code) ?? notFound();

  const session = await auth();
  if (!session?.user) return redirect('/login');

  return (
    <div className="dark flex h-dvh items-center justify-center bg-primary-foreground py-[--room-gap] text-foreground [--room-gap:0.7rem]">
      <Suspense fallback={<LoadingAnimation key="loading" className="w-20" />}>{children}</Suspense>
      <Toaster position="top-left" />
    </div>
  );
}
