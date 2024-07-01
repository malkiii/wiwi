'use client';

import { Input } from '~/components/ui/input';
import { VideoIcon, AddIcon, TimeIcon, WarringIcon } from '~/components/icons';
import { Button, type ButtonProps } from '~/components/ui/button';
import { ShareMeeting } from '~/components/share-meeting';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { addNewMeeting } from './action';

export function MeetingInput() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();

  const joinMeeting = useCallback(() => {
    const code = value.match(/([\w\.-]+\/)?(\d{3}(-?)\d{3}\3\d{3}\s*$)/i)?.[2];

    if (!code) {
      const isLink = value.startsWith(window.location.origin);
      return setError(`Invalid meeting ${isLink ? 'link' : 'code'}!`);
    }

    setIsNavigating(true);

    const resolvedCode = code.replace(/(\d{3})(\d{3})(\d{3})/i, '$1-$2-$3');

    router.push(`/${resolvedCode}`);
  }, [value]);

  return (
    <div className="grid gap-2">
      <Input
        type="text"
        placeholder="Enter a code or link"
        onKeyDown={e => e.key === 'Enter' && joinMeeting()}
        onChange={e => {
          setError(undefined);
          setValue(e.target.value);
        }}
      />
      {error && (
        <p role="alert" className="flex items-center gap-1 text-sm text-destructive">
          <WarringIcon className="size-4" /> {error}
        </p>
      )}
      <div className="flex gap-2">
        <NewMeetingButton disabled={isNavigating} className="flex-1" />
        <Button variant="secondary" disabled={!value || isNavigating} onClick={joinMeeting}>
          Join
        </Button>
      </div>
    </div>
  );
}

function NewMeetingButton(props: ButtonProps) {
  const router = useRouter();

  const [code, setCode] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const startNewMeeting = useCallback(async () => {
    setIsLoading(true);
    const code = await addNewMeeting();

    router.push(`/${code}`);
  }, []);

  const createFutureMeeting = useCallback(async () => {
    setIsLoading(true);
    setCode(await addNewMeeting());
    setIsLoading(false);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button {...props} loading={isLoading} disabled={props.disabled || isLoading}>
            <VideoIcon className="mr-2 size-5" /> New meeting
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" align="start">
          <DropdownMenuItem asChild>
            <button className="w-full" onClick={startNewMeeting}>
              <AddIcon className="mr-3 size-5" /> Start a new meeting
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button className="w-full" onClick={createFutureMeeting}>
              <TimeIcon className="mr-3 size-5 text-accent-foreground" /> Create a meeting for later
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ShareMeeting
        code={code}
        description="you can share this link."
        onClose={() => setCode(undefined)}
      />
    </>
  );
}
