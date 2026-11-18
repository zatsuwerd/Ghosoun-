export type StorePageView =
  | 'home'
  | 'why-choose'
  | 'about'
  | 'blog'
  | 'faq'
  | 'contact';

export type FaqCategory = 'All' | 'Purity & Sourcing' | 'Usage & Safety' | 'Orders & Shipping';

export interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'All'>;
  question: string;
  answer: string;
}

export type BlogCategory =
  | 'All'
  | 'Extraction Craft'
  | 'Hair & Scalp Rituals'
  | 'Preservation & Storage';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: Exclude<BlogCategory, 'All'>;
  author: string;
  publishedAt: string;
  readMinutes: number;
  excerpt: string;
  paragraphs: string[];
  keyTakeaways: string[];
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  'All',
  'Purity & Sourcing',
  'Usage & Safety',
  'Orders & Shipping',
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Purity & Sourcing',
    question: 'Are Ghosoun essential oils 100% pure and undiluted?',
    answer:
      'Yes. Every Ghosoun essential oil is bottled neat without synthetic fragrances, carrier oil diluents, or artificial colorants.',
  },
  {
    id: 'faq-2',
    category: 'Purity & Sourcing',
    question: 'Why does Ghosoun bottle oils in UV-protective dark glass?',
    answer:
      'Dark apothecary glass filters harsh visible light wavelengths that oxidize delicate aromatic terpenes and cold-pressed fatty acids, helping maintain freshness naturally.',
  },
  {
    id: 'faq-3',
    category: 'Purity & Sourcing',
    question: 'What does single-origin mean for essential and carrier oils?',
    answer:
      'Climate, soil minerals, and altitude shape plant aroma and nutrient composition. Each Ghosoun oil states its botanical species, plant part, extraction method, and harvest region transparently.',
  },
  {
    id: 'faq-4',
    category: 'Usage & Safety',
    question: 'How should I dilute essential oils for facial or scalp rituals?',
    answer:
      'For facial skin, use a gentle 0.5% to 1% dilution (1–2 drops per 10ml of cold-pressed Jojoba or Rosehip oil). For scalp massage with Rosemary oil, blend 3–5 drops into 1 tablespoon of Argan or Jojoba carrier oil.',
  },
  {
    id: 'faq-5',
    category: 'Usage & Safety',
    question: 'Can I use Ghosoun oils in ultrasonic water diffusers?',
    answer:
      'Yes. Add 5–8 drops of our pure essential oils per 100ml of water in an ultrasonic ceramic diffuser, or disperse undiluted through a cold-air waterless glass nebulizer.',
  },
  {
    id: 'faq-6',
    category: 'Orders & Shipping',
    question: 'How do complimentary shipping and checkout rates work?',
    answer:
      'Complimentary shipping thresholds configured in your Shopify Markets and Shipping Zones calculate automatically in the bag drawer and at checkout.',
  },
];

export const BLOG_CATEGORIES: BlogCategory[] = [
  'All',
  'Extraction Craft',
  'Hair & Scalp Rituals',
  'Preservation & Storage',
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'art-extraction',
    slug: 'cold-pressed-vs-steam-distilled-botanicals',
    title: 'Cold-Pressed vs. Steam-Distilled Botanicals',
    category: 'Extraction Craft',
    author: 'Ghosoun Editorial Desk',
    publishedAt: 'November 10, 2026',
    readMinutes: 4,
    excerpt:
      'How low-temperature expeller pressing and gentle hydro-steam distillation preserve the distinct properties of seeds, leaves, and aromatic resins.',
    paragraphs: [
      'A botanical extract depends as much on extraction craft as on the harvest itself. Delicate floral tops and aromatic leaves release volatile essential oils cleanly through controlled steam distillation, whereas oil-rich kernels and seeds yield nutrient-dense carrier oils through slow mechanical cold pressing.',
      'Industrial refining often relies on hexane solvents, high-heat bleaching, and chemical deodorization—stripping away characteristic color, natural scent, and delicate tocopherols.',
      'At Ghosoun, every bottle discloses both the plant part and the exact extraction method alongside its Latin species name and origin region.',
    ],
    keyTakeaways: [
      'Steam distillation isolates volatile aromatic essences without solvents.',
      'First-press unrefined cold extraction preserves natural lipid color and fatty acids.',
      'Full botanical labeling lets practitioners verify species and plant part clearly.',
    ],
  },
  {
    id: 'art-rosemary',
    slug: 'diluting-rosemary-for-scalp-vitality',
    title: 'Diluting Tunisian Rosemary Oil Safely for Hair Vitality',
    category: 'Hair & Scalp Rituals',
    author: 'Ghosoun Botanical Desk',
    publishedAt: 'November 04, 2026',
    readMinutes: 4,
    excerpt:
      'Practical dilution ratios for pairing Rosmarinus officinalis with cold-pressed Argan, Pumpkin Seed, and Golden Jojoba carrier oils.',
    paragraphs: [
      'Rosemary essential oil (Rosmarinus officinalis) has long been prized in haircare rituals for its invigorating herbaceous aroma and clarifying scalp feel.',
      'Because pure essential oils are highly concentrated, applying them directly onto sensitive skin is discouraged. Cold-pressed carrier oils act both as comfortable lipid buffers and nourishing treatments.',
      'For a balanced ritual, blend 4 drops of Tunisian Rosemary essential oil into 15ml of cold-pressed Moroccan Argan or Botanical Roots Scalp Elixir, warm between your palms, and massage gently before rinsing.',
    ],
    keyTakeaways: [
      'Maintain a 1.5%–2% scalp dilution rather than applying essential oil undiluted.',
      'Cold-pressed unrefined carrier oils contribute vitamin E and omega fatty acids.',
      'Store blended vials away from direct sunlight in dark glass.',
    ],
  },
  {
    id: 'art-glass',
    slug: 'dark-glass-preservation-and-botanical-shelf-life',
    title: 'How Dark Glass Preserves Volatile Botanical Molecules',
    category: 'Preservation & Storage',
    author: 'Ghosoun Formulation Notes',
    publishedAt: 'October 26, 2026',
    readMinutes: 3,
    excerpt:
      'Protecting polyunsaturated carrier oils and citrus monoterpenes from visible light exposure in everyday home environments.',
    paragraphs: [
      'Direct sunlight and bright bathroom lighting accelerate oxidation in delicate polyunsaturated plant oils such as Andean Rosehip Seed oil, diminishing freshness over time.',
      'Dark UV-filtering glass blocks intense visible spectra without needing synthetic stabilizers or plastic containers that risk leaching.',
      'Paired with tight-sealing glass dropper closures and cool cupboard storage, each bottle holds its crisp botanical character from first drop to last.',
    ],
    keyTakeaways: [
      'Shields light-sensitive omega fatty acids and monoterpene-rich citrus oils.',
      'Avoids reliance on synthetic antioxidants or plastic packaging.',
      'Reusable and recyclable dark glass vessel design.',
    ],
  },
];

export const WHY_CHOOSE_PILLARS = [
  {
    kicker: '01 · Extraction',
    title: 'First-Press Cold Extraction',
    description:
      'Carrier oils are cold-pressed gently without hexane solvents, bleaching, or deodorization so natural phytonutrients stay intact.',
  },
  {
    kicker: '02 · Preservation',
    title: 'UV-Shielded Dark Glass Vessels',
    description:
      'Filters degrading visible light to help protect delicate essential esters and polyunsaturated fatty acids without chemical preservatives.',
  },
  {
    kicker: '03 · Transparency',
    title: 'Full Botanical Disclosure',
    description:
      'Every product specifies Latin species binomial, plant part harvested, extraction method, and origin region openly.',
  },
  {
    kicker: '04 · Single-Origin',
    title: 'Harvested Where Each Plant Thrives',
    description:
      'Sourced from growing regions matched to each species—Tunisian rosemary, Provence lavender, Moroccan argan, and Dhofari resin.',
  },
  {
    kicker: '05 · Purity',
    title: 'Zero Synthetic Fragrance or Fillers',
    description:
      'Never diluted with mineral oil, propylene glycol, or lab-reconstituted aroma isolates.',
  },
  {
    kicker: '06 · Craft',
    title: 'Thoughtful Daily Ritual Tools',
    description:
      'Paired with matte ceramic ultrasonic and waterless glass nebulizing diffusers engineered for calm interiors.',
  },
];

export const COMPARISON_ROWS = [
  {
    criterion: 'Ingredient Disclosure',
    ghosoun: 'Full Latin Species, Origin & Plant Part',
    commercial: 'Anonymous Multi-Region Brokers',
  },
  {
    criterion: 'Formulation Purity',
    ghosoun: '100% Pure & Undiluted Botanicals',
    commercial: 'Frequently Cut With Synthetic Diluents',
  },
  {
    criterion: 'Carrier Oil Method',
    ghosoun: 'First-Press Unrefined Cold Extraction',
    commercial: 'Hexane-Refined, Bleached & Deodorized',
  },
  {
    criterion: 'Packaging & UV Protection',
    ghosoun: 'UV-Protective Dark Apothecary Glass',
    commercial: 'Clear Glass or Thin Plastic Bottles',
  },
];

export function filterFaqItems(
  items: FaqItem[],
  category: FaqCategory,
  searchQuery: string
): FaqItem[] {
  const q = searchQuery.trim().toLowerCase();
  return items.filter((item) => {
    const catMatch = category === 'All' || item.category === category;
    const textMatch =
      !q ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return catMatch && textMatch;
  });
}

export function filterBlogArticles(
  articles: BlogArticle[],
  category: BlogCategory
): BlogArticle[] {
  if (category === 'All') return articles;
  return articles.filter((a) => a.category === category);
}

export function validateContactForm(values: ContactFormValues): ContactValidationErrors {
  const errors: ContactValidationErrors = {};
  if (!values.name.trim()) {
    errors.name = 'Please enter your full name.';
  }
  const email = values.email.trim();
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Please enter at least 10 characters describing how we can help.';
  }
  return errors;
}

export const NEWSLETTER_POPUP_DELAY_MS = 5000;

export function validateNewsletterEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Please enter your email address.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function shouldShowNewsletterPopup(
  nowMs: number,
  dismissedUntilMs: number | null
): boolean {
  if (dismissedUntilMs === null || Number.isNaN(dismissedUntilMs)) return true;
  return nowMs >= dismissedUntilMs;
}
