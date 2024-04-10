import React, { Component } from "react";
import ReactDOM from "react-dom";
import canvasToImage from "canvas-to-image";
import AvatarEditor from "react-avatar-editor";
import Cropper from "./Cropper";
import { renderToStaticMarkup } from "react-dom/server";
import RotateSlider from "./RotateSlider";

// import "../styles/ImageEditor.css";

class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorWidth: 800,
      editorHeight: 400,
      originalImg: {
        imgData: "",
        height: 800,
        width: 400,
      },
      imgData: "",
      isToolsDisabled: true,
      rotateValue: 0,
      scaleFactor: 1,
      mainCanvasVisibleStyle: {
        display: "inline-block",
      },
      selectorVisibleStyle: {
        display: "none",
      },
      imageEditorWrapperStyle: {
        margin: "0 auto",
        width: "800px",
      },
      imgCropData: "",
      cropArea: {},
      cropSubmitBtn: "",
    };
  }

  resetEditor = () => {
    let originalImg = this.state.originalImg;
    this.setState({
      imgData: originalImg.imgData,
      editorWidth: originalImg.width,
      editorHeight: originalImg.height,
      scaleFactor: 1,
      rotateValue: 0,
      imageEditorWrapperStyle: {
        width: originalImg.width,
        margin: "0 auto",
      },
    });
  };

  componentDidMount() {
    let cropSubmitBtn = this.refs.cropSubmit;
    this.setState({ cropSubmitBtn: cropSubmitBtn });
  }

  setScaleFactor(sign) {
    let factor = this.state.scaleFactor + 0.3 * sign;
    this.setState({ scaleFactor: factor });
  }

  setRotateValue() {
    let value = this.refs.rotationTxt.value;
    this.setState({ rotateValue: value });
  }

  setRotateValue2 = (value) => {
    this.setState({
      rotateValue: value,
    });
  };

  storeCropArea(cropArea) {
    this.setState({ cropArea: cropArea });
  }

  loadFile() {
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    var _this = this;

    reader.onloadend = function () {
      _this.resetEditor();
      let image = new Image();
      image.onload = function () {
        _this.setState({ editorWidth: image.width });
        _this.setState({ editorHeight: image.height });
        _this.setState({
          originalImg: {
            imgData: reader.result,
            width: image.width,
            height: image.height,
          },
        });

        _this.setState({
          imageEditorWrapperStyle: {
            width: image.width,
            margin: "0 auto",
          },
        });
      };

      image.src = reader.result;
      _this.setState({ imgData: reader.result });
      _this.setState({ isToolsDisabled: false });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  toggleCropper(isToggled) {
    if (isToggled) {
      this.setState({ selectorVisibleStyle: { display: "inline-block" } });
      this.setState({ mainCanvasVisibleStyle: { display: "none" } });
    } else {
      this.setState({ selectorVisibleStyle: { display: "none" } });
      this.setState({ mainCanvasVisibleStyle: { display: "inline-block" } });
    }
  }

  cropImg = () => {
    if (this.editor) {
      const canvas = this.editor.getImageScaledToCanvas();
      this.setState({ imgCropData: canvas.toDataURL() });
      this.toggleCropper(true);
    }
  };

  completeCrop(croppedImg) {
    console.log("completeCrop");
    //console.log(croppedImg);
    this.setState({ scaleFactor: 1 });

    let _this = this;
    let image = new Image();
    image.onload = function () {
      _this.setState({ editorWidth: image.width });
      _this.setState({ editorHeight: image.height });

      _this.setState({
        imageEditorWrapperStyle: {
          width: image.width,
          margin: "0 auto",
        },
      });
    };
    image.src = croppedImg;
    this.setState({ imgData: croppedImg });
    this.toggleCropper(false);
  }

  downloadImg = () => {
    if (this.editor) {
      const editorCanvas = this.editor.getImageScaledToCanvas();
      let canvasForDownload = this.refs.canvasForDownload;
      let context = canvasForDownload.getContext("2d");
      let _this = this;
      let finalImage = new Image();
      finalImage.onload = function () {
        _this.setState({ editorWidth: finalImage.width });
        _this.setState({ editorHeight: finalImage.height });
        context.clearRect(
          0,
          0,
          canvasForDownload.width,
          canvasForDownload.height
        );
        context.drawImage(
          finalImage,
          0,
          0,
          finalImage.width,
          finalImage.height,
          0,
          0,
          finalImage.width,
          finalImage.height
        );
        canvasToImage("canvasForDownload", {
          name: "Image",
          type: "jpg",
          quality: 1,
        });
      };
      finalImage.src = editorCanvas.toDataURL();
    }
  };

  setEditorRef = (editor) => (this.editor = editor);
  render() {
    return (
      <div className="imageEditorContainer" ref="imageEditorContainer">
        <div className="imageEditor">
          <div style={this.state.imageEditorWrapperStyle}>
            <AvatarEditor
              className="canvas"
              style={this.state.mainCanvasVisibleStyle}
              ref={this.setEditorRef}
              image={this.state.imgData}
              width={this.state.editorWidth}
              height={this.state.editorHeight}
              border={20}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={this.state.scaleFactor}
              rotate={this.state.rotateValue}
            />
          </div>
        </div>

        <div
          style={{
            display: "block",
            border: "2px solid blue",
            display: "none",
          }}
        >
          <canvas
            width={this.state.editorWidth + 20}
            height={this.state.editorHeight + 20}
            ref="canvasForDownload"
            id="canvasForDownload"
          ></canvas>
        </div>

        <div className="canvas" style={this.state.selectorVisibleStyle}>
          <Cropper
            imgData={this.state.imgCropData}
            completeCrop={(croppedImg) => {
              this.completeCrop(croppedImg);
            }}
            cropSubmitBtn={this.state.cropSubmitBtn}
          />
        </div>

        <div className="editorOptions">
          <div className="imageOption">
            <label htmlFor="fileBrowser"> Upload Image </label> <br />
            <input
              type="file"
              ref="fileBrowser"
              id="fileBrowser"
              onChange={this.loadFile.bind(this)}
              style={{ display: "inline-block" }}
            />
          </div>

          <div className="imageOption">
            <label htmlFor="crop"> Crop </label> <br />
            <button
              type="button"
              id="crop"
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
              onClick={this.cropImg}
            >
              {" "}
              Crop{" "}
            </button>
          </div>

          <div className="imageOption">
            <label htmlFor="rotateTxt"> Rotate </label> <br />
            <input
              type="number"
              id="rotateTxt"
              ref="rotationTxt"
              disabled={this.state.isToolsDisabled}
            />
            <button
              type="button"
              onClick={(degrees) => {
                this.setRotateValue();
              }}
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
            >
              {" "}
              Rotate{" "}
            </button>
            <RotateSlider setValue={this.setRotateValue2} />
          </div>

          <div className="imageOption">
            <label htmlFor="resize"> Resize </label> <br />
            <button
              type="button"
              id="resize"
              onClick={(percentage) => {
                this.setScaleFactor(-1);
              }}
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
            >
              {" "}
              -{" "}
            </button>
            <button
              type="button"
              onClick={(percentage) => {
                this.setScaleFactor(1);
              }}
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
            >
              {" "}
              +{" "}
            </button>
          </div>

          <div className="imageOption">
            <label htmlFor="download"> Download Image </label> <br />
            <a id="download" ref="downloadBtn" onClick={this.downloadImg}>
              {" "}
              <button disabled={this.state.isSelectDisabled}>
                {" "}
                Download Image{" "}
              </button>{" "}
            </a>
          </div>

          <div className="imageOption">
            <button type="reset" onClick={this.resetEditor}>
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default ImageEditor;
