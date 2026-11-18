'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check } from 'lucide-react';
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  filterBlogArticles,
  type BlogArticle,
  type BlogCategory,
} from '@/lib/store-pages';

interface BlogPageViewProps {
  initialArticleSlug?: string | null;
  onShopNow: () => void;
}

export default function BlogPageView({ initialArticleSlug, onShopNow }: BlogPageViewProps) {
  const [category, setCategory] = useState<BlogCategory>('All');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(() => {
    if (!initialArticleSlug) return null;
    return BLOG_ARTICLES.find((a) => a.slug === initialArticleSlug) ?? null;
  });

  const visibleArticles = filterBlogArticles(BLOG_ARTICLES, category);

  if (selectedArticle) {
    return (
      <article aria-labelledby="article-detail-heading" className="pb-16">
        <div className="bg-[#F2EFE9] border-b border-[#E2DDD2] py-12 px-4 sm:px-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C59B43] hover:text-[#0D2F32] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to Botanical Journal
            </button>
            <h1
              id="article-detail-heading"
              className="font-serif text-3xl sm:text-5xl font-semibold text-[#0D2F32] leading-tight"
            >
              {selectedArticle.title}
            </h1>
            <div className="text-xs text-[#526162] flex flex-wrap items-center gap-2">
              <span>{selectedArticle.category}</span>
              <span aria-hidden="true">&middot;</span>
              <span>By {selectedArticle.author}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{selectedArticle.publishedAt}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="tabular-nums">{selectedArticle.readMinutes} min read</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-10 space-y-8">
          <div className="space-y-5 text-base text-[#142224] leading-relaxed">
            {selectedArticle.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="bg-[#F2EFE9] border border-[#E2DDD2] rounded-md p-6 space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#0D2F32]">Key Formulator Notes</h2>
            <ul className="space-y-2.5 text-sm text-[#526162]">
              {selectedArticle.keyTakeaways.map((note) => (
                <li key={note} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#217C42] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-[#E2DDD2] flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 px-5 min-h-[42px] rounded border border-[#E2DDD2] bg-white text-xs font-semibold uppercase tracking-wider text-[#0D2F32] hover:border-[#C59B43] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              All Journal Entries
            </button>
            <button
              type="button"
              onClick={onShopNow}
              className="inline-flex items-center gap-2 px-5 min-h-[42px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] cursor-pointer"
            >
              Shop Featured Oils
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section aria-labelledby="blog-page-heading" className="pb-16">
      <div className="bg-[#F2EFE9] border-b border-[#E2DDD2] py-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B43]">
            The Botanical Journal
          </p>
          <h1
            id="blog-page-heading"
            className="font-serif text-4xl sm:text-5xl font-semibold text-[#0D2F32]"
          >
            Aromatherapy &amp; Sourcing Notes
          </h1>
          <p className="text-sm sm:text-base text-[#526162]">
            Practical guides on essential oil dilution, cold-pressed extraction craft, and dark
            glass botanical storage.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-8">
        <div className="flex flex-wrap gap-2 justify-center" role="tablist" aria-label="Journal topics">
          {BLOG_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat)}
                className={`px-4 min-h-[40px] rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#0D2F32] text-[#FAF9F5]'
                    : 'bg-white text-[#526162] border border-[#E2DDD2] hover:border-[#C59B43]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleArticles.map((article) => (
            <article
              key={article.id}
              className="flex flex-col bg-white border border-[#E2DDD2] rounded-md overflow-hidden hover:border-[#C59B43] transition-colors"
            >
              <div className="aspect-[16/10] bg-[#F2EFE9] border-b border-[#E2DDD2] flex flex-col items-center justify-center p-6 text-center">
                <BookOpen className="w-6 h-6 text-[#217C42] mb-2 stroke-[1.6]" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C59B43]">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-[#526162] mb-2">
                  <span>{article.publishedAt}</span>
                  <span aria-hidden="true"> &middot; </span>
                  <span className="tabular-nums">{article.readMinutes} min read</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#0D2F32] leading-snug mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-[#526162] leading-relaxed flex-1 mb-5">
                  {article.excerpt}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="inline-flex items-center gap-2 self-start px-4 min-h-[40px] rounded border border-[#0D2F32] text-[#0D2F32] text-xs font-semibold uppercase tracking-wider hover:bg-[#0D2F32] hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
