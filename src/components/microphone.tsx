import React from 'react';
import { useAudioAnalyser } from 'react-pre-hooks';
import { cn } from '~/lib/utils';

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

export function useMicrophoneState(stream: MediaStream | null) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(() => !stream);

  const streamRef = React.useRef(stream);

  const analayser = useAudioAnalyser({
    handler: dataArray => {
      if (!streamRef.current) return;

      const track = streamRef.current.getAudioTracks()[0];
      setIsMuted(!track?.enabled || track.muted);

      setIsSpeaking(Math.max(...dataArray) > 128);
    },
    fftSize: 32,
  });

  React.useEffect(() => {
    streamRef.current = stream;
    if (!stream) return;

    analayser.connect(stream).catch(error => {
      if (error.message.includes('no audio track')) return;
      console.error(error);
    });

    return analayser.disconnect;
  }, [stream]);

  return { isSpeaking, isMuted };
}
