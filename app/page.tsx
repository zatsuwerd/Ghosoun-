import fs from 'node:fs';
import path from 'node:path';
import StorefrontPreview from '@/components/StorefrontPreview';
import type { ThemeFileEntry } from '@/components/ThemeInspector';

const THEME_FILE_PATHS = [
  'config/settings_schema.json',
  'config/settings_data.json',
  'locales/en.default.json',
  'locales/ar.json',
  'layout/theme.liquid',
  'assets/base.css',
  'assets/theme.js',
  'demo/ghosoun-products.csv',
  'snippets/social-meta-tags.liquid',
  'snippets/structured-data.liquid',
  'snippets/product-card.liquid',
  'snippets/demo-product-card.liquid',
  'snippets/cart-drawer-markup.liquid',
  'sections/announcement-bar.liquid',
  'sections/header.liquid',
  'sections/footer.liquid',
  'sections/header-group.json',
  'sections/footer-group.json',
  'sections/hero-botanical-slider.liquid',
  'sections/trust-icons-bar.liquid',
  'sections/category-grid.liquid',
  'sections/featured-collection-tabs.liquid',
  'sections/featured-collections.liquid',
  'sections/featured-products.liquid',
  'sections/origin-story-split.liquid',
  'sections/educational-journal.liquid',
  'sections/testimonials.liquid',
  'sections/newsletter-banner.liquid',
  'sections/social-gallery.liquid',
  'sections/related-products.liquid',
  'sections/main-product.liquid',
  'sections/main-collection-grid.liquid',
  'sections/main-list-collections.liquid',
  'sections/main-search.liquid',
  'sections/main-404.liquid',
  'sections/cart-drawer.liquid',
  'sections/main-cart.liquid',
  'sections/mobile-bottom-nav.liquid',
  'sections/wishlist-drawer.liquid',
  'sections/main-page.liquid',
  'sections/page-faq.liquid',
  'sections/page-about.liquid',
  'sections/page-contact.liquid',
  'sections/page-why-choose.liquid',
  'sections/main-blog.liquid',
  'sections/main-article.liquid',
  'sections/newsletter-popup.liquid',
  'templates/index.json',
  'templates/product.json',
  'templates/collection.json',
  'templates/list-collections.json',
  'templates/search.json',
  'templates/404.json',
  'templates/cart.json',
  'templates/page.json',
  'templates/page.faq.json',
  'templates/page.about.json',
  'templates/page.contact.json',
  'templates/page.why-choose.json',
  'templates/blog.json',
  'templates/article.json',
  'build-theme.mjs',
];

export default function HomePage() {
  const rootDir = process.cwd();
  const files: ThemeFileEntry[] = THEME_FILE_PATHS.map((relPath) => {
    const fullPath = path.join(rootDir, relPath);
    const content = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : '';
    return {
      path: relPath,
      folder: relPath.includes('/') ? relPath.split('/')[0] : 'root',
      content,
      lines: content.split('\n').length,
      bytes: Buffer.byteLength(content, 'utf8'),
    };
  });

  return <StorefrontPreview themeFiles={files} />;
}
