'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '~/components/ui/button';
import { useSession } from '~/components/session-provider';
import { HomeIcon as BackIcon, VideoIcon as JoinIcon } from '~/components/icons';
import { useMeetingRoom } from './meeting-room-provider';
import { UserMeetingInstant } from './user-meeting-instant';
import { LoadingAnimation } from '~/components/loading-animation';
import { WarningPage } from './waning-page';
import { cn } from '~/lib/utils';

import {
  MediaStreamSettingsMenu,
  MeiaStateToggle,
  ChatToggle,
  ParticipantsToggle,
  HangUpButton,
  ShareScreenButton,
} from './media-stream-controls';

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

  const joinToMeeting = React.useCallback(async () => {
    if (!user) return;
    setState('joining');

    const response = await room.track();

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
      <UserMeetingInstant
        presenceKey={room.presenceKey.current}
        info={user!}
        stream={userMedia.stream}
      />
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
  const [sidebarContentType, setSidebarContentType] = React.useState<'chat' | 'participants'>();

  return (
    <div className="flex size-full w-full flex-col">
      <div className="flex flex-1 items-center">
        <div className="flex flex-1 flex-wrap justify-center gap-2 px-10 transition-all duration-200 *:w-[calc(100vw-2*theme(padding.12))] *:max-w-md">
          <UserMeetingInstant
            key={currentUser.id}
            presenceKey={room.presenceKey.current}
            info={currentUser}
            stream={userMedia.stream}
          />
          {room.joinedUsers.map(user => (
            <UserMeetingInstant
              key={user.info.id}
              presenceKey={user.presenceKey}
              info={user.info}
              stream={user.stream}
            />
          ))}
        </div>
        <div
          className={cn(
            '[--width:400px]',
            'grid min-h-full w-0 overflow-hidden transition-all duration-200',
            !!sidebarContentType && 'w-[calc(var(--width)+theme(padding.4))]',
          )}
        >
          <div className="mx-auto min-h-full w-[--width] rounded-lg bg-primary text-accent-foreground"></div>
        </div>
      </div>
      <div className="flex w-full flex-grow-0 items-center justify-center gap-4 py-4">
        <MeiaStateToggle kind="audio" />
        <MeiaStateToggle kind="video" />
        <ChatToggle
          variant={sidebarContentType === 'chat' ? 'default' : 'secondary'}
          onClick={() => setSidebarContentType(prev => (prev === 'chat' ? undefined : 'chat'))}
        />
        <ParticipantsToggle
          variant={sidebarContentType === 'participants' ? 'default' : 'secondary'}
          onClick={() =>
            setSidebarContentType(prev => (prev === 'participants' ? undefined : 'participants'))
          }
        />
        <ShareScreenButton />
        <MediaStreamSettingsMenu />
        <HangUpButton />
      </div>
    </div>
  );
}

function SidebarContent({ children }: React.PropsWithChildren) {
  return <div className=""></div>;
}
