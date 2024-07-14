'use client';

import React from 'react';
import type { MeetingUser } from '~/types';
import { UserAvatar } from '~/components/user-avatar';
import { useAudioAnalyser } from 'react-pre-hooks';
import { MicOffIcon } from '~/components/icons';
import { cn, getMediaTracks } from '~/lib/utils';

type UserMeetingInstantProps = React.ComponentPropsWithoutRef<'div'> & MeetingUser;

export function UserMeetingInstant({ info, stream, className, ...props }: UserMeetingInstantProps) {
  const userVideoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef(stream);

  const getCurrentState = React.useCallback(
    (kind: keyof ReturnType<typeof getMediaTracks>) => {
      return getMediaTracks(stream)[kind]?.enabled;
    },
    [stream],
  );

  const [isVideoEnabled, setIsVideoEnabled] = React.useState(() => getCurrentState('video'));
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(() => getCurrentState('audio'));

  const analayser = useAudioAnalyser({
    handler: dataArray => {
      if (!streamRef.current) return;

      const isEnabled = getCurrentState('audio');
      setIsAudioEnabled(isEnabled);

      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (!isEnabled) return;

      // Get the center of the canvas
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;

      // Determine the radius of the circle
      const radius = getRadiusValue(dataArray);

      // Draw the red circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFF';
      ctx.fill();
    },
    fftSize: 32,
  });

  React.useEffect(() => {
    if (!userVideoRef.current || !isVideoEnabled) return;

    userVideoRef.current.srcObject = stream;
  }, [stream, isVideoEnabled]);

  React.useEffect(() => {
    streamRef.current = stream;
    if (!stream) return;

    setIsVideoEnabled(getCurrentState('video'));

    analayser.connect(stream).catch(error => {
      if (error.message.includes('no audio track')) return;
      console.error(error);
    });

    return () => {
      analayser.disconnect();
      streamRef.current = null;
    };
  }, [stream]);

  return (
    <div
      {...props}
      className={cn(
        'relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg bg-muted',
        className,
      )}
    >
      {!isVideoEnabled && (
        <canvas
          ref={canvasRef}
          width="1360"
          height="1360"
          className="absolute left-1/2 top-0 aspect-square h-full -translate-x-1/2 opacity-10"
        />
      )}
      <UserAvatar user={info} size={240} className="z-10 aspect-square w-1/3 text-xl" />
      <video
        ref={userVideoRef}
        muted
        autoPlay
        playsInline
        className={cn(
          'absolute left-0 top-0 z-20 w-full',
          !isVideoEnabled && 'invisible opacity-0',
        )}
        onTimeUpdate={() => setIsVideoEnabled(getCurrentState('video'))}
      />
      {!isAudioEnabled && (
        <span className="absolute left-3 top-3 z-30 block aspect-square rounded-full bg-background/50 p-2">
          <MicOffIcon className="size-4 text-foreground/90" />
        </span>
      )}
      <span className="absolute bottom-3 left-3 z-30 block text-sm">{info.name}</span>
    </div>
  );
}

function getRadiusValue(dataArray: Uint8Array) {
  const resolvedValue = Math.exp((dataArray[0] ?? 0) / 200) * 170;
  const limit = 300;

  return Math.max(limit, resolvedValue);
}
