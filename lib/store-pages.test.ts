import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BLOG_ARTICLES,
  COMPARISON_ROWS,
  FAQ_ITEMS,
  NEWSLETTER_POPUP_DELAY_MS,
  filterBlogArticles,
  filterFaqItems,
  shouldShowNewsletterPopup,
  validateContactForm,
  validateNewsletterEmail,
} from './store-pages';

test('filterFaqItems filters by category and keyword accurately', () => {
  const all = filterFaqItems(FAQ_ITEMS, 'All', '');
  assert.equal(all.length, FAQ_ITEMS.length);

  const purityOnly = filterFaqItems(FAQ_ITEMS, 'Purity & Sourcing', '');
  assert.equal(purityOnly.every((i) => i.category === 'Purity & Sourcing'), true);
  assert.ok(purityOnly.length >= 2);

  const keywordMatch = filterFaqItems(FAQ_ITEMS, 'All', 'dark glass');
  assert.equal(keywordMatch.length, 1);
  assert.equal(keywordMatch[0].id, 'faq-2');

  const noMatch = filterFaqItems(FAQ_ITEMS, 'Orders & Shipping', 'distilled');
  assert.equal(noMatch.length, 0);
});

test('filterBlogArticles returns all or matches chosen category', () => {
  assert.equal(filterBlogArticles(BLOG_ARTICLES, 'All').length, BLOG_ARTICLES.length);
  const scalp = filterBlogArticles(BLOG_ARTICLES, 'Hair & Scalp Rituals');
  assert.equal(scalp.length, 1);
  assert.equal(scalp[0].slug, 'diluting-rosemary-for-scalp-vitality');
});

test('COMPARISON_ROWS uses ghosoun comparison keys without fabricated ratings', () => {
  assert.ok(COMPARISON_ROWS.length >= 4);
  for (const row of COMPARISON_ROWS) {
    assert.ok(row.ghosoun.length > 0);
    assert.ok(row.commercial.length > 0);
  }
});

test('validateContactForm validates required fields and email format', () => {
  const emptyErrors = validateContactForm({
    name: '   ',
    email: '',
    phone: '',
    topic: 'Order & Delivery',
    message: 'short',
  });
  assert.ok(emptyErrors.name);
  assert.ok(emptyErrors.email);
  assert.ok(emptyErrors.message);

  const badEmail = validateContactForm({
    name: 'Amira',
    email: 'not-an-email',
    phone: '',
    topic: 'Order & Delivery',
    message: 'Checking dilution ratio for rosemary essential oil.',
  });
  assert.equal(badEmail.name, undefined);
  assert.ok(badEmail.email);
  assert.equal(badEmail.message, undefined);

  const valid = validateContactForm({
    name: 'Amira',
    email: 'amira@example.com',
    phone: '+971500000000',
    topic: 'Order & Delivery',
    message: 'Could you share the botanical species details for Rosemary 30ml?',
  });
  assert.deepEqual(valid, {});
});

test('validateNewsletterEmail and 5-second popup timing rules', () => {
  assert.equal(NEWSLETTER_POPUP_DELAY_MS, 5000);
  assert.equal(validateNewsletterEmail('  '), 'Please enter your email address.');
  assert.equal(validateNewsletterEmail('invalid-email'), 'Please enter a valid email address.');
  assert.equal(validateNewsletterEmail('amira@ghosoun.com'), null);

  assert.equal(shouldShowNewsletterPopup(1000, null), true);
  assert.equal(shouldShowNewsletterPopup(1000, 2000), false);
  assert.equal(shouldShowNewsletterPopup(2500, 2000), true);
});
