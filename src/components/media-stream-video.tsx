import React from 'react';

export type MediaStreamVideoProps = React.ComponentPropsWithoutRef<'video'> & {
  stream: MediaStream | null;
};

export function MediaStreamVideo({ stream, ...props }: MediaStreamVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const playVideo = React.useCallback(() => videoRef.current?.play(), []);

  React.useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
    playVideo();
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      onPause={playVideo}
      onEnded={playVideo}
      onLoadedData={playVideo}
      {...props}
    />
  );
}
