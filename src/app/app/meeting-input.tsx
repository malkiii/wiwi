'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { extractMeetingCode } from '~/lib/utils';
import { useSession } from '~/components/session-provider';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { UserAvatar } from '~/components/user-avatar';
import { ShareMeeting } from '~/components/share-meeting';
import { VideoIcon, WarningIcon, ShareIcon } from '~/components/icons';

export function MeetingInput() {
  const router = useRouter();
  const { user } = useSession();

  const [isNavigating, setIsNavigating] = useState(false);

  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();

  const joinMeeting = useCallback(() => {
    const code = extractMeetingCode(value);

    if (!code) {
      const isLink = value.startsWith(window.location.origin);
      return setError(`Invalid meeting ${isLink ? 'link' : 'code'}!`);
    }

    setIsNavigating(true);

    router.push(`/${code}`);
  }, [value]);

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Input
          type="text"
          id="meeting-code"
          className="flex-1"
          placeholder="Enter a code or link"
          onKeyDown={e => e.key.toLowerCase() === 'enter' && joinMeeting()}
          onChange={e => {
            setError(undefined);
            setValue(e.target.value);
          }}
        />
        <Button
          variant="secondary"
          className="px-4"
          disabled={!value || isNavigating}
          onClick={joinMeeting}
        >
          Join
        </Button>
      </div>
      {error && (
        <p role="alert" className="flex items-center gap-1 text-sm text-destructive">
          <WarningIcon className="size-4" /> {error}
        </p>
      )}
      <Button onClick={() => setIsNavigating(true)} asChild>
        <Link
          href={`/${user?.roomCode}`}
          className={isNavigating ? 'pointer-events-none opacity-50' : ''}
        >
          <VideoIcon className="mr-2 size-5" /> New meeting
        </Link>
      </Button>
      <ShareMeeting code={user?.roomCode}>
        <Button variant="outline" disabled={isNavigating}>
          <ShareIcon className="mr-2 size-5" /> Share your room link
        </Button>
      </ShareMeeting>
    </div>
  );
}

export function MeetingInputLabel() {
  const { user } = useSession();

  if (!user) return null;

  return (
    <label htmlFor="meeting-code" className="mx-auto block w-fit">
      <UserAvatar
        user={user}
        size={240}
        className="mx-auto size-[180px] text-2xl max-md:size-[120px]"
      />
    </label>
  );
}
