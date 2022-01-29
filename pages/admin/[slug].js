import MetaTags from "../../components/MetaTags";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import PostManager from "../../components/PostManager";

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}
