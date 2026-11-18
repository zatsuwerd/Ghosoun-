export type CollectionTabKey = 'Bestsellers' | 'Essential Oils' | 'Carrier Oils' | 'Diffusers';

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  priceAed: number;
  compareAtPriceAed?: number;
}

export interface DemoProduct {
  id: string;
  handle: string;
  title: string;
  titleAr: string;
  botanicalName: string;
  plantPart: string;
  extractionMethod: string;
  countryOfOrigin: string;
  category: Exclude<CollectionTabKey, 'Bestsellers'>;
  isBestseller: boolean;
  bottleStyle: 'violet-dropper' | 'amber-bottle' | 'ceramic-diffuser';
  description: string;
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  variantLabel: string;
  priceAed: number;
  quantity: number;
  bottleStyle: DemoProduct['bottleStyle'];
}

export const FREE_SHIPPING_THRESHOLD_AED = 200;

export const COLLECTION_TABS: CollectionTabKey[] = [
  'Bestsellers',
  'Essential Oils',
  'Carrier Oils',
  'Diffusers',
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'prod-rosemary',
    handle: 'rosemary-essential-oil',
    title: 'Tunisian Rosemary Essential Oil',
    titleAr: 'زيت إكليل الجبل التونسي النقي',
    botanicalName: 'Rosmarinus officinalis',
    plantPart: 'Flowering Tops & Leaves',
    extractionMethod: 'Steam Distillation',
    countryOfOrigin: 'Tunisia',
    category: 'Essential Oils',
    isBestseller: true,
    bottleStyle: 'violet-dropper',
    description:
      '100% pure, single-origin Rosemary essential oil steam-distilled from wild-harvested Tunisian flowering tops for clarifying scalp blends and focused diffusion.',
    variants: [
      { id: 'ros-10', label: '10ml', sku: 'GH-EO-ROS-10', priceAed: 69, compareAtPriceAed: 85 },
      { id: 'ros-30', label: '30ml', sku: 'GH-EO-ROS-30', priceAed: 159, compareAtPriceAed: 185 },
      { id: 'ros-100', label: '100ml', sku: 'GH-EO-ROS-100', priceAed: 395 },
    ],
  },
  {
    id: 'prod-scalp-elixir',
    handle: 'ghosoun-botanical-scalp-elixir',
    title: 'Botanical Roots Scalp Elixir',
    titleAr: 'إكسير غصون النباتي لفروة الرأس',
    botanicalName: 'Botanical Complex',
    plantPart: 'Seeds & Leaves',
    extractionMethod: 'Cold-Pressed Infusion',
    countryOfOrigin: 'Multi-Origin',
    category: 'Carrier Oils',
    isBestseller: true,
    bottleStyle: 'violet-dropper',
    description:
      'Synergistic cold-pressed blend of Rosemary, Pumpkin Seed, Black Seed, and Castor oils crafted to nourish hair roots and support scalp comfort.',
    variants: [
      { id: 'elx-100', label: '100ml', sku: 'GH-ELX-01-100', priceAed: 185, compareAtPriceAed: 220 },
      { id: 'elx-200', label: '200ml', sku: 'GH-ELX-01-200', priceAed: 330 },
    ],
  },
  {
    id: 'prod-argan',
    handle: 'moroccan-argan-carrier-oil',
    title: 'Virgin Moroccan Argan Oil',
    titleAr: 'زيت الأرغان المغربي البكر',
    botanicalName: 'Argania spinosa',
    plantPart: 'Kernel',
    extractionMethod: 'Cold-Pressed Virgin',
    countryOfOrigin: 'Morocco',
    category: 'Carrier Oils',
    isBestseller: true,
    bottleStyle: 'amber-bottle',
    description:
      'First-press, unrefined cold-pressed Argan oil sourced from Moroccan cooperatives, naturally rich in vitamin E and essential fatty acids.',
    variants: [
      { id: 'arg-30', label: '30ml', sku: 'GH-CO-ARG-30', priceAed: 95, compareAtPriceAed: 115 },
      { id: 'arg-100', label: '100ml', sku: 'GH-CO-ARG-100', priceAed: 215 },
    ],
  },
  {
    id: 'prod-lavender',
    handle: 'french-lavender-essential-oil',
    title: 'French High-Altitude Lavender Oil',
    titleAr: 'زيت اللافندر الفرنسي الجبلي',
    botanicalName: 'Lavandula angustifolia',
    plantPart: 'Flowering Tops',
    extractionMethod: 'Steam Distillation',
    countryOfOrigin: 'Provence, France',
    category: 'Essential Oils',
    isBestseller: true,
    bottleStyle: 'violet-dropper',
    description:
      'Pure Lavandula angustifolia harvested at high altitude in Provence, France for tranquil evening diffusion and diluted pillow mists.',
    variants: [
      { id: 'lav-10', label: '10ml', sku: 'GH-EO-LAV-10', priceAed: 79 },
      { id: 'lav-30', label: '30ml', sku: 'GH-EO-LAV-30', priceAed: 179 },
    ],
  },
  {
    id: 'prod-frankincense',
    handle: 'frankincense-sacra-essential-oil',
    title: 'Omani Frankincense Sacra Oil',
    titleAr: 'زيت اللبان الحوجري العماني',
    botanicalName: 'Boswellia sacra',
    plantPart: 'Resin Tears',
    extractionMethod: 'Hydro-Steam Distillation',
    countryOfOrigin: 'Dhofar, Oman',
    category: 'Essential Oils',
    isBestseller: true,
    bottleStyle: 'violet-dropper',
    description:
      'Sacred Boswellia sacra resin hydro-steam distilled in Dhofar, Oman. Deep, resinous, balsamic aroma valued for evening reflection.',
    variants: [
      { id: 'frk-10', label: '10ml', sku: 'GH-EO-FRK-10', priceAed: 165, compareAtPriceAed: 195 },
      { id: 'frk-30', label: '30ml', sku: 'GH-EO-FRK-30', priceAed: 395 },
    ],
  },
  {
    id: 'prod-rosehip',
    handle: 'rosehip-seed-facial-oil',
    title: 'Andean Rosehip Seed Oil',
    titleAr: 'زيت بذور ثمر الورد الأنديزي',
    botanicalName: 'Rosa rubiginosa',
    plantPart: 'Seeds',
    extractionMethod: 'Expeller Cold-Pressed',
    countryOfOrigin: 'Chilean Andes',
    category: 'Carrier Oils',
    isBestseller: true,
    bottleStyle: 'amber-bottle',
    description:
      'Unrefined cold-pressed Chilean rosehip seed oil rich in omega fatty acids to replenish dry skin and illuminate facial care.',
    variants: [
      { id: 'rsh-30', label: '30ml', sku: 'GH-CO-RSH-30', priceAed: 115 },
      { id: 'rsh-100', label: '100ml', sku: 'GH-CO-RSH-100', priceAed: 265 },
    ],
  },
  {
    id: 'prod-alabaster-diffuser',
    handle: 'ultrasonic-alabaster-diffuser',
    title: 'Alabaster Ceramic Ultrasonic Diffuser',
    titleAr: 'فواحة السيراميك فوق الصوتية',
    botanicalName: 'Ceramic & Brass',
    plantPart: 'Ultrasonic 2.4MHz',
    extractionMethod: 'Cold Micro-Mist',
    countryOfOrigin: 'Artisan Studio',
    category: 'Diffusers',
    isBestseller: true,
    bottleStyle: 'ceramic-diffuser',
    description:
      'Handcrafted matte ceramic ultrasonic diffuser featuring warm ambient illumination, quiet cold micro-mist, and automatic waterless shut-off.',
    variants: [
      { id: 'dif-alb', label: 'Warm Alabaster', sku: 'GH-DF-ALB-01', priceAed: 295, compareAtPriceAed: 340 },
    ],
  },
  {
    id: 'prod-jojoba',
    handle: 'golden-jojoba-carrier-oil',
    title: 'Cold-Pressed Golden Jojoba Oil',
    titleAr: 'زيت الجوجوبا الذهبي المعصور على البارد',
    botanicalName: 'Simmondsia chinensis',
    plantPart: 'Seeds',
    extractionMethod: 'Unrefined Cold-Pressed',
    countryOfOrigin: 'Peru',
    category: 'Carrier Oils',
    isBestseller: true,
    bottleStyle: 'amber-bottle',
    description:
      'Biomimetic golden liquid wax ester expeller-pressed from jojoba seeds to balance skin moisture and dilute essential oils cleanly.',
    variants: [
      { id: 'joj-100', label: '100ml', sku: 'GH-CO-JOJ-100', priceAed: 145 },
    ],
  },
  {
    id: 'prod-peppermint',
    handle: 'peppermint-essential-oil',
    title: 'Indian Peppermint Essential Oil',
    titleAr: 'زيت النعناع الفلفلي النقي',
    botanicalName: 'Mentha piperita',
    plantPart: 'Aerial Leaves',
    extractionMethod: 'Steam Distillation',
    countryOfOrigin: 'India',
    category: 'Essential Oils',
    isBestseller: false,
    bottleStyle: 'violet-dropper',
    description:
      'Crisp, cooling Mentha piperita essential oil steam-distilled from aerial leaves for invigorating workspace diffusion.',
    variants: [
      { id: 'pep-10', label: '10ml', sku: 'GH-EO-PEP-10', priceAed: 55 },
      { id: 'pep-30', label: '30ml', sku: 'GH-EO-PEP-30', priceAed: 125 },
    ],
  },
  {
    id: 'prod-bergamot',
    handle: 'calabrian-bergamot-essential-oil',
    title: 'Calabrian Bergamot FCF Oil',
    titleAr: 'زيت البرغموت الإيطالي',
    botanicalName: 'Citrus bergamia',
    plantPart: 'Fruit Peel',
    extractionMethod: 'Cold Expression',
    countryOfOrigin: 'Calabria, Italy',
    category: 'Essential Oils',
    isBestseller: false,
    bottleStyle: 'violet-dropper',
    description:
      'Sun-ripened bergamot peel cold-expressed in Calabria, Italy with a bright, uplifting citrus profile.',
    variants: [
      { id: 'brg-10', label: '10ml', sku: 'GH-EO-BRG-10', priceAed: 89 },
    ],
  },
  {
    id: 'prod-blackseed',
    handle: 'black-seed-nigella-oil',
    title: 'Egyptian Black Seed Botanical Oil',
    titleAr: 'زيت الحبة السوداء المصري البكر',
    botanicalName: 'Nigella sativa',
    plantPart: 'Seeds',
    extractionMethod: 'Cold-Pressed Unrefined',
    countryOfOrigin: 'Egypt',
    category: 'Carrier Oils',
    isBestseller: false,
    bottleStyle: 'amber-bottle',
    description:
      'First-press unrefined Egyptian Nigella sativa oil revered in traditional care rituals for scalp vitality and rich skin nourishment.',
    variants: [
      { id: 'bls-100', label: '100ml', sku: 'GH-CO-BLS-100', priceAed: 135 },
    ],
  },
  {
    id: 'prod-nebulizer',
    handle: 'nebulizing-walnut-diffuser',
    title: 'Waterless Glass Nebulizer Diffuser',
    titleAr: 'مبخرة الزجاج والخشب بدون ماء',
    botanicalName: 'Hand-Blown Glass',
    plantPart: 'Waterless Atomizer',
    extractionMethod: 'Cold-Air Nebulizer',
    countryOfOrigin: 'Artisan Studio',
    category: 'Diffusers',
    isBestseller: false,
    bottleStyle: 'ceramic-diffuser',
    description:
      'Cold-air nebulizing diffuser pairing hand-blown glass with a solid walnut base to disperse pure essential oils without water or heat.',
    variants: [
      { id: 'neb-wal', label: 'Walnut & Glass', sku: 'GH-DF-NEB-01', priceAed: 385 },
    ],
  },
];

export function filterProductsByTab(products: DemoProduct[], tab: CollectionTabKey): DemoProduct[] {
  if (tab === 'Bestsellers') {
    return products.filter((p) => p.isBestseller);
  }
  return products.filter((p) => p.category === tab);
}

export function computeCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceAed * item.quantity, 0);
}

export function computeCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function computeFreeShippingProgress(
  subtotalAed: number,
  thresholdAed: number = FREE_SHIPPING_THRESHOLD_AED
): {
  eligible: boolean;
  remainingAed: number;
  percent: number;
} {
  const safeThreshold = Math.max(1, thresholdAed);
  const remainingAed = Math.max(0, safeThreshold - subtotalAed);
  const percent = Math.min(100, Math.round((subtotalAed / safeThreshold) * 100));
  return {
    eligible: subtotalAed >= safeThreshold,
    remainingAed,
    percent,
  };
}

export function calculateDiscountBadge(variant: ProductVariant): number | null {
  if (!variant.compareAtPriceAed || variant.compareAtPriceAed <= variant.priceAed) {
    return null;
  }
  return variant.compareAtPriceAed - variant.priceAed;
}
