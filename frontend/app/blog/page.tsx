"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import postsData, { Post } from "../../data/posts";

// App Router page: app/blog/page.tsx
// Style: S1 - Clean Corporate Banking

const cardMotion = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-yellow-500" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rounded ? "currentColor" : "none"} stroke="currentColor" className={i < rounded ? "" : "text-slate-300"}>
          <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
        </svg>
      ))}
    </div>
  );
}

// Helper: derive two concise highlights from post if not explicitly provided
function deriveHighlights(p: Post) {
  if ((p as any).highlights && Array.isArray((p as any).highlights) && (p as any).highlights.length >= 1) return (p as any).highlights.slice(0, 2);

  const bullets: string[] = [];
  // 1) Tags -> descriptive bullet
  if (p.tags && p.tags.length > 0) bullets.push(p.tags.slice(0, 2).map((t) => `#${t}`).join(" • "));

  // 2) first short clause of description
  const first = p.description.split(/[.!?]\s/)[0];
  if (first && first.length > 12) bullets.push(first.length > 80 ? `${first.slice(0, 77)}...` : first);

  // Fallbacks
  while (bullets.length < 2) bullets.push("Trusted review & clear comparison");
  return bullets.slice(0, 2);
}

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"newest" | "oldest" | "az">("newest");
  const [loading, setLoading] = useState(true);

  // side sheet preview state
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    postsData.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    postsData.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let list = postsData.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
    }

    if (category) list = list.filter((p) => p.category === category);
    if (tag) list = list.filter((p) => p.tags.includes(tag));

    list.sort((a, b) => {
      if (sort === "newest") return +new Date(b.date) - +new Date(a.date);
      if (sort === "oldest") return +new Date(a.date) - +new Date(b.date);
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [query, category, tag, sort]);

  return (
    <main className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate-600 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-800">Blog</span>
      </nav>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Bank Reviews Blog</h1>
          <p className="text-slate-600 mt-1">Guides, reviews, and comparisons to help you choose the right bank.</p>
        </div>

        <div className="flex gap-3 items-center w-full sm:w-auto">
          <input
            aria-label="Search articles"
            placeholder="Search posts, authors, keywords..."
            className="border border-blue-100 rounded-lg px-4 py-2 w-full sm:w-80"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            aria-label="Sort posts"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="border border-blue-100 rounded-lg px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Title A → Z</option>
          </select>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-semibold text-slate-800">Categories</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    setCategory(null);
                    setTag(null);
                  }}
                  className={`w-full text-left px-2 py-1 rounded ${category === null ? "bg-blue-50" : ""}`}
                >
                  All ({postsData.length})
                </button>
              </li>

              {categories.map(([cat, count]) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setCategory(cat);
                      setTag(null);
                    }}
                    className={`w-full text-left px-2 py-1 rounded ${category === cat ? "bg-blue-50" : ""}`}
                  >
                    {cat} ({count})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-semibold text-slate-800">Tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setTag(null)} className={`text-sm px-3 py-1 border rounded ${tag === null ? "bg-blue-50" : ""}`}>
                All
              </button>

              {tags.map((t) => (
                <button key={t} onClick={() => setTag(t)} className={`text-sm px-3 py-1 border rounded ${tag === t ? "bg-blue-50" : ""}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="text-sm font-semibold text-slate-800">Newsletter</h3>
            <p className="text-sm text-slate-600 mt-2">Get monthly banking tips and top reviews in your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
              <input placeholder="you@example.com" className="flex-1 px-3 py-2 rounded border border-blue-100" />
              <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">
                Join
              </button>
            </form>
          </div>
        </aside>

        {/* Main content */}
        <section className="lg:col-span-3 space-y-6">
          {/* Featured */}
          {postsData.some((p) => p.featured) && (
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {postsData.filter((p) => p.featured).map((p) => (
                  <motion.article key={p.slug} className="p-4 border rounded-lg bg-white shadow-sm cursor-pointer" whileHover={{ y: -4 }} onClick={() => setPreviewPost(p)}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">{p.category}</span>
                        <h3 className="text-lg font-semibold text-blue-700 mt-2">{p.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{p.description}</p>
                        <div className="mt-3 text-xs text-slate-500 flex items-center gap-3">
                          <span>{p.author}</span>
                          <span>•</span>
                          <span>{formatDate(p.date)}</span>
                          <span>•</span>
                          <span>{p.readTime}</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col items-end gap-2">
                        <Stars value={(p as any).rating || 4} />
                        <Link href={`/blog/${p.slug}`} className="text-blue-600 font-medium hover:underline">Read →</Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* All posts */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">All Posts</h2>
              <div className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse p-5 border rounded-xl bg-white" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-slate-500">No posts found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filtered.map((p) => (
                      <BlogCard key={p.slug} post={p} onOpen={() => setPreviewPost(p)} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* CTA Newsletter wide */}
          <div className="p-6 border rounded-lg bg-blue-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Want the monthly best-of banking newsletter?</h3>
              <p className="text-sm text-slate-600 mt-1">Top picks, new features, and money saving tips — straight to your inbox.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input placeholder="you@example.com" className="px-3 py-2 rounded border border-blue-100 w-full sm:w-64" />
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Subscribe</button>
            </form>
          </div>
        </section>
      </div>

      {/* Preview Side Sheet */}
      <AnimatePresence>
        {previewPost && <PreviewSheet post={previewPost} onClose={() => setPreviewPost(null)} />}
      </AnimatePresence>
    </main>
  );
}

// --------------------- BlogCard component ---------------------
function BlogCard({ post, onOpen }: { post: Post; onOpen: () => void }) {
  const highlights = deriveHighlights(post);

  return (
    <motion.article
      layout
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={cardMotion}
      transition={{ duration: 0.22 }}
      whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(2,6,23,0.08)" }}
      className="border border-blue-100 rounded-xl p-5 shadow-sm bg-white flex flex-col cursor-pointer"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">{post.category}</span>
        { (post as any).isNew && <span className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">New</span> }
      </div>

      <h3 className="text-lg font-semibold text-blue-700 mt-3">{post.title}</h3>

      <p className="text-sm text-slate-600 mt-2 line-clamp-3">{post.description}</p>

      <ul className="mt-3 text-sm text-slate-700 space-y-1">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span className="leading-tight">{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{post.author}</span>
          <span>•</span>
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <Stars value={(post as any).rating || 4} />
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {post.tags.slice(0, 3).map((t) => (
            <button key={t} onClick={(e) => { e.stopPropagation(); /* allow clicking tag without opening sheet */ }} className="text-[11px] px-2 py-1 border rounded text-slate-600 hover:bg-blue-50">#{t}</button>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 text-sm font-medium hover:underline">
          Read →
        </Link>
      </div>
    </motion.article>
  );
}

// --------------------- PreviewSheet component ---------------------
function PreviewSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <motion.button
        aria-label="close preview"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black"
        style={{ WebkitTapHighlightColor: "transparent" }}
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative ml-auto w-full sm:w-3/5 md:w-2/5 lg:w-1/3 bg-white shadow-2xl h-full overflow-y-auto p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">{post.category}</span>
            <h2 className="text-xl font-bold text-slate-900 mt-3">{post.title}</h2>
            <div className="mt-2 text-sm text-slate-500 flex items-center gap-3">
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Stars value={(post as any).rating || 4} />
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Close ✕</button>
          </div>
        </div>

        <div className="mt-6 text-slate-700 space-y-4">
          <p>{post.description}</p>

          {/* larger highlights */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Key points</h4>
            <ul className="mt-2 list-disc list-inside text-sm text-slate-700">
              {deriveHighlights(post).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-800">Tags</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 border rounded text-slate-600">#{t}</span>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Link href={`/blog/${post.slug}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Open Full Article</Link>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
