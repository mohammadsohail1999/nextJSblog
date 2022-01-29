import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db, getUserWithUserName, postToJSON } from "../../lib/firebase";
import { getUserPost } from "../../lib/hooks";
import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import Link from "next/link";
import { useRouter } from "next/router";
import HeartButton from "../../components/HeartButton";
import AuthCheck from "../../components/AuthCheck";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUserName(username);

  let post;
  let path;

  let postRef;

  if (userDoc) {
    postRef = collection(db, "users", userDoc.ref.id, "posts");

    post = postToJSON(await getDoc(doc(postRef, slug)));

    if (!post) {
      return {
        notFound: true,
      };
    } else {
      path = doc(db, "users", userDoc.ref.id, "posts", slug).path;
    }
  } else {
    // this will tell next to render 404 page
    return {
      notFound: true,
    };
  }

  return {
    props: { post, path },
    // when new request comes it will re fetch
    revalidate: 5000,
  };
}

export default function PostPage(props) {
  const { post: realTimePost } = getUserPost(props.path);

  const post = realTimePost || props.post;

  const { username } = useRouter().query;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>❤️ Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={props.path} />
        </AuthCheck>
        {post.username === username ? (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn">Edit</button>
          </Link>
        ) : null}
      </aside>
    </main>
  );
}

export async function getStaticPaths() {
  const postsRef = collectionGroup(db, "posts");
  const posts = await getDocs(postsRef);

  const paths = posts.docs.map((doc) => {
    const { slug, username } = doc.data();
    return { params: { username, slug } };
  });

  return {
    // must be in this format:
    //paths:[{params:{username,slug}}]
    paths,
    // fallbacks to server side rendering
    fallback: "blocking",
  };
}
