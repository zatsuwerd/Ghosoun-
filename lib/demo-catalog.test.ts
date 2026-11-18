import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_PRODUCTS,
  filterProductsByTab,
  computeCartSubtotal,
  computeCartCount,
  computeFreeShippingProgress,
  calculateDiscountBadge,
} from './demo-catalog';

test('DEMO_PRODUCTS provides multi-category Ghosoun catalog items with GH SKUs', () => {
  assert.equal(DEMO_PRODUCTS.length, 12);
  assert.equal(filterProductsByTab(DEMO_PRODUCTS, 'Bestsellers').length, 8);
  assert.equal(filterProductsByTab(DEMO_PRODUCTS, 'Essential Oils').length, 5);
  assert.equal(filterProductsByTab(DEMO_PRODUCTS, 'Carrier Oils').length, 5);
  assert.equal(filterProductsByTab(DEMO_PRODUCTS, 'Diffusers').length, 2);

  for (const p of DEMO_PRODUCTS) {
    assert.ok(p.titleAr.trim().length > 0, `Missing Arabic title on ${p.id}`);
    for (const v of p.variants) {
      assert.equal(v.sku.startsWith('GH-'), true, `SKU ${v.sku} must start with GH-`);
    }
  }
});

test('Cart subtotal, item count, and free shipping progress calculate accurately', () => {
  const items = [
    {
      productId: 'prod-rosemary',
      variantId: 'ros-10',
      title: 'Tunisian Rosemary Essential Oil',
      variantLabel: '10ml',
      priceAed: 69,
      quantity: 2,
      bottleStyle: 'violet-dropper' as const,
    },
    {
      productId: 'prod-lavender',
      variantId: 'lav-10',
      title: 'French High-Altitude Lavender Oil',
      variantLabel: '10ml',
      priceAed: 79,
      quantity: 1,
      bottleStyle: 'violet-dropper' as const,
    },
  ];

  assert.equal(computeCartCount(items), 3);
  const subtotal = computeCartSubtotal(items);
  assert.equal(subtotal, 217);

  const progress = computeFreeShippingProgress(subtotal, 200);
  assert.equal(progress.eligible, true);
  assert.equal(progress.remainingAed, 0);
  assert.equal(progress.percent, 100);

  const partialProgress = computeFreeShippingProgress(100, 200);
  assert.equal(partialProgress.eligible, false);
  assert.equal(partialProgress.remainingAed, 100);
  assert.equal(partialProgress.percent, 50);
});

test('Discount savings badge calculates difference only when compare-at price is higher', () => {
  assert.equal(
    calculateDiscountBadge({ id: 'v1', label: '10ml', sku: 'GH-EO-ROS-10', priceAed: 69, compareAtPriceAed: 85 }),
    16
  );
  assert.equal(
    calculateDiscountBadge({ id: 'v2', label: '10ml', sku: 'GH-EO-LAV-10', priceAed: 79 }),
    null
  );
});
