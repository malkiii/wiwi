import React from 'react';

export type MediaStreamVideoProps = React.ComponentPropsWithoutRef<'video'> & {
  stream: MediaStream | null;
};

export function MediaStreamVideo({ stream, ...props }: MediaStreamVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
    videoRef.current.play();
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      onCanPlay={() => videoRef.current?.play()}
      {...props}
    />
  );
}
