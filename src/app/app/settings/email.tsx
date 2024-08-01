'use client';

import { Input } from '~/components/ui/input';
import { useSession } from '~/components/session-provider';

export default function Section() {
  const user = useSession().user!;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-6 inline-block text-lg font-bold leading-normal">Email Address</h3>
      <Input value={user.email} className="mb-4 block" readOnly />
      <p className="my-0 pl-0.5 text-sm font-semibold">Managed by Google</p>
    </div>
  );
}
