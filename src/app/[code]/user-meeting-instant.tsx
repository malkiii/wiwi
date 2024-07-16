'use client';

import React from 'react';
import type { MeetingUser } from '~/types';
import { cn, getMediaTracks } from '~/lib/utils';

import { MicOffIcon } from '~/components/icons';
import { UserAvatar } from '~/components/user-avatar';
import { useMeetingRoom } from './meeting-room-provider';
import { useMicrophoneState, SpeakingAnimation } from '~/components/microphone';

type UserMeetingInstantProps = React.ComponentPropsWithoutRef<'video'> & MeetingUser;

export function UserMeetingInstant({
  presenceKey,
  info,
  stream,
  className,
  ...props
}: UserMeetingInstantProps) {
  const userVideoRef = React.useRef<HTMLVideoElement>(null);
  const isVideoMuted = useMeetingRoom().room.presenceKey.current === presenceKey;

  const { isSpeaking, isMuted } = useMicrophoneState(stream);

  const getCurrentState = React.useCallback(
    (kind: keyof ReturnType<typeof getMediaTracks>) => {
      const track = getMediaTracks(stream)[kind];
      return track?.enabled || track?.muted;
    },
    [stream],
  );

  const [isVideoEnabled, setIsVideoEnabled] = React.useState(() => getCurrentState('video'));

  React.useEffect(() => {
    setIsVideoEnabled(getCurrentState('video'));
  }, [stream]);

  React.useEffect(() => {
    if (!userVideoRef.current || !isVideoEnabled) return;

    userVideoRef.current.srcObject = stream;
  }, [stream, isVideoEnabled]);

  return (
    <div
      className={cn(
        'relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg bg-muted outline-2 outline-primary',
        isSpeaking && 'outline',
        className,
      )}
    >
      <UserAvatar user={info} size={240} className="z-10 aspect-square w-1/3 text-xl" />
      <video
        {...props}
        ref={userVideoRef}
        muted={isVideoMuted}
        autoPlay
        playsInline
        className={cn(
          'absolute left-0 top-0 z-20 w-full',
          !isVideoEnabled && 'invisible opacity-0',
        )}
        onTimeUpdate={() => setIsVideoEnabled(getCurrentState('video'))}
      />
      {isMuted && (
        <span className="absolute left-3 top-3 z-30 block aspect-square w-[7%] rounded-full bg-background/50 p-2">
          <MicOffIcon className="size-full text-foreground/90" />
        </span>
      )}
      {!isMuted && !isVideoEnabled && (
        <SpeakingAnimation isSpeaking={isSpeaking} className="absolute right-3 top-3 z-30 w-[7%]" />
      )}
      <span className="absolute bottom-3 left-3 z-30 block text-sm">{info.name}</span>
    </div>
  );
}
