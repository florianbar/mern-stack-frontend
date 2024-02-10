import React, { useRef, useState, useEffect } from "react";

const ImageUpload = (props) => {
  const filePickerRef = useRef();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;

    if (event.target.files || event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      fileIsValid = true;
      setFile(pickedFile);
      setIsValid(fileIsValid);
    } else {
      fileIsValid = false;
      setIsValid(fileIsValid);
    }
    props.onInput(pickedFile, fileIsValid);
  };

  const pickImageHandler = (event) => {
    filePickerRef.current.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {props.label}
      </label>
      <input
        ref={filePickerRef}
        type="file"
        id={props.id}
        name={props.name}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
        className="hidden"
      />

      <div className="mb-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-48 h-48 border border-slate-500"
          />
        ) : (
          <p className="text-gray-700 text-sm">Please pick an image.</p>
        )}
      </div>

      <button
        type="button"
        className="bg-red-500 text-white p-3 rounded"
        onClick={pickImageHandler}
      >
        Pick photo
      </button>
      {!isValid && <p className="text-red-500"> {props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
