import { UserContext } from "../lib/context";
import { useContext } from "react";
import { getUserPosts } from "../lib/hooks";
import PostFeed from "./PostFeed";

function PostList() {
  const { user, username } = useContext(UserContext);

  const [posts] = getUserPosts(user.uid);

  return (
    <>
      <h1>Manage Your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

export default PostList;
