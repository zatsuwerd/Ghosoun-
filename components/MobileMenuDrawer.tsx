'use client';

import Image from 'next/image';
import { X, ChevronRight, Leaf, ShieldCheck } from 'lucide-react';
import type { CollectionTabKey } from '@/lib/demo-catalog';
import type { StorePageView } from '@/lib/store-pages';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  themeFileCount: number;
  onClose: () => void;
  onSelectCategory: (tab: CollectionTabKey) => void;
  onNavigatePage: (page: StorePageView) => void;
  onScrollToInspector: () => void;
}

export default function MobileMenuDrawer({
  isOpen,
  themeFileCount,
  onClose,
  onSelectCategory,
  onNavigatePage,
  onScrollToInspector,
}: MobileMenuDrawerProps) {
  if (!isOpen) return null;

  const categories: Array<{ label: string; subtitle: string; tab: CollectionTabKey }> = [
    { label: 'Bestsellers', subtitle: 'Popular single-origin oils', tab: 'Bestsellers' },
    { label: 'Essential Oils', subtitle: 'Steam-distilled aromatic essences', tab: 'Essential Oils' },
    { label: 'Carrier Oils', subtitle: 'First-press virgin botanicals', tab: 'Carrier Oils' },
    { label: 'Ultrasonic Diffusers', subtitle: 'Ceramic & hand-blown glass', tab: 'Diffusers' },
  ];

  const storePages: Array<{ label: string; subtitle: string; page: StorePageView }> = [
    { label: 'Why Choose Ghosoun', subtitle: 'Cold extraction & UV dark glass', page: 'why-choose' },
    { label: 'About Us', subtitle: 'Botanical heritage & transparency', page: 'about' },
    { label: 'Botanical Journal', subtitle: 'Aromatherapy & dilution guides', page: 'blog' },
    { label: 'FAQ', subtitle: 'Purity, usage & shipping answers', page: 'faq' },
    { label: 'Contact Us', subtitle: 'Speak with our concierge team', page: 'contact' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-[#0D2F32]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xs h-full bg-[#FAF9F5] text-[#142224] border-e border-[#E2DDD2] flex flex-col shadow-2xl">
        {/* Header with Preserved Official Logo */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2DDD2]">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/aistudio/ghosoun_logo_dfa0af8a.jpg"
              alt="Ghosoun Logo"
              width={96}
              height={96}
              referrerPolicy="no-referrer"
              className="h-9 w-auto object-contain mix-blend-multiply"
            />
            <span id="mobile-menu-heading" className="sr-only">
              Ghosoun Botanicals Menu
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close mobile menu"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#526162] hover:bg-[#F2EFE9] hover:text-[#0D2F32] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C59B43]">
              Shop Collections
            </p>
            {categories.map((cat) => (
              <button
                key={cat.tab}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.tab);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-md bg-white border border-[#E2DDD2] text-start hover:border-[#217C42] transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold text-[#0D2F32]">{cat.label}</div>
                  <div className="text-xs text-[#526162]">{cat.subtitle}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#526162]" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C59B43]">
              Explore &amp; Help
            </p>
            {storePages.map((pg) => (
              <button
                key={pg.page}
                type="button"
                onClick={() => {
                  onNavigatePage(pg.page);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-md bg-white border border-[#E2DDD2] text-start hover:border-[#217C42] transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-semibold text-[#0D2F32]">{pg.label}</div>
                  <div className="text-xs text-[#526162]">{pg.subtitle}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#526162]" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C59B43]">
              Theme Architecture
            </p>
            <button
              type="button"
              onClick={() => {
                onScrollToInspector();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#F2EFE9] border border-[#E2DDD2] text-start hover:border-[#217C42] transition-colors cursor-pointer"
            >
              <div>
                <div className="text-sm font-semibold text-[#0D2F32]">
                  Shopify OS 2.0 Source Files
                </div>
                <div className="text-xs text-[#526162]">
                  Inspect {themeFileCount} Liquid, JSON &amp; CSV files
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#526162]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Purity Footer */}
        <div className="px-5 py-4 border-t border-[#E2DDD2] bg-[#F2EFE9] space-y-2 text-xs text-[#526162]">
          <div className="flex items-center gap-2 text-[#0D2F32] font-medium">
            <Leaf className="w-4 h-4 text-[#217C42]" aria-hidden="true" />
            <span>100% Pure &amp; Single-Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C59B43]" aria-hidden="true" />
            <span>Bottled in UV-Protective Dark Glass</span>
          </div>
        </div>
      </div>
    </div>
  );
}
