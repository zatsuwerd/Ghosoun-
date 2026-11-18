'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Leaf,
  ShieldCheck,
  Droplets,
  Globe,
  FlaskConical,
  Truck,
  Sparkles,
  ArrowRight,
  BookOpen,
  Quote,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  COLLECTION_TABS,
  DEMO_PRODUCTS,
  computeCartCount,
  filterProductsByTab,
  type CartItem,
  type CollectionTabKey,
  type DemoProduct,
  type ProductVariant,
} from '@/lib/demo-catalog';
import {
  BLOG_ARTICLES,
  NEWSLETTER_POPUP_DELAY_MS,
  shouldShowNewsletterPopup,
  validateNewsletterEmail,
  type StorePageView,
} from '@/lib/store-pages';
import StorefrontHeader from './StorefrontHeader';
import ProductCard from './ProductCard';
import ProductVisual from './ProductVisual';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import MobileMenuDrawer from './MobileMenuDrawer';
import MobileBottomNav, { type MobileNavTab } from './MobileBottomNav';
import NewsletterPopupModal from './NewsletterPopupModal';
import ThemeInspector, { type ThemeFileEntry } from './ThemeInspector';
import FaqPageView from './FaqPageView';
import AboutPageView from './AboutPageView';
import WhyChoosePageView from './WhyChoosePageView';
import ContactPageView from './ContactPageView';
import BlogPageView from './BlogPageView';

interface StorefrontPreviewProps {
  themeFiles: ThemeFileEntry[];
}

export default function StorefrontPreview({ themeFiles }: StorefrontPreviewProps) {
  const [activePage, setActivePage] = useState<StorePageView>('home');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CollectionTabKey>('Bestsellers');
  const [isRtl, setIsRtl] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      productId: DEMO_PRODUCTS[0].id,
      variantId: DEMO_PRODUCTS[0].variants[0].id,
      title: DEMO_PRODUCTS[0].title,
      variantLabel: DEMO_PRODUCTS[0].variants[0].label,
      priceAed: DEMO_PRODUCTS[0].variants[0].priceAed,
      quantity: 1,
      bottleStyle: DEMO_PRODUCTS[0].bottleStyle,
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([DEMO_PRODUCTS[3].id]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [mobileNavTab, setMobileNavTab] = useState<MobileNavTab>('home');

  const [bannerEmail, setBannerEmail] = useState('');
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSubscribed, setBannerSubscribed] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = isRtl ? 'ar' : 'en';
    return () => {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    };
  }, [isRtl]);

  const dismissNewsletter = () => {
    setIsNewsletterOpen(false);
    try {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        'ghosoun_newsletter_dismissed_until',
        String(Date.now() + sevenDaysMs)
      );
    } catch {
      // Storage unavailable
    }
  };

  useEffect(() => {
    let dismissedUntil: number | null = null;
    try {
      const raw = localStorage.getItem('ghosoun_newsletter_dismissed_until');
      dismissedUntil = raw ? Number(raw) : null;
    } catch {
      dismissedUntil = null;
    }

    if (!shouldShowNewsletterPopup(Date.now(), dismissedUntil)) return;

    const timer = window.setTimeout(() => {
      setIsNewsletterOpen(true);
    }, NEWSLETTER_POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setIsMenuOpen(false);
        setIsNewsletterOpen(false);
        setMobileNavTab('home');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const visibleProducts = filterProductsByTab(DEMO_PRODUCTS, activeTab);
  const wishlistedProducts = DEMO_PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = computeCartCount(cartItems);

  const handleAddToCart = (product: DemoProduct, variant: ProductVariant) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          title: isRtl ? product.titleAr : product.title,
          variantLabel: variant.label,
          priceAed: variant.priceAed,
          quantity: 1,
          bottleStyle: product.bottleStyle,
        },
      ];
    });
    setIsCartOpen(true);
    setMobileNavTab('cart');
  };

  const handleUpdateQty = (variantId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.variantId === variantId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (variantId: string) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const handleToggleWishlist = (product: DemoProduct) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const scrollToSection = (id: string) => {
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const navigateToPage = (page: StorePageView, articleSlug: string | null = null) => {
    setSelectedArticleSlug(articleSlug);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCollection = (tab: CollectionTabKey) => {
    setActivePage('home');
    setActiveTab(tab);
    scrollToSection('catalog');
  };

  const navigateToInspector = () => {
    setActivePage('home');
    scrollToSection('theme-files');
  };

  const handleBannerNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateNewsletterEmail(bannerEmail);
    if (err) {
      setBannerError(err);
      return;
    }
    setBannerError(null);
    setBannerSubscribed(bannerEmail.trim());
    setBannerEmail('');
  };

  const trustPillars = [
    { icon: Leaf, title: '100% Pure & Undiluted', desc: 'Zero synthetics or fillers' },
    { icon: Droplets, title: 'First-Press Cold Oils', desc: 'Unrefined without hexane' },
    { icon: FlaskConical, title: 'UV Dark Glass', desc: 'Shielded botanical potency' },
    { icon: Globe, title: 'Single-Origin Terroir', desc: 'Regional botanical harvests' },
    { icon: ShieldCheck, title: 'Open Species Labels', desc: 'Latin binomial & plant part' },
    { icon: Truck, title: 'Free Delivery AED 200+', desc: 'Configured per Shopify Market' },
  ];

  const categoryCards: Array<{
    tab: CollectionTabKey;
    title: string;
    subtitle: string;
    bottleStyle: DemoProduct['bottleStyle'];
  }> = [
    {
      tab: 'Essential Oils',
      title: 'Pure Essential Oils',
      subtitle: 'Steam-distilled leaves, florals & resins',
      bottleStyle: 'violet-dropper',
    },
    {
      tab: 'Carrier Oils',
      title: 'Cold-Pressed Carrier Oils',
      subtitle: 'Unrefined virgin seed & kernel lipids',
      bottleStyle: 'amber-bottle',
    },
    {
      tab: 'Diffusers',
      title: 'Ceramic & Glass Diffusers',
      subtitle: 'Ultrasonic & waterless cold-air atomizers',
      bottleStyle: 'ceramic-diffuser',
    },
    {
      tab: 'Bestsellers',
      title: 'Hair & Scalp Rituals',
      subtitle: 'Rosemary & nourishing root botanicals',
      bottleStyle: 'violet-dropper',
    },
  ];

  const communityNotes = [
    {
      quote:
        'Blending three drops of Tunisian Rosemary with Golden Jojoba transformed my evening scalp ritual—fresh herbaceous aroma with zero artificial heaviness.',
      author: 'Nadia H.',
      ritual: 'Tunisian Rosemary Ritual',
    },
    {
      quote:
        'The Omani Frankincense Sacra carries that unmistakable warm resin depth in our alabaster ultrasonic diffuser every quiet night.',
      author: 'Tariq M.',
      ritual: 'Dhofari Resin Diffusion',
    },
    {
      quote:
        'Unrefined Andean Rosehip Seed absorbs comfortably overnight in dry climate air without feeling greasy.',
      author: 'Layla S.',
      ritual: 'Facial Evening Care',
    },
  ];

  const featuredHeroProduct = DEMO_PRODUCTS[0];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#142224] pb-[72px] lg:pb-0"
    >
      {/* Slim Non-Sticky Announcement Bar */}
      <div className="bg-[#0D2F32] text-[#FAF9F5] text-[11px] sm:text-xs tracking-wide py-2 px-4 text-center">
        <span>{isRtl ? 'غصون للنباتات النقية' : 'Pure Botanical Apothecary'}</span>
        <span className="mx-2 text-[#C59B43]">&middot;</span>
        <span>{isRtl ? 'زيوت أحادية المصدر ١٠٠٪' : '100% Single-Origin & Undiluted'}</span>
        <span className="hidden sm:inline mx-2 text-[#C59B43]">&middot;</span>
        <span className="hidden sm:inline">
          {isRtl ? 'شحن مجاني للطلبات فوق ٢٠٠ د.إ' : 'Complimentary Delivery Above AED 200'}
        </span>
      </div>

      {/* 3-Zone Header with Official Ghosoun Logo & RTL Toggle */}
      <StorefrontHeader
        activePage={activePage}
        isRtl={isRtl}
        totalCartCount={totalCartCount}
        themeFileCount={themeFiles.length}
        onToggleRtl={() => setIsRtl((prev) => !prev)}
        onNavigatePage={(pg) => navigateToPage(pg)}
        onSelectCollection={navigateToCollection}
        onOpenCart={() => {
          setIsCartOpen(true);
          setMobileNavTab('cart');
        }}
        onOpenMenu={() => {
          setIsMenuOpen(true);
          setMobileNavTab('menu');
        }}
        onOpenInspector={navigateToInspector}
        onAddToCart={handleAddToCart}
      />

      <main id="top" className="flex-1">
        {activePage === 'why-choose' && (
          <WhyChoosePageView onShopNow={() => navigateToCollection('Bestsellers')} />
        )}

        {activePage === 'about' && (
          <AboutPageView
            onShopNow={() => navigateToCollection('Bestsellers')}
            onNavigateWhyChoose={() => navigateToPage('why-choose')}
          />
        )}

        {activePage === 'blog' && (
          <BlogPageView
            key={selectedArticleSlug ?? 'blog-index'}
            initialArticleSlug={selectedArticleSlug}
            onShopNow={() => navigateToCollection('Essential Oils')}
          />
        )}

        {activePage === 'faq' && (
          <FaqPageView onNavigateContact={() => navigateToPage('contact')} />
        )}

        {activePage === 'contact' && <ContactPageView />}

        {activePage === 'home' && (
          <>
            {/* Hero Editorial Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="lg:col-span-7 space-y-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B43]">
                    {isRtl
                      ? 'غصون · زيوت عطرية ونباتية أحادية المصدر'
                      : 'Ghosoun · Single-Origin Botanical Apothecary'}
                  </p>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#0D2F32] leading-[1.06] tracking-tight">
                    {isRtl
                      ? 'نقاء النبات، من الحصاد إلى الزجاجة.'
                      : 'Botanical Purity, Untouched by Compromise.'}
                  </h1>
                  <p className="text-base sm:text-lg text-[#526162] max-w-xl leading-relaxed">
                    {isRtl
                      ? 'زيوت أساسية مقطرة بالبخار وزيوت حاملة معصورة على البارد من مصادر معروفة ومحفوظة في زجاج داكن يحمي جودتها.'
                      : 'Steam-distilled essential oils and first-press cold carrier oils sourced from dedicated harvest regions and preserved in UV-protective dark glass.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => navigateToCollection('Bestsellers')}
                      className="inline-flex items-center gap-2 px-6 min-h-[48px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#217C42] transition-colors cursor-pointer"
                    >
                      {isRtl ? 'تسوّق الأكثر مبيعاً' : 'Shop Bestsellers'}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToPage('why-choose')}
                      className="inline-flex items-center gap-2 px-6 min-h-[48px] rounded border border-[#0D2F32] text-[#0D2F32] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                    >
                      {isRtl ? 'لماذا غصون' : 'Why Ghosoun'}
                    </button>
                  </div>
                </motion.div>

                {/* Spotlight Apothecary Visual Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="lg:col-span-5"
                >
                  <div className="bg-[#F2EFE9] border border-[#E2DDD2] rounded-md p-6 sm:p-8 flex flex-col sm:flex-row lg:flex-col items-center gap-6">
                    <div className="w-full sm:w-44 lg:w-full h-56 sm:h-48 lg:h-60 bg-[#FAF9F5] border border-[#E2DDD2] rounded flex items-center justify-center relative">
                      <ProductVisual
                        bottleStyle={featuredHeroProduct.bottleStyle}
                        title={featuredHeroProduct.title}
                      />
                    </div>
                    <div className="w-full flex items-center justify-between gap-4">
                      <div>
                        <p className="font-serif italic text-sm text-[#C59B43] font-medium">
                          {featuredHeroProduct.botanicalName}
                        </p>
                        <h2 className="text-base font-semibold text-[#0D2F32]">
                          {isRtl ? featuredHeroProduct.titleAr : featuredHeroProduct.title}
                        </h2>
                        <p className="text-xs text-[#526162] mt-0.5">
                          {featuredHeroProduct.countryOfOrigin} &middot;{' '}
                          {featuredHeroProduct.extractionMethod}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(featuredHeroProduct, featuredHeroProduct.variants[0])
                        }
                        className="px-4 min-h-[40px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
                      >
                        AED {featuredHeroProduct.variants[0].priceAed}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 6-Pillar Trust Icons Strip */}
            <section
              aria-label="Ghosoun Purity Standards"
              className="border-y border-[#E2DDD2] bg-[#F2EFE9]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {trustPillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={pillar.title} className="flex items-start gap-3">
                      <Icon
                        className="w-5 h-5 text-[#217C42] shrink-0 mt-0.5 stroke-[1.75]"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#0D2F32] leading-snug">
                          {pillar.title}
                        </div>
                        <div className="text-[11px] text-[#526162] mt-0.5">{pillar.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Category Navigation Grid */}
            <section aria-labelledby="category-grid-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C59B43] mb-1.5">
                    Curated Rituals
                  </p>
                  <h2 id="category-grid-heading" className="font-serif text-3xl font-semibold text-[#0D2F32]">
                    {isRtl ? 'تصفح حسب الفئة' : 'Explore by Collection'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {categoryCards.map((cat) => (
                  <button
                    key={cat.title}
                    type="button"
                    onClick={() => navigateToCollection(cat.tab)}
                    className="group text-start bg-white border border-[#E2DDD2] rounded-md p-5 hover:border-[#C59B43] hover:shadow-sm transition-all cursor-pointer flex items-center gap-4"
                  >
                    <div className="w-16 h-20 rounded bg-[#F2EFE9] shrink-0 flex items-center justify-center overflow-hidden">
                      <ProductVisual bottleStyle={cat.bottleStyle} title={cat.title} compact />
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif text-lg font-semibold text-[#0D2F32] group-hover:text-[#217C42] transition-colors">
                        {cat.title}
                      </div>
                      <p className="text-xs text-[#526162] mt-1 leading-relaxed">{cat.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Collection Tabs + Demo Product Grid */}
            <section id="catalog" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-8 py-14">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C59B43] mb-2">
                    {isRtl ? 'مجموعة غصون التجريبية' : 'Ghosoun Botanical Catalog'}
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0D2F32]">
                    {isRtl ? 'تسوّق حسب الصنف' : 'Shop By Formulation'}
                  </h2>
                </div>

                <div
                  role="tablist"
                  aria-label="Product collections"
                  className="flex flex-wrap gap-2"
                >
                  {COLLECTION_TABS.map((tab) => {
                    const isSelected = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 min-h-[40px] rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#0D2F32] text-[#FAF9F5]'
                            : 'bg-white text-[#526162] border border-[#E2DDD2] hover:border-[#C59B43] hover:text-[#0D2F32]'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>

            {/* Origin Story Editorial 50/50 Split */}
            <section className="bg-[#F2EFE9] border-y border-[#E2DDD2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#C59B43]">
                    <Sparkles className="w-3.5 h-3.5 text-[#217C42]" aria-hidden="true" />
                    <span>Origin-to-Bottle Craft</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0D2F32]">
                    Distilled at Harvest Origin. Preserved in Dark Glass.
                  </h2>
                  <p className="text-sm sm:text-base text-[#526162] leading-relaxed">
                    From wild-harvested Tunisian Rosemary to Dhofari Boswellia sacra resin tears and
                    first-press Moroccan Argan oil, every Ghosoun bottle documents its botanical
                    species, plant part, and extraction craft openly.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => navigateToPage('about')}
                      className="px-4 min-h-[40px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] cursor-pointer"
                    >
                      Read Our Story
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateToPage('blog')}
                      className="px-4 min-h-[40px] rounded border border-[#0D2F32] text-[#0D2F32] text-xs font-semibold uppercase tracking-wider hover:bg-white cursor-pointer"
                    >
                      Explore Botanical Journal
                    </button>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] border border-[#E2DDD2] rounded-md p-6 sm:p-8 space-y-4">
                  <h3 className="font-serif text-2xl font-semibold text-[#0D2F32]">
                    Complete Ghosoun Shopify OS 2.0 Theme
                  </h3>
                  <ul className="space-y-3 text-sm text-[#526162]">
                    <li className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#217C42] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong className="text-[#0D2F32]">Full Storefront Templates:</strong>{' '}
                        Includes <code className="font-mono text-xs">index.json</code>,{' '}
                        <code className="font-mono text-xs">search.json</code>,{' '}
                        <code className="font-mono text-xs">list-collections.json</code>,{' '}
                        <code className="font-mono text-xs">404.json</code>, dedicated story &amp; FAQ
                        pages, and bilingual <code className="font-mono text-xs">ar.json</code>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#217C42] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong className="text-[#0D2F32]">Bilingual EN / Arabic RTL Ready:</strong>{' '}
                        CSS logical properties throughout <code className="font-mono text-xs">assets/base.css</code>{' '}
                        with automatic <code className="font-mono text-xs">dir=&quot;rtl&quot;</code> switching.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#217C42] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong className="text-[#0D2F32]">Demo Catalog CSV &amp; Cart Sync:</strong>{' '}
                        12 multi-variant botanical SKUs ready in{' '}
                        <code className="font-mono text-xs">demo/ghosoun-products.csv</code>.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Educational Journal 3-Card Preview */}
            <section aria-labelledby="journal-preview-heading" className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C59B43] mb-1.5">
                    Botanical Education
                  </p>
                  <h2 id="journal-preview-heading" className="font-serif text-3xl sm:text-4xl font-semibold text-[#0D2F32]">
                    From the Ghosoun Journal
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToPage('blog')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0D2F32] hover:text-[#217C42] cursor-pointer"
                >
                  View All Guides
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BLOG_ARTICLES.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col bg-white border border-[#E2DDD2] rounded-md p-6 hover:border-[#C59B43] transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C59B43] mb-3">
                      <BookOpen className="w-3.5 h-3.5 text-[#217C42]" aria-hidden="true" />
                      <span>{article.category}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#0D2F32] leading-snug mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[#526162] leading-relaxed flex-1 mb-4">
                      {article.excerpt}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateToPage('blog', article.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0D2F32] hover:text-[#217C42] cursor-pointer self-start"
                    >
                      Read Guide
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* Community Ritual Notes (No Fabricated Metrics) */}
            <section aria-labelledby="community-notes-heading" className="bg-[#F2EFE9] border-y border-[#E2DDD2] py-14 px-4 sm:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C59B43] mb-1.5">
                    Daily Ritual Reflections
                  </p>
                  <h2 id="community-notes-heading" className="font-serif text-3xl font-semibold text-[#0D2F32]">
                    How Our Community Uses Ghosoun
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {communityNotes.map((note) => (
                    <blockquote
                      key={note.author}
                      className="bg-white border border-[#E2DDD2] rounded-md p-6 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <Quote className="w-5 h-5 text-[#C59B43]" aria-hidden="true" />
                        <p className="text-sm text-[#142224] leading-relaxed">{note.quote}</p>
                      </div>
                      <footer className="pt-3 border-t border-[#E2DDD2]/70 flex items-center justify-between text-xs">
                        <strong className="text-[#0D2F32]">{note.author}</strong>
                        <span className="text-[#526162]">{note.ritual}</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </section>

            {/* Inline Newsletter Banner */}
            <section aria-labelledby="newsletter-banner-heading" className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
              <div className="bg-[#0D2F32] text-[#FAF9F5] rounded-md p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B43]">
                    Ghosoun Inner Circle
                  </p>
                  <h2 id="newsletter-banner-heading" className="font-serif text-3xl font-semibold text-[#FAF9F5]">
                    Join Seasonal Harvest Dispatches
                  </h2>
                  <p className="text-sm text-[#DCE3E1] max-w-xl">
                    Receive single-origin harvest releases, botanical dilution charts, and 10% off
                    your first order with code <span className="font-mono text-[#C59B43]">WELCOME10</span>.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  {bannerSubscribed ? (
                    <div
                      role="status"
                      className="p-4 rounded bg-white/10 border border-[#C59B43]/60 flex items-start gap-3 text-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#C59B43] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">
                          Welcome to Ghosoun ({bannerSubscribed}).
                        </p>
                        <p className="text-xs text-[#DCE3E1] mt-1">
                          Apply code <strong className="text-[#C59B43]">WELCOME10</strong> at checkout.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBannerNewsletterSubmit} noValidate className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <label htmlFor="banner-newsletter-email" className="sr-only">
                          Email Address
                        </label>
                        <div className="relative flex-1">
                          <Mail
                            className="w-4 h-4 text-[#526162] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                          />
                          <input
                            id="banner-newsletter-email"
                            type="email"
                            value={bannerEmail}
                            onChange={(e) => {
                              setBannerEmail(e.target.value);
                              if (bannerError) setBannerError(null);
                            }}
                            placeholder="you@example.com"
                            className="w-full ps-10 pe-3.5 min-h-[44px] rounded bg-[#FAF9F5] text-[#142224] placeholder:text-[#526162] text-sm focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-5 min-h-[44px] rounded bg-[#C59B43] text-[#0D2F32] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF9F5] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Subscribe
                        </button>
                      </div>
                      {bannerError && (
                        <p role="alert" className="text-xs text-[#F5C2B8]">
                          {bannerError}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* Shopify OS 2.0 Workspace File Inspector */}
            <ThemeInspector files={themeFiles} />
          </>
        )}
      </main>

      {/* Deep Dark Teal Storefront Footer */}
      <footer className="bg-[#0D2F32] text-[#FAF9F5] px-4 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/15">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 bg-[#FAF9F5] px-3 py-1.5 rounded-md">
              <Image
                src="/assets/aistudio/ghosoun_logo_dfa0af8a.jpg"
                alt="Ghosoun Botanicals"
                width={100}
                height={100}
                referrerPolicy="no-referrer"
                className="h-9 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <p className="text-xs text-[#DCE3E1] max-w-xs leading-relaxed">
              Single-origin essential oils, cold-pressed virgin carrier oils, and minimalist
              ceramic diffusers preserved in UV-protective apothecary glass.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B43] mb-3">
              Discover Pages
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#DCE3E1]">
              <button type="button" onClick={() => navigateToPage('about')} className="hover:text-[#FAF9F5] cursor-pointer">
                About Us
              </button>
              <button type="button" onClick={() => navigateToPage('why-choose')} className="hover:text-[#FAF9F5] cursor-pointer">
                Why Choose Ghosoun
              </button>
              <button type="button" onClick={() => navigateToPage('blog')} className="hover:text-[#FAF9F5] cursor-pointer">
                Journal (Blog)
              </button>
              <button type="button" onClick={() => navigateToPage('faq')} className="hover:text-[#FAF9F5] cursor-pointer">
                FAQ
              </button>
              <button type="button" onClick={() => navigateToPage('contact')} className="hover:text-[#FAF9F5] cursor-pointer">
                Contact Us
              </button>
              <button type="button" onClick={() => setIsNewsletterOpen(true)} className="hover:text-[#FAF9F5] cursor-pointer">
                Newsletter (10% Off)
              </button>
            </div>
          </div>

          <div className="md:text-end space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B43]">
              Shopify Theme Package
            </div>
            <button
              type="button"
              onClick={navigateToInspector}
              className="text-xs text-[#FAF9F5] underline hover:text-[#C59B43] font-semibold cursor-pointer"
            >
              Inspect All {themeFiles.length} OS 2.0 Files
            </button>
            <div className="font-mono text-[11px] text-[#DCE3E1]">
              shopify theme check &middot; shopify theme dev
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 text-xs text-[#DCE3E1] flex flex-col sm:flex-row justify-between gap-2">
          <span>&copy; 2026 Ghosoun Botanicals (غصون)</span>
          <span>100% Pure &amp; Single-Origin</span>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => {
          setIsCartOpen(false);
          setMobileNavTab('home');
        }}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        products={wishlistedProducts}
        onClose={() => {
          setIsWishlistOpen(false);
          setMobileNavTab('home');
        }}
        onRemove={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <MobileMenuDrawer
        isOpen={isMenuOpen}
        themeFileCount={themeFiles.length}
        onClose={() => {
          setIsMenuOpen(false);
          setMobileNavTab('home');
        }}
        onSelectCategory={navigateToCollection}
        onNavigatePage={(pg) => navigateToPage(pg)}
        onScrollToInspector={navigateToInspector}
      />

      <NewsletterPopupModal
        isOpen={isNewsletterOpen}
        onClose={dismissNewsletter}
        onExploreOils={() => navigateToCollection('Bestsellers')}
      />

      {/* Fixed Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={mobileNavTab}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onSelectHome={() => {
          setIsCartOpen(false);
          setIsWishlistOpen(false);
          setIsMenuOpen(false);
          setMobileNavTab('home');
          navigateToPage('home');
        }}
        onSelectShop={() => {
          setIsCartOpen(false);
          setIsWishlistOpen(false);
          setIsMenuOpen(false);
          setMobileNavTab('shop');
          navigateToCollection('Bestsellers');
        }}
        onOpenWishlist={() => {
          setIsCartOpen(false);
          setIsMenuOpen(false);
          setIsWishlistOpen(true);
          setMobileNavTab('wishlist');
        }}
        onOpenCart={() => {
          setIsWishlistOpen(false);
          setIsMenuOpen(false);
          setIsCartOpen(true);
          setMobileNavTab('cart');
        }}
        onOpenMenu={() => {
          setIsCartOpen(false);
          setIsWishlistOpen(false);
          setIsMenuOpen(true);
          setMobileNavTab('menu');
        }}
      />
    </div>
  );
}
