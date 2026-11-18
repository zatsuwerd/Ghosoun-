import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

test('All required Ghosoun Shopify OS 2.0 theme files and logo assets exist', () => {
  const requiredFiles = [
    'config/settings_schema.json',
    'config/settings_data.json',
    'locales/en.default.json',
    'locales/ar.json',
    'layout/theme.liquid',
    'assets/base.css',
    'assets/theme.js',
    'assets/ghosoun-logo.jpg',
    'public/assets/aistudio/ghosoun_logo_dfa0af8a.jpg',
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

  for (const relPath of requiredFiles) {
    const fullPath = path.join(rootDir, relPath);
    assert.equal(fs.existsSync(fullPath), true, `Missing required file: ${relPath}`);
  }
});

test('config/settings_schema.json and config/settings_data.json are valid and compliant', () => {
  const raw = fs.readFileSync(path.join(rootDir, 'config/settings_schema.json'), 'utf8');
  const schema = JSON.parse(raw);
  assert.equal(Array.isArray(schema), true);

  for (const group of schema) {
    if (!group.settings) continue;
    for (const s of group.settings) {
      if (s.type === 'range') {
        const steps = (s.max - s.min) / s.step;
        assert.equal(steps <= 100, true, `Range ${s.id} exceeds 100 steps: ${steps}`);
        assert.equal((s.default - s.min) % s.step === 0, true, `Range ${s.id} default ${s.default} not aligned with step ${s.step}`);
      }
    }
  }

  const dataRaw = fs.readFileSync(path.join(rootDir, 'config/settings_data.json'), 'utf8');
  assert.doesNotThrow(() => JSON.parse(dataRaw));
});

test('All JSON templates & section groups parse cleanly and reference existing sections', () => {
  const checkTemplateJson = (filePath: string) => {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert.ok(parsed.sections && typeof parsed.sections === 'object', `Missing sections object in ${filePath}`);
    assert.ok(Array.isArray(parsed.order), `Missing order array in ${filePath}`);
    for (const sectionId of parsed.order) {
      const def = parsed.sections[sectionId];
      assert.ok(def && def.type, `Section "${sectionId}" in ${filePath} missing type`);
      const liquidPath = path.join(rootDir, 'sections', `${def.type}.liquid`);
      assert.equal(fs.existsSync(liquidPath), true, `Template ${filePath} references missing sections/${def.type}.liquid`);
    }
  };

  for (const groupFile of ['header-group.json', 'footer-group.json']) {
    checkTemplateJson(path.join(rootDir, 'sections', groupFile));
  }

  const templatesDir = path.join(rootDir, 'templates');
  for (const tpl of fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'))) {
    checkTemplateJson(path.join(templatesDir, tpl));
  }
});

test('All section {% schema %} blocks contain valid JSON, range math, presets, and block shopify_attributes', () => {
  const sectionsDir = path.join(rootDir, 'sections');
  const files = fs.readdirSync(sectionsDir).filter((f) => f.endsWith('.liquid'));

  const validateRangeList = (settings: Array<Record<string, unknown>>, label: string) => {
    for (const s of settings) {
      if (s.type === 'range') {
        const min = Number(s.min);
        const max = Number(s.max);
        const step = Number(s.step);
        const def = Number(s.default);
        const steps = (max - min) / step;
        assert.equal(steps <= 100, true, `${label} range ${s.id} exceeds 100 steps`);
        assert.equal((def - min) % step === 0, true, `${label} range ${s.id} default misaligned`);
      }
    }
  };

  for (const file of files) {
    const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
    const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    assert.ok(match, `Missing {% schema %} in sections/${file}`);
    const parsed = JSON.parse(match[1]);
    assert.ok(parsed.name, `Missing schema name in sections/${file}`);

    if (Array.isArray(parsed.settings)) {
      validateRangeList(parsed.settings, `sections/${file}`);
    }
    if (Array.isArray(parsed.blocks)) {
      for (const blk of parsed.blocks) {
        if (Array.isArray(blk.settings)) {
          validateRangeList(blk.settings, `sections/${file} block:${blk.type}`);
        }
      }
    }

    // Verify block loop outputs block.shopify_attributes
    if (/for\s+block\s+in\s+section\.blocks/.test(content)) {
      assert.equal(
        content.includes('block.shopify_attributes'),
        true,
        `sections/${file} iterates section.blocks without {{ block.shopify_attributes }}`
      );
    }

    // Verify non-main/non-static sections include presets
    const isFixedTemplateOrGroupSection =
      file.startsWith('main-') ||
      file.startsWith('page-') ||
      ['announcement-bar.liquid', 'header.liquid', 'footer.liquid', 'cart-drawer.liquid', 'wishlist-drawer.liquid', 'mobile-bottom-nav.liquid', 'newsletter-popup.liquid'].includes(file);

    if (!isFixedTemplateOrGroupSection) {
      assert.equal(
        Array.isArray(parsed.presets) && parsed.presets.length > 0,
        true,
        `sections/${file} missing presets array`
      );
    }
  }
});

test('Every settings.<id> reference in Liquid exists in config/settings_schema.json', () => {
  const rawSchema = JSON.parse(fs.readFileSync(path.join(rootDir, 'config/settings_schema.json'), 'utf8'));
  const validIds = new Set<string>();
  for (const group of rawSchema) {
    if (group.settings) {
      for (const s of group.settings) {
        validIds.add(s.id);
      }
    }
  }

  const dirs = ['layout', 'sections', 'snippets'];
  for (const d of dirs) {
    const files = fs.readdirSync(path.join(rootDir, d)).filter((f) => f.endsWith('.liquid'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(rootDir, d, file), 'utf8');
      const regex = /\bsettings\.([a-zA-Z0-9_]+)/g;
      let m;
      while ((m = regex.exec(content)) !== null) {
        const prefix = content.slice(Math.max(0, m.index - 8), m.index);
        if (prefix.endsWith('section.') || prefix.endsWith('block.')) continue;
        assert.equal(validIds.has(m[1]), true, `Unknown global setting settings.${m[1]} in ${d}/${file}`);
      }
    }
  }
});

test('Every translation key | t exists in both locales/en.default.json and locales/ar.json', () => {
  const enLocales = JSON.parse(fs.readFileSync(path.join(rootDir, 'locales/en.default.json'), 'utf8'));
  const arLocales = JSON.parse(fs.readFileSync(path.join(rootDir, 'locales/ar.json'), 'utf8'));

  const resolveKey = (dict: Record<string, unknown>, keyPath: string): unknown => {
    return keyPath.split('.').reduce((acc: any, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
  };

  const dirs = ['layout', 'sections', 'snippets'];
  for (const d of dirs) {
    const files = fs.readdirSync(path.join(rootDir, d)).filter((f) => f.endsWith('.liquid'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(rootDir, d, file), 'utf8');
      const regex = /['"]([a-z0-9_.]+)['"]\s*\|\s*t\b/g;
      let m;
      while ((m = regex.exec(content)) !== null) {
        assert.notEqual(resolveKey(enLocales, m[1]), undefined, `Missing EN key "${m[1]}" in ${d}/${file}`);
        assert.notEqual(resolveKey(arLocales, m[1]), undefined, `Missing AR key "${m[1]}" in ${d}/${file}`);
      }
    }
  }
});

test('Theme files pass hygiene check: zero deprecated Liquid tags, zero alert(), zero legacy brand or fabricated strings', () => {
  const forbiddenPatterns: Array<{ label: string; regex: RegExp }> = [
    { label: 'deprecated {% include %}', regex: /\{%\s*include\b/ },
    { label: 'deprecated img_url', regex: /\|\s*img_url\b/ },
    { label: 'deprecated product_img_url', regex: /\|\s*product_img_url\b/ },
    { label: 'CSS @import in base.css', regex: /@import\s+/ },
    { label: 'window alert()', regex: /(?:window\.)?\balert\s*\(/ },
    { label: 'Aroma Tierra legacy brand', regex: /aroma[\s_-]*tierra/i },
    { label: 'fabricated 4.9 / 5 rating', regex: /4\.9\s*\/\s*5/i },
    { label: 'fabricated 601+ claim', regex: /601\+/i },
    { label: 'fabricated Award-winning claim', regex: /award[-\s]?winning/i },
  ];

  const scanDirs = ['layout', 'sections', 'snippets', 'assets', 'config', 'locales', 'templates', 'demo'];
  for (const dir of scanDirs) {
    const fullDir = path.join(rootDir, dir);
    for (const entry of fs.readdirSync(fullDir)) {
      if (/\.(jpg|png|jpeg|webp)$/i.test(entry)) continue;
      const content = fs.readFileSync(path.join(fullDir, entry), 'utf8');
      for (const rule of forbiddenPatterns) {
        assert.equal(
          rule.regex.test(content),
          false,
          `Found ${rule.label} in ${dir}/${entry}`
        );
      }
    }
  }
});
