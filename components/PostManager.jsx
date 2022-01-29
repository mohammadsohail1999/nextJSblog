import { useRouter } from "next/router";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../lib/context";
import { useGetRealtimePost } from "../lib/hooks";
import PostForm from "./PostForm";
import styles from "../styles/Admin.module.css";
import Link from "next/link";

const PostManager = () => {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useContext(UserContext);
  const [post] = useGetRealtimePost(user.uid, slug);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              uid={user.uid}
              slug={slug}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

export default PostManager;
