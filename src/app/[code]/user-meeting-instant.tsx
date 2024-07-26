'use client';

import React from 'react';
import { cn, getMediaTracks } from '~/lib/utils';
import type { MeetingUser } from '~/types';

import { MicOffIcon } from '~/components/icons';
import { useAudioAnalyser, useDebouncedState } from 'react-pre-hooks';
import { UserAvatar } from '~/components/user-avatar';
import { useMeetingRoom } from './meeting-room-provider';
import { useSession } from '~/components/session-provider';
import { MediaStreamVideo } from '~/components/media-stream-video';

type UserMeetingInstantProps = React.ComponentPropsWithoutRef<'video'> & MeetingUser;

export function UserMeetingInstant({
  presenceKey,
  info,
  stream,
  className,
  ...props
}: UserMeetingInstantProps) {
  const user = useSession().user!;
  const { room, code } = useMeetingRoom();

  const isHost = user.roomCode === code;
  const isUserInstant = room.presenceKey.current === presenceKey;

  const { isSpeaking, isMuted, isVideoEnabled } = useMediaState(stream);
  const [orientation, setOrientation] = React.useState<'landscape' | 'portrait'>('landscape');

  React.useEffect(() => {
    if (!isSpeaking) return;

    if (isUserInstant) return room.setSpeaker(undefined);

    room.setSpeaker(curr => {
      if (curr?.presenceKey === presenceKey) return curr;
      return { presenceKey, info, stream };
    });
  }, [isSpeaking]);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg bg-muted outline-2 outline-primary',
        isSpeaking && 'outline',
        className,
      )}
    >
      <UserAvatar
        user={info}
        size={240}
        className="z-10 aspect-square w-1/2 max-w-[120px] text-xl"
      />
      <MediaStreamVideo
        stream={stream}
        muted={isUserInstant}
        onLoadedMetadataCapture={e => {
          const { videoWidth, videoHeight } = e.currentTarget;
          setOrientation(videoWidth > videoHeight ? 'landscape' : 'portrait');
        }}
        className={cn(
          'absolute inset-0 z-20 size-full object-cover',
          orientation === 'landscape' && 'object-top',
          !isVideoEnabled && 'invisible opacity-0',
          isUserInstant && '-scale-x-100',
        )}
        {...props}
      />
      {isMuted && (
        <span className="absolute left-2 top-2 z-30 block aspect-square w-[25%] max-w-8 rounded-full bg-background/50 p-2 sm:left-3 sm:top-3">
          <MicOffIcon className="size-full text-foreground/90" />
        </span>
      )}
      {!isMuted && !isVideoEnabled && (
        <SpeakingAnimation
          isSpeaking={isSpeaking}
          className="absolute right-2 top-2 z-30 w-[8%] max-w-8 sm:right-3 sm:top-3"
        />
      )}
      <span className="absolute bottom-0 left-0 z-30 block w-full overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm">
        {isUserInstant ? 'You' : info.name + (isHost ? ' (Host)' : '')}
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
  const [isSpeaking, setIsSpeaking] = useDebouncedState({ initial: false, delay: 100 });

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
