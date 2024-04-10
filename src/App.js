import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const App = () => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: "px",
    x: 130,
    y: 50,
    width: 200,
    height: 200,
  });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const [imgCrop, setImgCrop] = useState(false);
  const rcImageref = useRef();
  const canvasref = useRef();

  console.log(croppedImageUrl);

  // console.log(imgCrop);
  const HandleChange = (e) => {
    // setImage(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const onCropComplete = (crop, pixelCrop) => {
    setCrop(crop);
  };

  const Handlechange = useCallback((img) => {
    rcImageref.current = img;
  }, []);

  useEffect(() => {
    if (image && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      // setCroppedImageUrl(canvas.toDataURL());
      // setCroppedImageUrl(canvas.toDataURL("image/jpeg"));
      setCroppedImageUrl(canvas.toDataURL("image/png"));
      const img = new Image();
      img.src = canvas.toDataURL("image/png");
    }
  }, [croppedImageUrl]);

  // useEffect(() => {
  //   const rc_image = rcImageref.current;
  //   const crop = croppedImageUrl;
  //   const canvas = canvasref.current;
  //   const scaleX = image.naturalWidth / rc_image.width;
  //   const scaleY = image.naturalHeight / rc_image.height;

  //   const pixelratio = window.devicePixelRatio;
  //   const dImageWidth = crop.width * scaleX;
  //   const dImageHeight = crop.height * scaleY;

  //   canvas.width = dImageWidth * pixelratio;
  //   canvas.height = dImageHeight * pixelratio;

  //   const ctx = canvas.getContext("2d");
  //   ctx.setTransform(pixelratio, 0, 0, pixelratio, 0, 0);

  //   ctx.imageSmoothingQuality = "large";
  //   ctx.imageSmoothingEnabled = true;

  //   ctx.drawImage(
  //     rc_image,
  //     crop.x * scaleX,
  //     crop.y * scaleY,
  //     dImageWidth,
  //     dImageHeight,
  //     0,
  //     0,
  //     dImageWidth,
  //     dImageHeight
  //   );
  // }, [croppedImageUrl]);

  return (
    <>
      <div className="">
        <input type="file" onChange={HandleChange} />
      </div>
      <div>
        {imgCrop ? (
          <ReactCrop
            src={image}
            crop={crop}
            onChange={(crop) => setCrop(crop)}
            // {...crop}
            //  onChange={onCropComplete}

            // onImageLoaded={(image) => {
            //   setCroppedImageUrl(image);
            // }}
            onImageLoaded={Handlechange}
          />
        ) : (
          <img
            src={image}
            crop={crop}
            onChange={(crop) => setCrop(crop)}
            // {...crop}
            //  onChange={onCropComplete}
            onImageLoaded={(image) => {
              setCroppedImageUrl(image);
            }}
          />
        )}
      </div>
      <div className="">
        <img src={croppedImageUrl} alt="Crop" />
      </div>

      <button onClick={(e) => setImgCrop(!imgCrop)}>Crop</button>
    </>
  );
};

export default App;
