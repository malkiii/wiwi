import React from 'react';

export type MediaStreamVideoProps = React.ComponentPropsWithoutRef<'video'> & {
  stream: MediaStream | null;
};

export function MediaStreamVideo({ stream, ...props }: MediaStreamVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const playVideo = React.useCallback(() => videoRef.current?.play(), []);

  React.useEffect(() => {
    if (!videoRef.current) return;

    if ('srcObject' in videoRef.current) {
      videoRef.current.srcObject = stream;
    } else {
      // @ts-ignore
      videoRef.current.src = URL.createObjectURL(stream);
    }

    playVideo();
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      onPause={playVideo}
      onEnded={playVideo}
      onError={playVideo}
      onStalled={playVideo}
      onLoadedData={playVideo}
      {...props}
    />
  );
}
