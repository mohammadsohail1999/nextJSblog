import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { db, getUserWithUserName, postToJSON } from "../../lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  where,
  query as firebaseQuery,
} from "firebase/firestore";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUserName(username);

  let user = null;
  let posts = null;

  if (!userDoc) {
    // this will tell next to render 404 page  
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    user = userDoc.data();
    const postsCollectionRef = collection(db, "users", userDoc.ref.id, "posts");
    const postsQuery = firebaseQuery(
      postsCollectionRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = await (await getDocs(postsQuery)).docs.map((el) => postToJSON(el));
  }

  return {
    props: { user, posts },
    // it is passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
