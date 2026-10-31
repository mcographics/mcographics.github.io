'use client';

import { useEffect, useMemo, useState } from "react";
import type { BlogArchivePost } from "./posts";
import { loadArchiveSort, orderRecords, saveArchiveSort, sortOptions } from "../archive-sort.mjs";

export default function PostArchive({ posts, heading = "All articles", startIndex = 1, page = 1, pageSize }: { posts: BlogArchivePost[]; heading?: string; startIndex?: number; page?: number; pageSize?: number }) {
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => { setSortOrder(loadArchiveSort("newest")); }, []);

  const orderedPosts = useMemo(() => orderRecords(posts, sortOrder), [posts, sortOrder]);
  const pageCount = pageSize ? Math.max(1, Math.ceil(orderedPosts.length / pageSize)) : 1;
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const visiblePosts = pageSize
    ? orderedPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : orderedPosts;
  const numberStart = pageSize ? (currentPage - 1) * pageSize + 1 : startIndex;

  return <>
    <div className="post-archive-controls">
      <label htmlFor="post-archive-sort">Sort articles</label>
      <select id="post-archive-sort" aria-describedby="post-archive-sort-note" value={sortOrder} onChange={(event) => {
        const value = event.target.value;
        setSortOrder(value);
        saveArchiveSort(value);
      }}>
        {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <small id="post-archive-sort-note">Applies to this archive, category, or topic and is saved for your next visit.</small>
    </div>
    <div className="post-archive" aria-label={heading}>
      {visiblePosts.map((post, index) => <a className="post-card" href={`/blog/${post.slug}`} key={post.slug}>
        <span className="post-number">{String(index + numberStart).padStart(2, "0")}</span>
        <img src={post.bannerImage} alt={post.bannerAlt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
        <div><p className="post-meta"><span>{post.category}</span> {post.displayDate} · {post.readingTime}</p><h3>{post.title}</h3><p>{post.description}</p><div className="post-tags">{post.tags.map((tag, tagIndex) => <span key={tag}>{tagIndex ? "· " : ""}{tag}</span>)}</div><b>Read article <span>→</span></b></div>
      </a>)}
    </div>
  </>;
}
