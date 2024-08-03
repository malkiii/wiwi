'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForceUpdate, useMediaQuery, useScreenCapture } from 'react-pre-hooks';
import { useMeetingRoom } from './provider';
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

import { InviteButton, FullscreenButton, FeedbackButton, SupportButton } from './settings';

type MeiaStateToggleProps = ButtonProps & {
  kind: 'audio' | 'video';
};

export function MeiaStateToggle({ kind, className, ...props }: MeiaStateToggleProps) {
  const { userMedia, room } = useMeetingRoom();

  const getCurrentState = React.useCallback(() => {
    const track = getMediaTracks(userMedia.stream)[kind];

    if (kind === 'audio' && track && room.isMuted) {
      track.enabled = false;
    }

    return track?.enabled;
  }, [userMedia.stream, room.isMuted]);

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
      title={kind === 'audio' ? 'Toggle microphone' : 'Toggle camera'}
      variant={hasPermission ? (isEnabled ? 'secondary' : 'default') : 'destructive'}
      className={cn('aspect-square size-12 rounded-full p-0', className)}
      disabled={!hasPermission || room.isMuted}
      onClick={async () => {
        const track = getMediaTracks(userMedia.stream)[kind];
        if (!track || room.isMuted) return;

        track.enabled = !track.enabled;
        rerender();

        await room.track();
      }}
    >
      <Icon className="size-6" />
    </Button>
  );
}

export function SettingsMenu({ className, ...props }: ButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          {...props}
          title="Additional"
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
          <SupportButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChatToggle({ className, onClick, ...props }: ButtonProps) {
  const { room } = useMeetingRoom();
  const [readMessages, setReadMessages] = React.useState(room.chatMessages.length);

  const updateMessagesNumber = () => setReadMessages(room.chatMessages.length);

  React.useEffect(() => {
    if (props.variant === 'default') {
      updateMessagesNumber();
    } else {
      room.notificationSound.current?.play();
    }
  }, [room.chatMessages.length]);

  return (
    <Button
      {...props}
      title="Chat messages"
      className={cn('relative aspect-square size-12 rounded-full p-0', className)}
      onClick={e => {
        onClick?.(e);
        updateMessagesNumber();
      }}
    >
      <ChatIcon className="size-6" />
      {props.variant !== 'default' && readMessages < room.chatMessages.length && <Indicator />}
    </Button>
  );
}

export function ParticipantsToggle({ className, ...props }: ButtonProps) {
  const { room } = useMeetingRoom();

  return (
    <Button
      {...props}
      title="Participants"
      className={cn('relative aspect-square size-12 rounded-full p-0', className)}
    >
      <UsersIcon className="size-6" />
      {room.waitingUsers.length > 0 && <Indicator />}
    </Button>
  );
}

export function HangUpButton({ className, ...props }: ButtonProps) {
  const router = useRouter();
  const { room } = useMeetingRoom();

  return (
    <Button
      {...props}
      title="Hang up"
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
  const { room } = useMeetingRoom();
  const isDesktop = useMediaQuery('(hover: hover)');

  const screenCapture = useScreenCapture({ video: true, audio: true });

  const isPresenting = room.presenter?.key === room.presenceKey.current;

  return (
    <Button
      {...props}
      title={isPresenting ? 'Stop screen sharing' : 'Start screen sharing'}
      variant={isPresenting ? 'default' : 'secondary'}
      disabled={!isDesktop || (room.presenter && !isPresenting)}
      className={cn('aspect-square size-12 rounded-full p-0', className)}
      onClick={async () => {
        if (isPresenting) {
          screenCapture.stop();
          return await room.stopScreenSharing();
        } else {
          const stream = await screenCapture.start();
          room.startScreenSharing(stream);
        }
      }}
    >
      <ScreenShareIcon className="size-6" />
    </Button>
  );
}

function Indicator() {
  return (
    <span className="absolute right-0 top-0 block aspect-square w-[25%] rounded-full bg-yellow-500"></span>
  );
}
