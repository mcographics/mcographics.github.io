import type { BlogPost } from "./posts";

export default function PostArchive({ posts, heading = "All articles" }: { posts: BlogPost[]; heading?: string }) {
  return <div className="post-archive" aria-label={heading}>
    {posts.map((post, index) => <a className="post-card" href={`/blog/${post.slug}`} key={post.slug}>
      <span className="post-number">{String(index + 1).padStart(2, "0")}</span>
      <img src={post.bannerImage} alt={post.bannerAlt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
      <div><p className="post-meta"><span>{post.category}</span> {post.displayDate} · {post.readingTime}</p><h3>{post.title}</h3><p>{post.description}</p><div className="post-tags">{post.tags.map((tag, tagIndex) => <span key={tag}>{tagIndex ? "· " : ""}{tag}</span>)}</div><b>Read article <span>→</span></b></div>
    </a>)}
  </div>;
}
