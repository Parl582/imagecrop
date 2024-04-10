import React, { useState } from "react";
import "./App.css";
import ImageCropper from "./Crop/ImageCroper";

function App2() {
  const [crop, setCrop] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(undefined);
  const [croppedImage, setCroppedImage] = useState(undefined);

  const [Img, SetImg] = useState();

  console.log(Img);

  const onUploadFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const image = reader.result;

        setImageToCrop(image);
      });

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="app">
      <input type="file" accept="image/*" onChange={onUploadFile} />
      <div>
        <ImageCropper
          imageToCrop={imageToCrop}
          crop={crop}
          onImageCropped={(croppedImage) => setCroppedImage(croppedImage)}
        />
      </div>

      <button onClick={() => SetImg(croppedImage)}>Crop</button>
      {/* {croppedImage && (
        <div>
          <h2>Cropped Image</h2>
          <img alt="Cropped Img" src={croppedImage} />
        </div>
      )} */}
      <button onClick={() => setCrop(!crop)}>CropImage</button>

      <img src={Img} alt="" />
    </div>
  );
}

export default App2;
