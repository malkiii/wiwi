'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForceUpdate } from 'react-pre-hooks';
import { useMeetingRoom } from './meeting-room-provider';
import { cn, getMediaTracks } from '~/lib/utils';

import {
  MicOnIcon,
  MicOffIcon,
  CameraOnIcon,
  CameraOffIcon,
  HangUpIcon,
  ChatIcon,
  UsersIcon,
  ScreenShareIcon,
  DropDownMenuIcon,
} from '~/components/icons';
import { Button, type ButtonProps } from '~/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import {
  InviteButton,
  FullscreenButton,
  FeedbackButton,
  HelpButton,
} from './meeting-room-settings';

type MeiaStateToggleProps = ButtonProps & {
  kind: 'audio' | 'video';
};

export function MeiaStateToggle({ kind, className, ...props }: MeiaStateToggleProps) {
  const { userMedia, room } = useMeetingRoom();

  const getCurrentState = React.useCallback(
    () => getMediaTracks(userMedia.stream)[kind]?.enabled,
    [userMedia.stream],
  );

  const isEnabled = getCurrentState();
  const hasPermission = isEnabled !== undefined;

  const Icon =
    kind === 'audio'
      ? isEnabled
        ? MicOnIcon
        : MicOffIcon
      : isEnabled
        ? CameraOnIcon
        : CameraOffIcon;

  const rerender = useForceUpdate();

  return (
    <Button
      {...props}
      variant={hasPermission ? (isEnabled ? 'secondary' : 'default') : 'destructive'}
      className={cn('aspect-square size-12 rounded-full p-0', className)}
      disabled={!hasPermission}
      onClick={async () => {
        const track = getMediaTracks(userMedia.stream)[kind];
        if (!track) return;

        track.enabled = !track.enabled;
        await room.track();

        rerender();
      }}
    >
      <Icon className="size-6" />
    </Button>
  );
}

export function MediaStreamSettingsMenu({ className, ...props }: ButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...props}
          variant="secondary"
          className={cn('aspect-square size-12 rounded-full p-0', className)}
        >
          <DropDownMenuIcon className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-[200px] *:w-full [&_button]:p-2">
        <DropdownMenuItem asChild>
          <InviteButton />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <FullscreenButton />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <FeedbackButton />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <HelpButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChatToggle({ className, onClick, ...props }: ButtonProps) {
  const { room } = useMeetingRoom();
  const [readMessages, setReadMessages] = React.useState(room.chatMessages.length);

  return (
    <Button
      variant="secondary"
      {...props}
      className={cn('relative aspect-square size-12 rounded-full p-0', className)}
      onClick={e => {
        onClick?.(e);
        setReadMessages(room.chatMessages.length);
      }}
    >
      <ChatIcon className="size-6" />
      {readMessages < room.chatMessages.length && <NewContentMark />}
    </Button>
  );
}

export function ParticipantsToggle({ className, ...props }: ButtonProps) {
  const { room } = useMeetingRoom();

  return (
    <Button
      variant="secondary"
      {...props}
      className={cn('relative aspect-square size-12 rounded-full p-0', className)}
    >
      <UsersIcon className="size-6" />
      {room.waitingUsers.length > 0 && <NewContentMark />}
    </Button>
  );
}

export function HangUpButton({ className, ...props }: ButtonProps) {
  const router = useRouter();
  const { room } = useMeetingRoom();

  return (
    <Button
      {...props}
      variant="destructive"
      className={cn('h-12 rounded-full bg-red-800 py-0', className)}
      onClick={async () => {
        await room.hangUp();
        router.push('/app');
      }}
    >
      <HangUpIcon className="size-6" />
    </Button>
  );
}

export function ShareScreenButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      variant="secondary"
      className={cn('aspect-square size-12 rounded-full p-0', className)}
    >
      <ScreenShareIcon className="size-6" />
    </Button>
  );
}

function NewContentMark() {
  return (
    <span className="absolute right-0 top-0 block aspect-square w-[25%] rounded-full bg-yellow-500"></span>
  );
}
