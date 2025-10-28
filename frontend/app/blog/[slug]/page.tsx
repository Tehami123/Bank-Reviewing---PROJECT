import React from "react";
import Link from "next/link";
import postsData, { Post } from "../../../data/posts";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = postsData.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Bank Reviews`,
    description: post.description,
    openGraph: {
      title: `${post.title} — Bank Reviews`,
      description: post.description,
    },
  };
}

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

// Simple Table component
function ComparisonTable({ banks }: { banks: string[] }) {
  const rows = [
    { label: "Interest Rate", values: banks.map(() => "1.2%") },
    { label: "Monthly Fee", values: banks.map(() => "$0") },
    { label: "Mobile App Rating", values: banks.map(() => "4.5/5") },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className="p-3 border-b">Feature</th>
            {banks.map((b) => (
              <th key={b} className="p-3 border-b">{b}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t">
              <td className="p-3 font-medium">{r.label}</td>
              {r.values.map((v, i) => (
                <td key={i} className="p-3">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Simple TOC generator from markdown-style headings (h2/h3)
function getToc(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const items: { id: string; text: string; level: number }[] = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      const text = h2[1].trim();
      items.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text, level: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      items.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text, level: 3 });
    }
  }
  return items;
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = postsData.find((p) => p.slug === params.slug);
  if (!post) {
    return (
      <main className="min-h-screen p-8 bg-white">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="mt-4 text-slate-600">We couldn't find the article you're looking for.</p>
        <Link href="/blog" className="mt-4 inline-block text-blue-600 underline">Back to blog</Link>
      </main>
    );
  }

  // use post.content if available; otherwise form a simple article body from description + placeholders
  const content = (post as any).content || `# Overview\n\n${post.description}\n\n## Why this matters\n\nDetailed analysis goes here.\n\n## Comparison\n\n(Comparison table below)\n`;

  const toc = getToc(content);

  const banksCompared = (post as any).banksCompared || post.tags.slice(0, 3);
  const rating = (post as any).rating || 4.2;
  const pros: string[] = (post as any).pros || ["Low fees", "Strong mobile app"];
  const cons: string[] = (post as any).cons || ["Limited branches", "Average interest rate"];

  return (
    <main className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-8">
          <div className="mb-4 text-sm text-slate-600">
            <Link href="/" className="hover:underline">Home</Link> <span className="mx-2">/</span> <Link href="/blog" className="hover:underline">Blog</Link> <span className="mx-2">/</span> <span className="font-medium text-slate-800">{post.title}</span>
          </div>

          <header className="bg-white border rounded-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">{post.category}</span>
                <h1 className="text-3xl font-bold text-slate-900 mt-3">{post.title}</h1>
                <div className="mt-3 text-sm text-slate-600 flex items-center gap-3">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-3">
                <div className="text-sm text-slate-500">Rating</div>
                <div className="flex items-center gap-2">
                  <Stars value={rating} />
                  <div className="text-sm font-semibold">{rating.toFixed(1)}</div>
                </div>
                <Link href={`/blog/${post.slug}/compare`} className="mt-3 inline-block px-3 py-2 bg-blue-600 text-white rounded">Compare Banks</Link>
              </div>
            </div>

            <p className="mt-6 text-slate-700">{post.description}</p>
          </header>

          {/* Article body - render markdown-like content simply */}
          <section className="mt-6 prose max-w-none text-slate-700">
            {/* Very basic markdown -> html handling for headings and paragraphs */}
            {content.split(/\n\n+/).map((block, i) => {
              if (block.startsWith("# ")) return <h2 key={i}>{block.replace(/^#\s+/, "")}</h2>;
              if (block.startsWith("## ")) return <h3 key={i}>{block.replace(/^##\s+/, "")}</h3>;
              if (block.startsWith("### ")) return <h4 key={i}>{block.replace(/^###\s+/, "")}</h4>;
              return <p key={i}>{block}</p>;
            })}

            {/* Comparison table */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Comparison</h3>
              <ComparisonTable banks={banksCompared} />
            </div>

            {/* Pros & Cons */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Pros</h4>
                <ul className="mt-3 list-disc list-inside">
                  {pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Cons</h4>
                <ul className="mt-3 list-disc list-inside">
                  {cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Author box */}
          <footer className="mt-8 border-t pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div>
                <div className="font-semibold">{post.author}</div>
                <div className="text-sm text-slate-600">Staff writer — Bank Reviews</div>
              </div>
            </div>
          </footer>
        </article>

        {/* Right column: TOC + Sticky CTA */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* TOC */}
            {toc.length > 0 && (
              <div className="p-4 border rounded-lg">
                <div className="text-sm font-semibold text-slate-800">On this page</div>
                <nav className="mt-3 text-sm text-slate-600">
                  <ul className="space-y-2">
                    {toc.map((t) => (
                      <li key={t.id} className={`ml-${t.level === 3 ? "4" : "0"}`}>
                        <a href={`#${t.id}`} className="hover:underline">{t.text}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="text-sm font-semibold">Compare these banks</div>
              <div className="mt-3 space-y-2">
                {banksCompared.map((b) => (
                  <div key={b} className="text-sm text-slate-700">{b}</div>
                ))}
              </div>
              <Link href={`/blog/${post.slug}/compare`} className="mt-4 inline-block px-3 py-2 bg-blue-600 text-white rounded">Open Comparison</Link>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-sm font-semibold">Share this article</div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-2 border rounded text-sm">Copy link</button>
                <button className="px-3 py-2 border rounded text-sm">Tweet</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
