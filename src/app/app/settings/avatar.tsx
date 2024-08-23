'use client';

import React from 'react';
import { useAsyncCallback, useScrollPosition, useSwiping } from 'react-pre-hooks';
import { useSession } from '~/components/session-provider';
import { updateUserImage } from './actions';

import { Button } from '~/components/ui/button';
import { Slider } from '~/components/ui/slider';
import { UploadImageIcon } from '~/components/icons';
import { UserAvatar } from '~/components/user-avatar';
import { Dialog, DialogContent, DialogClose } from '~/components/ui/dialog';

export default function Section() {
  const { user, updateSessionUser } = useSession();
  const [imageFile, setImageFile] = React.useState<File>();
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });

  const imageSrc = useImageObjectURL(imageFile);
  const [isOpened, setIsOpened] = React.useState<boolean>();
  const [isCropping, setIsCropping] = React.useState(false);

  const cropAndUpload = React.useCallback(async (image: string) => {
    setIsCropping(true);

    const formData = new FormData();
    formData.set('image', image);

    const newImage = await updateUserImage(formData);

    updateSessionUser(curr => curr && { ...curr, image: newImage });

    setIsCropping(false);
    setIsOpened(false);
  }, []);

  React.useEffect(() => {
    if (!imageSrc) return;

    const image = new Image();
    image.onload = () => {
      setIsOpened(true);
      setImageSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.src = imageSrc;
  }, [imageSrc]);

  return (
    <div className="mb-8 w-full">
      <label className="relative mx-auto block w-1/3 cursor-pointer">
        <UserAvatar user={user!} className="w-full" size={240} />
        <span className="absolute inset-0 z-50 flex items-center justify-center rounded-full bg-foreground text-background opacity-35 transition-opacity hover:opacity-55">
          <UploadImageIcon className="size-6" />
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={e => setImageFile(e.target.files?.[0])}
          value=""
          hidden
        />
      </label>
      <Dialog open={isOpened || isCropping} onOpenChange={opened => !opened && setIsOpened(false)}>
        <DialogContent>
          <ImageCropper
            image={imageSrc}
            width={imageSize.width}
            height={imageSize.height}
            onCrop={cropAndUpload}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ImageCropperProps = {
  image: string | undefined;
  width: number;
  height: number;
  onCrop: (image: string) => any | Promise<any>;
};

// cropper component
function ImageCropper(props: ImageCropperProps) {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const { containerRef, maskRef, ...cropper } = useImageCropper(
    imageRef,
    props.width,
    props.height,
  );

  const cropHandler = React.useCallback(async () => {
    const croppedImage = cropper.crop();
    if (!croppedImage) throw new Error('Failed to crop the image!');

    await props.onCrop(croppedImage);
  }, [props.onCrop, cropper.crop]);

  const { callback: submit, isPending, error } = useAsyncCallback(cropHandler);

  return (
    <div className="grid gap-4">
      <div
        ref={containerRef}
        className="relative h-[50dvh] w-full cursor-move touch-none select-none overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 m-auto aspect-square w-3/5">
          <img
            ref={imageRef}
            src={props.image}
            style={cropper.styles.image}
            className="absolute max-w-none overflow-visible object-cover object-left-top"
            alt="Cropped image"
          />
          <div
            ref={maskRef}
            className="relative size-full overflow-hidden"
            style={{
              background: 'white',
              boxShadow: '0 0 0 999px rgba(0,0,0,0.5)',
              mixBlendMode: 'darken',
            }}
          >
            <div style={cropper.styles.maskContent}></div>
          </div>
        </div>
      </div>
      <Slider
        min={0}
        max={2}
        step={0.1}
        value={[cropper.zoom]}
        onValueChange={values => cropper.setZoom(values[0]!)}
        className="flex w-full"
      />
      {error && <p className="text-xs text-destructive">{error.message}</p>}
      <div className="flex w-full gap-[inherit] *:flex-grow max-sm:flex-col">
        <Button onClick={submit} loading={isPending}>
          Crop
        </Button>
        <DialogClose asChild>
          <Button variant="secondary" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}

// generate image object URL and revoke it when unmounted
function useImageObjectURL(image: File | undefined) {
  const imageSrc = React.useMemo(() => image && URL.createObjectURL(image), [image]);

  React.useEffect(
    () => () => {
      imageSrc && URL.revokeObjectURL(imageSrc);
    },
    [imageSrc],
  );

  return imageSrc;
}

// all the cropper functionalities and content styles
function useImageCropper(
  imageRef: React.RefObject<HTMLImageElement>,
  width: number,
  height: number,
) {
  const [zoom, setZoom] = React.useState(1);

  const startPosition = React.useRef({ top: 0, left: 0 });
  const { ref: maskRef, ...scrollPosition } = useScrollPosition();

  // handle image sliding
  const containerRef = useSwiping<HTMLDivElement>({
    handler: action => {
      const container = maskRef.current!;

      if (action.type === 'start') {
        startPosition.current.top = container.scrollTop;
        startPosition.current.left = container.scrollLeft;
      }

      container.scrollTo({
        top: startPosition.current.top + action.deltaY,
        left: startPosition.current.left + action.deltaX,
      });
    },
  });

  // handle image cropping
  const crop = React.useCallback(() => {
    const image = imageRef.current;
    const mask = maskRef.current;
    if (!image || !mask) return;

    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    const maskWidth = (mask.clientWidth * imageWidth) / mask.scrollWidth;
    const maskHeight = (mask.clientHeight * imageHeight) / mask.scrollHeight;

    const sx = (mask.scrollLeft / mask.scrollWidth) * imageWidth;
    const sy = (mask.scrollTop / mask.scrollHeight) * imageHeight;

    const canvas = document.createElement('canvas');

    const size = Math.min(maskWidth, 420);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, sx, sy, maskWidth, maskHeight, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL();
  }, []);

  // generate the cropper component styles
  const styles = React.useMemo(() => {
    const size = 100 + zoom * 100 + '%';
    const isPortrait = height > width;
    return {
      image: {
        width: size,
        height: size,
        top: `${-scrollPosition.y}px`,
        left: `${-scrollPosition.x}px`,
      },
      maskContent: {
        [isPortrait ? 'width' : 'height']: size,
        aspectRatio: `${width} / ${height}`,
      },
    } satisfies Record<string, React.CSSProperties>;
  }, [width, height, scrollPosition, zoom]);

  return {
    containerRef,
    maskRef,
    styles,
    zoom,
    setZoom,
    crop,
  };
}
