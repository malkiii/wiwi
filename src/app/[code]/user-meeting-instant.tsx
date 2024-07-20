'use client';

import React from 'react';
import { cn, getMediaTracks } from '~/lib/utils';
import type { MeetingUser } from '~/types';

import { MicOffIcon } from '~/components/icons';
import { useAudioAnalyser } from 'react-pre-hooks';
import { UserAvatar } from '~/components/user-avatar';
import { useMeetingRoom } from './meeting-room-provider';

type UserMeetingInstantProps = React.ComponentPropsWithoutRef<'video'> & MeetingUser;

export function UserMeetingInstant({
  presenceKey,
  info,
  stream,
  className,
  ...props
}: UserMeetingInstantProps) {
  const { room } = useMeetingRoom();
  const userVideoRef = React.useRef<HTMLVideoElement>(null);
  const isVideoMuted = room.presenceKey.current === presenceKey;

  const { isSpeaking, isMuted, isVideoEnabled } = useMediaState(stream);

  React.useEffect(() => {
    if (!userVideoRef.current) return;

    userVideoRef.current.srcObject = stream;
  }, [stream]);

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
      />
      {isMuted && (
        <span className="absolute left-3 top-3 z-30 block aspect-square w-[7%] rounded-full bg-background/50 p-2">
          <MicOffIcon className="size-full text-foreground/90" />
        </span>
      )}
      {!isMuted && !isVideoEnabled && (
        <SpeakingAnimation isSpeaking={isSpeaking} className="absolute right-3 top-3 z-30 w-[7%]" />
      )}
      <span className="absolute bottom-3 left-3 z-30 block text-sm">
        {isVideoMuted ? 'You' : info.name}
      </span>
    </div>
  );
}

type SoundWaveAnimationProps = React.ComponentProps<'div'> & {
  isSpeaking: boolean;
};

export function SpeakingAnimation({ isSpeaking, className, ...props }: SoundWaveAnimationProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex aspect-square w-8 items-center justify-center gap-[9%] rounded-full bg-foreground [--size:15%] *:block *:size-[--size] *:rounded-full *:bg-background *:duration-1000 *:repeat-infinite',
        className,
      )}
    >
      <span className={cn(isSpeaking && '[animation-name:wave-edge]')}></span>
      <span className={cn(isSpeaking && '[animation-name:wave-middle]')}></span>
      <span className={cn(isSpeaking && '[animation-name:wave-edge]')}></span>
    </div>
  );
}

export function useMediaState(stream: MediaStream | null) {
  const streamRef = React.useRef(stream);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const [isMuted, setIsMuted] = React.useState(() => !stream);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(() => !stream);

  const updateCurrentState = React.useCallback(() => {
    const tracks = getMediaTracks(streamRef.current);

    setIsMuted(!tracks.audio?.enabled);
    setIsVideoEnabled(!!tracks.video?.enabled);
  }, []);

  const analayser = useAudioAnalyser({
    handler: dataArray => {
      if (!streamRef.current) return;

      updateCurrentState();

      setIsSpeaking(Math.max(...dataArray) > 128);
    },
    fftSize: 32,
  });

  React.useEffect(() => {
    streamRef.current = stream;
    if (!stream) return;

    updateCurrentState();

    analayser.connect(stream).catch(error => {
      if (error.message.includes('no audio track')) return;
      console.error(error);
    });

    return analayser.disconnect;
  }, [stream]);

  return { isSpeaking, isMuted, isVideoEnabled };
}
