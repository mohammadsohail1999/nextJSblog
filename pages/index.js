import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  Timestamp,
} from "firebase/firestore";
import { db, postToJSON } from "../lib/firebase";
import { useState } from "react";
import PostFeed from "../components/PostFeed";

const LIMIT = 1;

export async function getServerSideProps(context) {
  // query all the subselections no matter how much it is nested
  const postsQuery = query(
    collectionGroup(db, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const posts = await (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const newPostquery = query(
      collectionGroup(db, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = await (
      await getDocs(newPostquery)
    ).docs.map((doc) => doc.data());

    setPosts([...posts, ...newPosts]);
    setLoading(false);
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}
      <Loader show={loading} />
      {postsEnd && "you have reached the end!"}
    </main>
  );
}
