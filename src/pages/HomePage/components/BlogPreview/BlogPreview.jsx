import React from "react";
import { useLanguage } from "~/contexts/LanguageProvider";
import thumb1 from "~/assets/images/homepage/gallery1.webp";
import thumb2 from "~/assets/images/homepage/gallery2.webp";
import thumb3 from "~/assets/images/homepage/gallery3.webp";
import thumb4 from "~/assets/images/homepage/gallery4.webp";
import thumb5 from "~/assets/images/homepage/gallery5.webp";
import thumb6 from "~/assets/images/homepage/gallery6.webp";

const BlogCard = ({ post, t }) => (
  <article className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="h-44 md:h-48 w-full overflow-hidden">
      <img
        src={post.img}
        alt={post.title}
        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
      />
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span>{post.date}</span>
        <span>•</span>
        <span>{post.tags.join(", ")}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {post.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <button className="text-sm text-indigo-600 hover:underline">
          {t("homepage.blog.readMore")} →
        </button>
        <div className="text-sm text-gray-400">5 min read</div>
      </div>
    </div>
  </article>
);

const BlogPreview = () => {
  const { t } = useLanguage();

  const samplePosts = [
    {
      id: 1,
      title: t("homepage.blog.posts.post1.title"),
      date: "Oct 10, 2025",
      tags: [
        t("homepage.blog.tags.classics"),
        t("homepage.blog.tags.readingList")
      ],
      excerpt: t("homepage.blog.posts.post1.excerpt"),
      img: thumb1
    },
    {
      id: 2,
      title: t("homepage.blog.posts.post2.title"),
      date: "Sep 22, 2025",
      tags: [t("homepage.blog.tags.home"), t("homepage.blog.tags.bookshelf")],
      excerpt: t("homepage.blog.posts.post2.excerpt"),
      img: thumb2
    },
    {
      id: 3,
      title: t("homepage.blog.posts.post3.title"),
      date: "Oct 01, 2025",
      tags: [
        t("homepage.blog.tags.newReleases"),
        t("homepage.blog.tags.recommendations")
      ],
      excerpt: t("homepage.blog.posts.post3.excerpt"),
      img: thumb3
    },
    {
      id: 4,
      title: t("homepage.blog.posts.post4.title"),
      date: "Aug 18, 2025",
      tags: [
        t("homepage.blog.tags.authors"),
        t("homepage.blog.tags.interviews")
      ],
      excerpt: t("homepage.blog.posts.post4.excerpt"),
      img: thumb4
    },
    {
      id: 5,
      title: t("homepage.blog.posts.post5.title"),
      date: "Jul 30, 2025",
      tags: [t("homepage.blog.tags.home"), t("homepage.blog.tags.design")],
      excerpt: t("homepage.blog.posts.post5.excerpt"),
      img: thumb5
    },
    {
      id: 6,
      title: t("homepage.blog.posts.post6.title"),
      date: "Jun 12, 2025",
      tags: [t("homepage.blog.tags.home"), t("homepage.blog.tags.design")],
      excerpt: t("homepage.blog.posts.post6.excerpt"),
      img: thumb6
    }
  ];

  return (
    <section className="container py-12 px-4">
      <h2 className="text-3xl text-center font-bold">
        {t("homepage.blog.title")}
      </h2>
      <p className="text-center text-gray-600 mt-2 mb-8">
        {t("homepage.blog.subtitle")}
      </p>
      <div className="flex items-center justify-end mb-6">
        <button className="text-sm text-indigo-600 hover:underline">
          {t("homepage.blog.allPosts")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePosts.map((p) => (
          <BlogCard key={p.id} post={p} t={t} />
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
