import Head from "next/head";
import AuthCheck from "../../components/AuthCheck";
import CreateNewPost from "../../components/CreateNewPost";
import PostList from "../../components/PostList";
import styles from "../../styles/Admin.module.css";

export default function AdminPostpage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}
