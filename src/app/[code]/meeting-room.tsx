'use client';

import Link from 'next/link';
import { useCallback } from 'react';

import { Button } from '~/components/ui/button';
import { useSession } from '~/components/session-provider';
import { HomeIcon as BackIcon, VideoIcon as JoinIcon } from '~/components/icons';
import { useMeetingRoom } from './meeting-room-provider';
import { UserMeetingInstant } from './user-meeting-instant';
import { MediaStreamSettingsMenu, MeiaStateToggle } from './media-stream-controls';
import { LoadingAnimation } from '~/components/loading-animation';
import { WarningPage } from './waning-page';

export function MeetingRoom() {
  const { state } = useMeetingRoom();

  if (state === 'joined') return <Room />;

  if (state === 'ready' || state === 'joining') return <GettingReady />;

  if (state === 'rejected') {
    return <WarningPage title="You have been rejected from this call!" description="" />;
  }

  if (state === 'error') {
    return (
      <WarningPage
        title="Something went wrong!"
        description="Check your internet connection and reload the page."
      />
    );
  }

  return <LoadingAnimation key="loading" className="w-20" />;
}

function GettingReady() {
  const { user } = useSession();
  const { code, userMedia, state, setState, room } = useMeetingRoom();

  const isJoining = state === 'joining';

  const joinToMeeting = useCallback(async () => {
    if (!user) return;
    setState('joining');

    const response = await room.startTracking();

    if (response !== 'ok') return setState('error');
    if (user.roomCode !== code) return;

    await room.sendJoinResponse({ key: room.presenceKey.current, status: 'ACCEPTED' });
  }, [user]);

  return (
    <div className="grid w-full max-w-lg gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" asChild>
          <Link
            href="/app"
            className={isJoining ? 'pointer-events-none opacity-50' : ''}
            onClick={() => {
              const page = document.querySelector('body > div') as HTMLDivElement;
              if (page) page.style.pointerEvents = 'none';
            }}
          >
            <BackIcon className="mr-2 size-5" /> Go back
          </Link>
        </Button>
        <Button loading={isJoining} onClick={joinToMeeting}>
          <JoinIcon className="mr-2 size-5" /> Join meeting
        </Button>
      </div>
      <UserMeetingInstant info={user!} stream={userMedia.stream} />
      <div className="flex w-full items-center justify-between">
        <div className="flex w-fit gap-4">
          <MeiaStateToggle kind="audio" />
          <MeiaStateToggle kind="video" />
        </div>
        <MediaStreamSettingsMenu />
      </div>
    </div>
  );
}

function Room() {
  const currentUser = useSession().user!;
  const { userMedia, room } = useMeetingRoom();

  return (
    <div className="flex size-full w-full flex-col">
      <div className="flex flex-1 items-center justify-center px-10">
        <div className="flex flex-wrap justify-center gap-2 transition-all duration-200 *:w-[calc(100vw-2*theme(padding.12))] *:max-w-md">
          <UserMeetingInstant key={currentUser.id} info={currentUser} stream={userMedia.stream} />
          {room.joinedUsers.map(user => (
            <UserMeetingInstant key={user.info.id} info={user.info} stream={user.stream} />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-grow-0 items-center justify-center gap-4 py-4">
        <MeiaStateToggle kind="audio" />
        <MeiaStateToggle kind="video" />
        <MediaStreamSettingsMenu />
      </div>
    </div>
  );
}
