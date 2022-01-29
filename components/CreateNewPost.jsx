import { useRouter } from "next/router";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import lodash from "lodash";
import styles from "../styles/Admin.module.css";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";

const CreateNewPost = () => {
  const router = useRouter();
  const { user, username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  //ensure slug is url safe
  const slug = encodeURI(lodash.kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "users", user.uid, "posts", slug), {
      slug,
      title,
      username,
      uid: user.uid,
      published: false,
      content: "# Hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    });

    toast.success("Post Created");

    // Imperative navigation after saving doc
    router.push(`/admin/${slug}`);
  };

  return (
    <>
      <form onSubmit={createPost}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article!"
          className={styles.input}
        />
        <p>
          <strong>Slug: {slug}</strong>
          <button type="submit" disabled={!isValid} className="btn-green">
            Create New Post
          </button>
        </p>
      </form>
    </>
  );
};

export default CreateNewPost;
