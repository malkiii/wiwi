import React from 'react';

export type MediaStreamVideoProps = React.ComponentPropsWithoutRef<'video'> & {
  stream: MediaStream | null;
};

export function MediaStreamVideo({ stream, ...props }: MediaStreamVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline {...props} />;
}
