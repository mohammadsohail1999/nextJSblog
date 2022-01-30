import React, { useState } from "react";
import { storage } from "../lib/firebase";
import {
  getDownloadURL,
  ref,
  TaskEvent,
  uploadBytesResumable,
} from "firebase/storage";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const ImageUploader = ({ uid }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadHandler = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `blog/${uid}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        const progress =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setUploading(true);
        setProgress(progress);
        switch (snapShot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        toast.error("Error ocurred while Uploading 😞");
        setUploading(false);
        setProgress(0);
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploading(false);
          setProgress(0);
          setDownloadURL(downloadURL);
        });
      }
    );
  };

  return (
    <div className="box">
      <Loader show={uploading} progress={progress} />

      {!uploading && (
        <>
          <label for="avatar" className="btn">
            📸 Upload Img:
          </label>
          <input
            onChange={uploadHandler}
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
          />
          {downloadURL && (
            <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUploader;
