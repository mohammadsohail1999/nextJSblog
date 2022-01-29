import Link from "next/link";

function PostFeed({ posts, admin }) {
  return (
    posts &&
    posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />)
  );
}

const PostItem = ({ post, admin }) => {
  const wordCount = post?.content.trim().split(/\s+/g).length;

  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          {" "}
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <a>{post.title}</a>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span> 💟 {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
};

export default PostFeed;
