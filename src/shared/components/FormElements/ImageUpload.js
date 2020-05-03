import React, { useRef, useState, useEffect } from "react";

// Components
import Button from "../FormElements/Button";

// Styles
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  // NOTE: We can use this 'useRef' to make a connection to the input
  // (i.e. that DOM element). Then, when we have access to this input,
  // we can trigger events on it using the useRef.
  const filePickerRef = useRef();

  // NOTE: Whenever we pick a new file, we want this to run. So it
  // listens to the 'file' state to see if it's updated.
  useEffect(() => {
    // If there is no file, then just return.
    if (!file) {
      return;
    }
    // NOTE: This 'FileReader' is built into all modern browsers
    // It allows us to get details from files.
    const fileReader = new FileReader();
    // We need to run this 'onload' whenever the reading of the file is
    // done. This is because the 'FileReader' API is quite clunky.
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
