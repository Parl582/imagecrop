// https://levelup.gitconnected.com/crop-images-on-upload-in-your-react-app-with-react-image-crop-5f3cd0ad2b35

import React, { FC, useState, useCallback, useRef, useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CompletedCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: string;
  aspect: number;
}

type TgenerateDownload = (
  canvas: HTMLCanvasElement,
  crop: CompletedCrop
) => void;
const generateDownload: TgenerateDownload = (canvas, crop) => {
  if (!crop || !canvas) {
    return;
  }

  canvas.toBlob(
    (blob) => {
      const previewUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.download = "cropPreview.png";
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    "image/png",
    1
  );
};

type TonSelectFile = (evt: React.ChangeEvent<HTMLInputElement>) => void;

const Upload: FC = () => {
  const imgRef = useRef<HTMLImageElement>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [upImg, setUpImg] = useState<FileReader["result"]>();
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 30,
    aspect: 16 / 9
  });
  const [completedCrop, setCompletedCrop] = useState<CompletedCrop>();

  const onSelectFile: TonSelectFile = (evt) => {
    if (evt.target.files && evt.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(evt.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const pixelRatio = window.devicePixelRatio;

    const width = crop.width || 0;
    const height = crop.height || 0;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    const cropC = crop as CompletedCrop;

    ctx.drawImage(
      image,
      cropC.x * scaleX,
      cropC.y * scaleY,
      cropC.width * scaleX,
      cropC.height * scaleY,
      0,
      0,
      cropC.width,
      cropC.height
    );
  }, [crop, completedCrop]);

  const getGenerateDownload = () => {
    const canvas = previewCanvasRef.current as HTMLCanvasElement;
    const cropObject = completedCrop as CompletedCrop;
    return generateDownload(canvas, cropObject);
  };

  // () => generateDownload(previewCanvasRef.current, completedCrop)

  return (
    <>
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <ReactCrop
        src={upImg as string}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c as CompletedCrop)}
      />
      <div>
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0)
          }}
        />
      </div>
      <p>
        Note that the download below wont work in this sandbox due to the iframe
        missing allow-downloads. Its just for your reference.
      </p>
      <button
        type="button"
        disabled={!completedCrop?.width || !completedCrop?.height}
        onClick={getGenerateDownload}
      >
        Download cropped image
      </button>
    </div>
    </>
  );
};

export default Upload;
