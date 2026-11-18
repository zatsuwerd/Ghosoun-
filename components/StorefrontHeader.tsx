'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Menu,
  Search,
  ChevronDown,
  X,
  ArrowRight,
  Globe,
} from 'lucide-react';
import {
  COLLECTION_TABS,
  DEMO_PRODUCTS,
  type CollectionTabKey,
  type DemoProduct,
  type ProductVariant,
} from '@/lib/demo-catalog';
import { BLOG_ARTICLES, type StorePageView } from '@/lib/store-pages';

interface StorefrontHeaderProps {
  activePage: StorePageView;
  isRtl: boolean;
  totalCartCount: number;
  themeFileCount: number;
  onToggleRtl: () => void;
  onNavigatePage: (page: StorePageView) => void;
  onSelectCollection: (tab: CollectionTabKey) => void;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onOpenInspector: () => void;
  onAddToCart: (product: DemoProduct, variant: ProductVariant) => void;
}

export default function StorefrontHeader({
  activePage,
  isRtl,
  totalCartCount,
  themeFileCount,
  onToggleRtl,
  onNavigatePage,
  onSelectCollection,
  onOpenCart,
  onOpenMenu,
  onOpenInspector,
  onAddToCart,
}: StorefrontHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<'shop' | 'support' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const id = window.setTimeout(() => searchInputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
  }, [searchOpen]);

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchingProducts = trimmedQuery
    ? DEMO_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmedQuery) ||
          p.titleAr.toLowerCase().includes(trimmedQuery) ||
          p.botanicalName.toLowerCase().includes(trimmedQuery) ||
          p.countryOfOrigin.toLowerCase().includes(trimmedQuery) ||
          p.category.toLowerCase().includes(trimmedQuery)
      ).slice(0, 4)
    : DEMO_PRODUCTS.slice(0, 3);

  const matchingArticles = trimmedQuery
    ? BLOG_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmedQuery) ||
          a.category.toLowerCase().includes(trimmedQuery)
      ).slice(0, 2)
    : [];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 h-16 bg-[#FAF9F5]/95 backdrop-blur-sm border-b border-[#E2DDD2]"
    >
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-6 lg:gap-8">
        {/* Zone 1: Mobile Menu Trigger + Official Ghosoun Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={isRtl ? 'فتح قائمة التنقل' : 'Open navigation menu'}
            className="lg:hidden w-9 h-9 -ms-1 sm:-ms-2 shrink-0 flex items-center justify-center text-[#0D2F32] hover:bg-[#F2EFE9] rounded cursor-pointer"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              onNavigatePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Ghosoun Botanicals Home"
            className="inline-flex items-center gap-2 shrink-0 cursor-pointer group"
          >
            <Image
              src="/assets/aistudio/ghosoun_logo_dfa0af8a.jpg"
              alt="Ghosoun Logo"
              width={120}
              height={120}
              priority
              referrerPolicy="no-referrer"
              className="h-11 sm:h-12 w-auto object-contain mix-blend-multiply shrink-0"
            />
            <span className="hidden sm:inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[#0D2F32] group-hover:text-[#217C42] transition-colors whitespace-nowrap">
              {isRtl ? 'غصون للنباتات' : 'Botanicals'}
            </span>
          </button>
        </div>

        {/* Zone 2: Clean Single-Line Desktop Navigation */}
        <nav
          aria-label={isRtl ? 'التنقل الرئيسي' : 'Primary Navigation'}
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#526162]"
        >
          {/* Shop Mega Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={openDropdown === 'shop'}
              onClick={() => setOpenDropdown(openDropdown === 'shop' ? null : 'shop')}
              className={`inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activePage === 'home' ? 'text-[#0D2F32] font-semibold' : 'hover:text-[#0D2F32]'
              }`}
            >
              <span>{isRtl ? 'تسوّق' : 'Shop'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openDropdown === 'shop' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === 'shop' && (
              <div
                role="menu"
                aria-label="Shop Collections"
                className="absolute start-0 top-full mt-1 w-64 bg-[#FAF9F5] border border-[#E2DDD2] rounded-md shadow-lg p-2 z-40"
              >
                {COLLECTION_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenDropdown(null);
                      onSelectCollection(tab);
                    }}
                    className="w-full text-start px-3.5 py-2.5 rounded text-xs font-medium text-[#0D2F32] hover:bg-[#F2EFE9] flex items-center justify-between cursor-pointer"
                  >
                    <span>{tab}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59B43]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              onNavigatePage('why-choose');
            }}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activePage === 'why-choose'
                ? 'text-[#217C42] font-semibold'
                : 'hover:text-[#0D2F32]'
            }`}
          >
            {isRtl ? 'لماذا غصون' : 'Why Ghosoun'}
          </button>

          <button
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              onNavigatePage('about');
            }}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activePage === 'about'
                ? 'text-[#217C42] font-semibold'
                : 'hover:text-[#0D2F32]'
            }`}
          >
            {isRtl ? 'قصتنا' : 'About Us'}
          </button>

          <button
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              onNavigatePage('blog');
            }}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activePage === 'blog'
                ? 'text-[#217C42] font-semibold'
                : 'hover:text-[#0D2F32]'
            }`}
          >
            {isRtl ? 'المجلة النباتية' : 'Journal'}
          </button>

          {/* Support Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={openDropdown === 'support'}
              onClick={() => setOpenDropdown(openDropdown === 'support' ? null : 'support')}
              className={`inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activePage === 'faq' || activePage === 'contact'
                  ? 'text-[#217C42] font-semibold'
                  : 'hover:text-[#0D2F32]'
              }`}
            >
              <span>{isRtl ? 'الدعم' : 'Support'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openDropdown === 'support' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {openDropdown === 'support' && (
              <div
                role="menu"
                aria-label="Support and Pages"
                className="absolute start-0 top-full mt-1 w-64 bg-[#FAF9F5] border border-[#E2DDD2] rounded-md shadow-lg p-2 z-40"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpenDropdown(null);
                    onNavigatePage('faq');
                  }}
                  className="w-full text-start px-3.5 py-2.5 rounded text-xs font-medium text-[#0D2F32] hover:bg-[#F2EFE9] cursor-pointer"
                >
                  {isRtl ? 'الأسئلة الشائعة والتخفيف' : 'FAQ & Dilution Help'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpenDropdown(null);
                    onNavigatePage('contact');
                  }}
                  className="w-full text-start px-3.5 py-2.5 rounded text-xs font-medium text-[#0D2F32] hover:bg-[#F2EFE9] cursor-pointer"
                >
                  {isRtl ? 'تواصل مع خدمة العملاء' : 'Contact Concierge'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpenDropdown(null);
                    onOpenInspector();
                  }}
                  className="w-full text-start px-3.5 py-2.5 rounded text-xs font-medium text-[#C59B43] hover:bg-[#F2EFE9] border-t border-[#E2DDD2] mt-1 pt-2.5 cursor-pointer"
                >
                  OS 2.0 Theme Files ({themeFileCount})
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Language Toggle + Search + Primary Bag Action */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleRtl}
            aria-label={isRtl ? 'Switch to English LTR layout' : 'التبديل إلى العربية RTL'}
            className="inline-flex items-center gap-1 px-2.5 min-h-[36px] rounded border border-[#E2DDD2] bg-white text-[#0D2F32] text-[11px] font-semibold hover:border-[#C59B43] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-[#217C42]" aria-hidden="true" />
            <span>{isRtl ? 'EN' : 'عربي'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              setSearchOpen((prev) => !prev);
            }}
            aria-label={isRtl ? 'البحث في الكتالوج' : 'Search botanical catalog'}
            aria-expanded={searchOpen}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded flex items-center justify-center text-[#0D2F32] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag (${totalCartCount} items)`}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 min-h-[38px] sm:min-h-[40px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {isRtl ? 'الحقيبة' : 'Bag'} ({totalCartCount})
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Header Quick Search Drawer */}
      {searchOpen && (
        <div
          role="region"
          aria-label="Instant Catalog Search"
          className="absolute inset-x-0 top-full bg-[#FAF9F5] border-b border-[#E2DDD2] shadow-lg z-40"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <label htmlFor="header-quick-search-input" className="sr-only">
                  Search pure oils, botanical names, or guides
                </label>
                <Search
                  className="w-4 h-4 text-[#526162] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="header-quick-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'ابحث عن إكليل الجبل، اللبان، الأرغان، الفواحات...'
                      : 'Search Rosemary, Frankincense, Argan oil, Diffusers...'
                  }
                  className="w-full ps-10 pe-4 py-2.5 text-sm bg-white border border-[#E2DDD2] rounded-md text-[#142224] placeholder:text-[#526162] focus:outline-none focus:border-[#217C42]"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search bar"
                className="w-10 h-10 rounded flex items-center justify-center text-[#526162] hover:bg-[#F2EFE9] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {matchingProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-2 p-3 bg-white border border-[#E2DDD2] rounded"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      onSelectCollection(product.category);
                    }}
                    className="text-start min-w-0 cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-[#0D2F32] truncate">
                      {isRtl ? product.titleAr : product.title}
                    </div>
                    <div className="text-[11px] text-[#C59B43] truncate">
                      {product.countryOfOrigin} &middot; AED {product.variants[0].priceAed}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      onAddToCart(product, product.variants[0]);
                    }}
                    className="px-2.5 py-1.5 rounded bg-[#0D2F32] text-[#FAF9F5] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#217C42] shrink-0 cursor-pointer"
                  >
                    {isRtl ? 'أضف' : 'Add'}
                  </button>
                </div>
              ))}
            </div>

            {matchingArticles.length > 0 && (
              <div className="pt-2 border-t border-[#E2DDD2] flex flex-wrap items-center gap-3 text-xs">
                <span className="font-semibold text-[#C59B43] uppercase tracking-wider">
                  Journal Matches:
                </span>
                {matchingArticles.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      onNavigatePage('blog');
                    }}
                    className="text-[#0D2F32] underline hover:text-[#217C42] cursor-pointer"
                  >
                    {art.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
