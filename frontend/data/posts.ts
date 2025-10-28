// data/posts.ts
export type Post = {
  title: string;
  slug: string;
  description: string;
  date: string; // ISO or YYYY-MM-DD
  category: string;
  tags: string[];
  author: string;
  readTime: string; // e.g. "5 min"
  featured?: boolean;
};

const posts: Post[] = [
  {
    title: "Top 5 Savings Accounts in 2025",
    slug: "top-5-savings-accounts-2025",
    description:
      "We compared interest rates, fees, and mobile features to bring you the best savings accounts.",
    date: "2025-08-01",
    category: "Savings",
    tags: ["rates", "savings", "2025"],
    author: "Jane Doe",
    readTime: "6 min",
    featured: true,
  },
  {
    title: "How to Choose a Student Bank Account",
    slug: "choose-student-bank-account",
    description:
      "A breakdown of the best student banking options with low fees and easy mobile banking.",
    date: "2025-07-12",
    category: "Students",
    tags: ["students", "accounts"],
    author: "Ahmed Khan",
    readTime: "4 min",
  },
  {
    title: "Digital Banking vs Traditional Banks",
    slug: "digital-vs-traditional-banks",
    description:
      "Should you switch to digital-only banking? Here are the pros, cons and safety tips.",
    date: "2025-06-20",
    category: "Digital Banking",
    tags: ["digital", "security"],
    author: "Leah Smith",
    readTime: "7 min",
  },
  {
    title: "Best Mobile Banking Apps of 2025",
    slug: "best-mobile-banking-apps-2025",
    description:
      "We evaluated mobile experience, features, security, and support across major banks.",
    date: "2025-05-30",
    category: "Digital Banking",
    tags: ["apps", "reviews"],
    author: "Jane Doe",
    readTime: "5 min",
    featured: true,
  },
  {
    title: "Low-fee Checking Accounts for Everyday Use",
    slug: "low-fee-checking-accounts",
    description:
      "Find checking accounts with the lowest fees and good ATM networks.",
    date: "2025-04-10",
    category: "Checking",
    tags: ["fees", "checking"],
    author: "Samir Patel",
    readTime: "5 min",
  },
  {
    title: "How to Avoid Hidden Bank Fees",
    slug: "avoid-hidden-bank-fees",
    description:
      "Practical tips to spot and avoid common bank fees you may be paying unknowingly.",
    date: "2025-02-17",
    category: "Guides",
    tags: ["fees", "guides"],
    author: "Leah Smith",
    readTime: "3 min",
  },
];

export default posts;
