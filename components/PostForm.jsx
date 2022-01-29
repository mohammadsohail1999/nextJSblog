import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import styles from "../styles/Admin.module.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { db } from "../lib/firebase";
import { PostContentSchema } from "../schemas/PostContentSchema";
import ImageUploader from "./ImageUploader";

function PostForm({ uid, slug, preview, defaultValues }) {
  const [initialValues] = useState(defaultValues);

  const { values, handleSubmit, getFieldProps, errors, touched } = useFormik({
    initialValues: {
      content: initialValues.content,
      published: initialValues.published,
    },
    onSubmit: ({ content, published }) => {
      updatePost({ content, published });
      // console.log(values);
    },
    validationSchema: PostContentSchema,
  });

  const updatePost = async ({ content, published }) => {
    const postRef = doc(db, "users", uid, "posts", slug);

    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    toast.success("Post updated Succesfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{values.content}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader uid={uid} />
        <textarea {...getFieldProps("content")}></textarea>

        {touched.content && errors.content && (
          <p className="text-danger">{errors.content}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...getFieldProps("published")}
          />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default PostForm;
