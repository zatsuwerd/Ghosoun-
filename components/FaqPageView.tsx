'use client';

import { useState } from 'react';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  filterFaqItems,
  type FaqCategory,
} from '@/lib/store-pages';

interface FaqPageViewProps {
  onNavigateContact: () => void;
}

export default function FaqPageView({ onNavigateContact }: FaqPageViewProps) {
  const [category, setCategory] = useState<FaqCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const visibleItems = filterFaqItems(FAQ_ITEMS, category, searchQuery);

  return (
    <section aria-labelledby="faq-page-heading" className="pb-16">
      <div className="bg-[#F2EFE9] border-b border-[#E2DDD2] py-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B43]">
            Botanical Help Center
          </p>
          <h1
            id="faq-page-heading"
            className="font-serif text-4xl sm:text-5xl font-semibold text-[#0D2F32]"
          >
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#526162]">
            Answers covering single-origin sourcing, safe carrier oil dilution ratios, dark glass
            preservation, and shipping.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-10 space-y-6">
        {/* Search + Category Controls */}
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="faq-keyword-search" className="sr-only">
              Search frequently asked questions
            </label>
            <Search
              className="w-4 h-4 text-[#526162] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="faq-keyword-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter questions by keyword (e.g. dilution, dark glass, single-origin)..."
              className="w-full ps-10 pe-4 py-3 text-sm bg-white border border-[#E2DDD2] rounded-md text-[#142224] placeholder:text-[#526162] focus:outline-none focus:border-[#217C42]"
            />
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
            {FAQ_CATEGORIES.map((cat) => {
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
        </div>

        {/* Accordion List */}
        {visibleItems.length === 0 ? (
          <div className="p-10 bg-white border border-[#E2DDD2] rounded-md text-center space-y-4">
            <p className="font-serif text-2xl text-[#0D2F32]">No matching questions found</p>
            <p className="text-sm text-[#526162]">
              Try clearing your filter or send your question directly to our botanical concierge.
            </p>
            <button
              type="button"
              onClick={onNavigateContact}
              className="inline-flex items-center gap-2 px-5 min-h-[42px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Contact Concierge
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#E2DDD2] rounded-md overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="block text-[11px] font-medium text-[#C59B43] mb-0.5">
                        {item.category}
                      </span>
                      <span className="font-serif text-lg sm:text-xl font-semibold text-[#0D2F32]">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#526162] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#217C42]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-panel-${item.id}`}
                      className="px-5 pb-5 pt-1 text-sm sm:text-base text-[#526162] leading-relaxed border-t border-[#E2DDD2]/60"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
