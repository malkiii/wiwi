import { Suspense } from 'react';
import { redirect, notFound } from 'next/navigation';
import { extractMeetingCode } from '~/lib/utils';
import { auth } from '~/server/auth';

import { LoadingAnimation } from '~/components/loading-animation';

type LayoutProps = React.PropsWithChildren<{
  params: { code: string };
}>;

export default async function Layout({ params, children }: LayoutProps) {
  extractMeetingCode(params.code) ?? notFound();

  const session = await auth();
  if (!session?.user) return redirect('/login');

  return (
    <div className="dark flex h-dvh items-center justify-center bg-primary-foreground p-2 text-foreground">
      <Suspense fallback={<LoadingAnimation key="loading" className="w-20" />}>{children}</Suspense>
    </div>
  );
}
