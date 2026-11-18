/**
 * ============================================================================
 * GHOSOUN (غصون) SHOPIFY OS 2.0 — NATIVE VANILLA ES6 WEB COMPONENTS
 * Custom Elements:
 *   1. <header-drawer>
 *   2. <mega-menu>
 *   3. <header-search>
 *   4. <hero-slider>
 *   5. <faq-accordion>
 *   6. <collection-tabs>
 *   7. <variant-radios>
 *   8. <product-form>
 *   9. <cart-drawer>
 *  10. <wishlist-drawer>
 *  11. <mobile-bottom-nav>
 *  12. <newsletter-popup>
 *  13. <localization-form>
 * ============================================================================
 */

const t = (key, fallback, replacements = {}) => {
  const dict = window.theme?.translations || {};
  let value = typeof dict[key] === 'string' && dict[key].length > 0 ? dict[key] : fallback;
  Object.entries(replacements).forEach(([token, replacement]) => {
    value = value.replace(`{{ ${token} }}`, replacement).replace(`__${token.toUpperCase()}__`, replacement);
  });
  return value;
};

const escapeHtml = (unsafe) =>
  String(unsafe || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatBotanicalMoney = (cents) => {
  const numeric = Number(cents || 0) / 100;
  const formatTemplate = window.theme?.moneyFormat;
  if (formatTemplate && formatTemplate.includes('{{')) {
    const fixedTwo = numeric.toLocaleString(window.theme?.locale || undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const noDecimals = Math.round(numeric).toLocaleString(window.theme?.locale || undefined);
    return formatTemplate
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, noDecimals)
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, fixedTwo.replace('.', ','))
      .replace(/\{\{\s*amount\s*\}\}/g, fixedTwo)
      .replace(/<[^>]+>/g, '');
  }

  const activeCurrency = window.Shopify?.currency?.active || 'AED';
  try {
    return numeric.toLocaleString(window.theme?.locale || undefined, {
      style: 'currency',
      currency: activeCurrency
    });
  } catch {
    return `${activeCurrency} ${numeric.toFixed(2)}`;
  }
};

/* --------------------------------------------------------------------------
 * 1. <header-drawer> Web Component
 * -------------------------------------------------------------------------- */
class HeaderDrawer extends HTMLElement {
  connectedCallback() {
    this.drawerBackdrop = this.querySelector('#MobileNavDrawer') || document.getElementById('MobileNavDrawer');
    this.openBtn = this.querySelector('.mobile-menu-toggle') || document.querySelector('.mobile-menu-toggle');
    this.closeBtn = this.querySelector('[data-drawer-close]');
    this.lastFocused = null;

    if (this.openBtn && this.drawerBackdrop) {
      this.openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    }

    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === this.drawerBackdrop) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawerBackdrop?.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  open() {
    if (!this.drawerBackdrop) return;
    this.lastFocused = document.activeElement;
    this.drawerBackdrop.classList.add('is-open');
    this.drawerBackdrop.setAttribute('aria-hidden', 'false');
    if (this.openBtn) this.openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      this.closeBtn?.focus();
    }, 50);
  }

  close() {
    if (!this.drawerBackdrop) return;
    if (this.openBtn) this.openBtn.setAttribute('aria-expanded', 'false');
    this.drawerBackdrop.classList.remove('is-open');
    this.drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (this.lastFocused && typeof this.lastFocused.focus === 'function') {
      this.lastFocused.focus();
    }
  }
}

if (!customElements.get('header-drawer')) {
  customElements.define('header-drawer', HeaderDrawer);
}

/* --------------------------------------------------------------------------
 * 2. <mega-menu> Web Component
 * -------------------------------------------------------------------------- */
class MegaMenu extends HTMLElement {
  connectedCallback() {
    this.items = this.querySelectorAll('.header-menu-item');
    this.items.forEach((item) => {
      const panel = item.querySelector('.mega-menu-panel');
      const link = item.querySelector('.header-menu-link');
      if (!panel || !link) return;

      const setOpen = (open) => {
        item.classList.toggle('is-open', open);
        link.setAttribute('aria-expanded', String(open));
      };

      item.addEventListener('mouseenter', () => setOpen(true));
      item.addEventListener('mouseleave', () => setOpen(false));

      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setOpen(true);
          panel.querySelector('a')?.focus();
        }
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          setOpen(false);
          link.focus();
        }
      });
    });
  }
}

if (!customElements.get('mega-menu')) {
  customElements.define('mega-menu', MegaMenu);
}

/* --------------------------------------------------------------------------
 * 3. <header-search> Web Component
 * -------------------------------------------------------------------------- */
class HeaderSearch extends HTMLElement {
  connectedCallback() {
    this.openBtn = this.querySelector('[data-search-open]');
    this.closeBtn = this.querySelector('[data-search-close]');
    this.overlay = this.querySelector('.header-search-overlay');
    this.input = this.querySelector('[data-search-input]');
    this.resultsEl = this.querySelector('[data-search-results]');
    this.defaultResultsHtml = this.resultsEl ? this.resultsEl.innerHTML : '';
    this.debounceTimer = null;

    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.input) {
      this.input.addEventListener('input', () => {
        window.clearTimeout(this.debounceTimer);
        const query = this.input.value.trim();
        if (query.length < 2) {
          if (this.resultsEl) this.resultsEl.innerHTML = this.defaultResultsHtml;
          return;
        }
        this.debounceTimer = window.setTimeout(() => this.fetchSuggestions(query), 220);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay && !this.overlay.hidden) {
        this.close();
      }
    });
  }

  open() {
    if (!this.overlay) return;
    this.overlay.hidden = false;
    if (this.openBtn) this.openBtn.setAttribute('aria-expanded', 'true');
    this.input?.focus();
  }

  close() {
    if (!this.overlay) return;
    this.overlay.hidden = true;
    if (this.openBtn) {
      this.openBtn.setAttribute('aria-expanded', 'false');
      this.openBtn.focus();
    }
  }

  async fetchSuggestions(query) {
    if (!this.resultsEl) return;
    try {
      const rootUrl = window.Shopify?.routes?.root || '/';
      const res = await fetch(
        `${rootUrl}search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,article,page&resources[limit]=4`
      );
      if (!res.ok) return;
      const data = await res.json();
      const products = data?.resources?.results?.products || [];
      if (products.length === 0) {
        const msg = escapeHtml(t('searchNoResults', `No matching results found for "${query}".`, { terms: query }));
        this.resultsEl.innerHTML = `<p style="margin-top: 1.4rem; color: var(--color-text-muted); font-size: 1.35rem;">${msg}</p>`;
        return;
      }

      this.resultsEl.innerHTML = `
        <div class="header-predictive-list">
          ${products
            .map(
              (p) => `
            <a href="${escapeHtml(p.url)}" class="header-predictive-item">
              ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" width="48" height="48" style="object-fit: cover; border-radius: var(--image-radius, 4px);" />` : ''}
              <div>
                <div style="font-weight: 600; font-size: 1.35rem; color: var(--color-primary);">${escapeHtml(p.title)}</div>
                <div style="font-size: 1.2rem; color: var(--color-accent);">${escapeHtml(p.price || '')}</div>
              </div>
            </a>`
            )
            .join('')}
        </div>`;
    } catch {
      // Safe fallback to full search form submit
    }
  }
}

if (!customElements.get('header-search')) {
  customElements.define('header-search', HeaderSearch);
}

/* --------------------------------------------------------------------------
 * 4. <hero-slider> Web Component
 * -------------------------------------------------------------------------- */
class HeroSlider extends HTMLElement {
  connectedCallback() {
    this.slides = Array.from(this.querySelectorAll('.hero-slide'));
    this.dots = Array.from(this.querySelectorAll('[data-hero-dot]'));
    this.prevBtn = this.querySelector('[data-hero-prev]');
    this.nextBtn = this.querySelector('[data-hero-next]');
    this.activeIndex = 0;

    if (this.slides.length <= 1) return;

    this.prevBtn?.addEventListener('click', () => this.goTo(this.activeIndex - 1));
    this.nextBtn?.addEventListener('click', () => this.goTo(this.activeIndex + 1));
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => this.goTo(idx));
    });
  }

  goTo(index) {
    if (this.slides.length === 0) return;
    this.activeIndex = (index + this.slides.length) % this.slides.length;
    this.slides.forEach((slide, i) => {
      const active = i === this.activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    this.dots.forEach((dot, i) => {
      const active = i === this.activeIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }
}

if (!customElements.get('hero-slider')) {
  customElements.define('hero-slider', HeroSlider);
}

/* --------------------------------------------------------------------------
 * 5. <faq-accordion> Web Component
 * -------------------------------------------------------------------------- */
class FaqAccordion extends HTMLElement {
  connectedCallback() {
    this.searchInput = this.querySelector('[data-faq-search]');
    this.catButtons = this.querySelectorAll('[data-faq-category-btn]');
    this.items = this.querySelectorAll('[data-faq-item]');
    this.emptyEl = this.querySelector('[data-faq-empty]');
    this.activeCategory = 'all';

    this.querySelectorAll('[data-faq-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });

    this.catButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.dataset.faqCategoryBtn || 'all';
        this.catButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
        this.filter();
      });
    });

    this.searchInput?.addEventListener('input', () => this.filter());
  }

  filter() {
    const query = (this.searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    this.items.forEach((item) => {
      const cat = (item.dataset.faqCategory || '').toLowerCase();
      const text = item.textContent.toLowerCase();
      const matchesCat = this.activeCategory === 'all' || cat === this.activeCategory.toLowerCase();
      const matchesText = !query || text.includes(query);
      const show = matchesCat && matchesText;
      item.style.display = show ? '' : 'none';
      if (show) visibleCount += 1;
    });

    if (this.emptyEl) {
      this.emptyEl.hidden = visibleCount > 0;
    }
  }
}

if (!customElements.get('faq-accordion')) {
  customElements.define('faq-accordion', FaqAccordion);
}

/* --------------------------------------------------------------------------
 * 6. <collection-tabs> Web Component
 * -------------------------------------------------------------------------- */
class CollectionTabs extends HTMLElement {
  connectedCallback() {
    this.triggers = this.querySelectorAll('.tab-trigger');
    this.panels = this.querySelectorAll('.tabs-panel');

    this.triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetSelector = btn.getAttribute('data-tab-target');
        this.triggers.forEach((tr) => {
          tr.classList.remove('is-active');
          tr.setAttribute('aria-selected', 'false');
        });
        this.panels.forEach((p) => p.classList.remove('is-active'));

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        const panel = this.querySelector(targetSelector);
        if (panel) panel.classList.add('is-active');
      });
    });
  }
}

if (!customElements.get('collection-tabs')) {
  customElements.define('collection-tabs', CollectionTabs);
}

/* --------------------------------------------------------------------------
 * 7. <variant-radios> Web Component
 * -------------------------------------------------------------------------- */
class VariantRadios extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.section;
    this.productUrl = this.dataset.url;
    this.addEventListener('change', () => this.onVariantChange());
  }

  getVariantData() {
    if (!this.variantData) {
      const scriptEl = this.querySelector('script[type="application/json"]');
      this.variantData = scriptEl ? JSON.parse(scriptEl.textContent) : [];
    }
    return this.variantData;
  }

  onVariantChange() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    const selectedOptions = fieldsets.map((fs) => {
      const checked = fs.querySelector('input[type="radio"]:checked');
      const labelSpan = fs.querySelector('[data-selected-option-value]');
      if (labelSpan && checked) labelSpan.textContent = checked.value;
      return checked ? checked.value : null;
    });

    const currentVariant = this.getVariantData().find((variant) =>
      variant.options.every((opt, index) => opt === selectedOptions[index])
    );

    if (!currentVariant) {
      this.updateAvailability({ available: false });
      return;
    }

    this.updateUrl(currentVariant.id);
    this.updateFormInput(currentVariant.id);
    this.updatePriceAndSku(currentVariant);
    this.updateAvailability(currentVariant);
    this.updateMediaGallery(currentVariant);
  }

  updateUrl(variantId) {
    if (!this.productUrl) return;
    window.history.replaceState({}, '', `${this.productUrl}?variant=${variantId}`);
  }

  updateFormInput(variantId) {
    const form = document.getElementById(`ProductForm-${this.sectionId}`);
    if (!form) return;
    const idInput = form.querySelector('input[name="id"]');
    if (idInput) idInput.value = variantId;
  }

  updatePriceAndSku(variant) {
    const priceWrapper = document.getElementById(`ProductPrice-${this.sectionId}`);
    if (priceWrapper) {
      const priceEl = priceWrapper.querySelector('[data-product-price]');
      if (priceEl) priceEl.textContent = formatBotanicalMoney(variant.price);

      const compareEl = priceWrapper.querySelector('[data-product-compare-price]');
      const saveBadge = priceWrapper.querySelector('[data-product-save-badge]');
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        if (compareEl) {
          compareEl.textContent = formatBotanicalMoney(variant.compare_at_price);
          compareEl.style.display = '';
        }
        if (saveBadge) {
          const saved = formatBotanicalMoney(variant.compare_at_price - variant.price);
          saveBadge.textContent = t('saveAmount', `Save ${saved}`, { amount: saved });
          saveBadge.style.display = '';
        }
      } else {
        if (compareEl) compareEl.style.display = 'none';
        if (saveBadge) saveBadge.style.display = 'none';
      }
    }

    const skuEl = document.getElementById(`ProductSku-${this.sectionId}`);
    if (skuEl) {
      if (variant.sku) {
        skuEl.textContent = `${t('skuLabel', 'SKU')}: ${variant.sku}`;
        skuEl.style.display = '';
      } else {
        skuEl.style.display = 'none';
      }
    }
  }

  updateAvailability(variant) {
    const form = document.getElementById(`ProductForm-${this.sectionId}`);
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = form.querySelector('[data-add-to-cart-text]') || submitBtn;
    const stockBadge = document.getElementById(`ProductStockStatus-${this.sectionId}`);
    if (!submitBtn) return;

    if (variant.available) {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = t('addToCart', 'Add to Bag');
      if (stockBadge) {
        stockBadge.textContent = t('inStock', 'In stock and ready to ship');
        stockBadge.dataset.available = 'true';
      }
    } else {
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = t('soldOut', 'Out of Stock');
      if (stockBadge) {
        stockBadge.textContent = t('soldOut', 'Out of Stock');
        stockBadge.dataset.available = 'false';
      }
    }
  }

  updateMediaGallery(variant) {
    if (!variant.featured_media) return;
    const mediaId = String(variant.featured_media.id);
    const stage = document.getElementById(`ProductGalleryStage-${this.sectionId}`);
    if (!stage) return;

    stage.querySelectorAll('.product-gallery-slide').forEach((slide) => {
      slide.classList.toggle('is-active', slide.dataset.mediaId === mediaId);
    });

    document.querySelectorAll('[data-thumb-media-id]').forEach((thumb) => {
      thumb.classList.toggle('is-active', thumb.dataset.thumbMediaId === mediaId);
    });
  }
}

if (!customElements.get('variant-radios')) {
  customElements.define('variant-radios', VariantRadios);
}

/* --------------------------------------------------------------------------
 * 8. <product-form> Web Component (Zero Native Dialogs, Inline Error Handling)
 * -------------------------------------------------------------------------- */
class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    if (!this.form) return;
    this.errorEl = this.querySelector('[data-product-form-error]');
    if (!this.errorEl) {
      this.errorEl = document.createElement('div');
      this.errorEl.className = 'product-form-error';
      this.errorEl.setAttribute('role', 'alert');
      this.errorEl.hidden = true;
      this.form.appendChild(this.errorEl);
    }
    this.form.dataset.boundProductForm = 'true';
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  showError(message) {
    if (!this.errorEl) return;
    this.errorEl.textContent = message;
    this.errorEl.hidden = false;
  }

  clearError() {
    if (!this.errorEl) return;
    this.errorEl.textContent = '';
    this.errorEl.hidden = true;
  }

  async onSubmit(e) {
    e.preventDefault();
    this.clearError();

    const submitBtn = this.form.querySelector('[type="submit"]');
    const textNode = this.form.querySelector('[data-add-to-cart-text]') || submitBtn;
    const originalText = textNode ? textNode.textContent : '';

    if (submitBtn) submitBtn.disabled = true;
    if (textNode) textNode.textContent = t('adding', 'Adding...');

    try {
      const formData = new FormData(this.form);
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' }
      });

      const result = await response.json();
      if (!response.ok) {
        this.showError(result.description || result.message || t('addError', 'Unable to update your bag right now. Please try again.'));
        return;
      }

      const drawer = document.querySelector('cart-drawer') || window.ghosounCart;
      if (drawer && typeof drawer.open === 'function') {
        await drawer.refresh();
        drawer.open();
      } else {
        window.location.href = `${window.Shopify?.routes?.root || '/'}cart`;
      }
    } catch {
      this.showError(t('addError', 'Unable to update your bag right now. Please try again.'));
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (textNode) textNode.textContent = originalText;
    }
  }
}

if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm);
}

/* --------------------------------------------------------------------------
 * 9. <cart-drawer> Web Component
 * -------------------------------------------------------------------------- */
class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.lastFocused = null;
    this.bindEvents();
  }

  bindEvents() {
    const trigger = document.getElementById('CartTrigger');
    if (trigger && !trigger.dataset.cartBound) {
      trigger.dataset.cartBound = 'true';
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    this.addEventListener('click', (e) => {
      if (e.target === this || e.target.closest('[data-cart-close]') || e.target.closest('#CartDrawerClose')) {
        this.close();
        return;
      }

      const changeBtn = e.target.closest('[data-cart-change]');
      if (changeBtn) {
        e.preventDefault();
        const line = Number(changeBtn.dataset.line);
        const quantity = Number(changeBtn.dataset.quantity);
        this.updateLineQuantity(line, quantity);
      }
    });

    this.addEventListener('change', (e) => {
      if (e.target.matches('[data-cart-note]')) {
        fetch(`${window.Shopify?.routes?.root || '/'}cart/update.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: e.target.value })
        }).catch(() => {});
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  open() {
    this.lastFocused = document.activeElement;
    this.refresh();
    this.classList.add('is-open');
    this.setAttribute('aria-hidden', 'false');
    const trigger = document.getElementById('CartTrigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      this.querySelector('#CartDrawerClose')?.focus();
    }, 50);
  }

  close() {
    this.classList.remove('is-open');
    this.setAttribute('aria-hidden', 'true');
    const trigger = document.getElementById('CartTrigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (this.lastFocused && typeof this.lastFocused.focus === 'function') {
      this.lastFocused.focus();
    }
  }

  async updateLineQuantity(line, quantity) {
    try {
      const res = await fetch(`${window.Shopify?.routes?.root || '/'}cart/change.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity })
      });
      const cart = await res.json();
      if (!res.ok) {
        const errorBox = this.querySelector('[data-cart-drawer-error]');
        if (errorBox) {
          errorBox.textContent = cart.description || cart.message || t('addError', 'Unable to update your bag right now.');
          errorBox.hidden = false;
        }
        return;
      }
      await this.refresh(cart);
    } catch {
      const errorBox = this.querySelector('[data-cart-drawer-error]');
      if (errorBox) {
        errorBox.textContent = t('addError', 'Unable to update your bag right now.');
        errorBox.hidden = false;
      }
    }
  }

  async refresh(prefetchedCart = null) {
    try {
      const rootUrl = window.Shopify?.routes?.root || '/';
      const sectionRes = await fetch(`${rootUrl}?sections=cart-drawer`);
      if (sectionRes.ok) {
        const sections = await sectionRes.json();
        if (sections['cart-drawer']) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(sections['cart-drawer'], 'text/html');
          const renderedDrawer = doc.querySelector('cart-drawer .cart-drawer');
          const currentDrawer = this.querySelector('.cart-drawer');
          if (renderedDrawer && currentDrawer) {
            currentDrawer.innerHTML = renderedDrawer.innerHTML;
          }
        }
      }

      const cart = prefetchedCart || (await (await fetch(`${rootUrl}cart.js`)).json());
      const badge = document.getElementById('CartItemCount');
      if (badge) badge.textContent = cart.item_count;

      const mobileBadge = document.getElementById('MobileCartCount');
      if (mobileBadge) {
        mobileBadge.textContent = cart.item_count;
        mobileBadge.hidden = cart.item_count === 0;
      }
    } catch {
      // Non-fatal in preview environments without /cart.js
    }
  }
}

if (!customElements.get('cart-drawer')) {
  customElements.define('cart-drawer', CartDrawer);
}

/* --------------------------------------------------------------------------
 * 10. <wishlist-drawer> Web Component
 * -------------------------------------------------------------------------- */
class WishlistDrawer extends HTMLElement {
  constructor() {
    super();
    this.storageKey = 'ghosoun_wishlist';
  }

  connectedCallback() {
    this.listEl = this.querySelector('#WishlistDrawerItemList');
    this.syncUI();

    this.addEventListener('click', (e) => {
      if (e.target === this || e.target.closest('[data-wishlist-close]')) {
        this.close();
        return;
      }
      const removeBtn = e.target.closest('[data-wishlist-remove]');
      if (removeBtn) {
        this.removeItem(removeBtn.dataset.wishlistRemove);
      }
    });

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-wishlist-toggle]');
      if (!toggleBtn) return;
      e.preventDefault();
      this.toggleItem({
        id: toggleBtn.dataset.productId,
        title: toggleBtn.dataset.productTitle,
        url: toggleBtn.dataset.productUrl,
        price: toggleBtn.dataset.productPrice,
        image: toggleBtn.dataset.productImage
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  saveItems(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // Storage blocked
    }
    this.syncUI();
  }

  toggleItem(item) {
    const items = this.getItems();
    const exists = items.some((x) => String(x.id) === String(item.id));
    const next = exists ? items.filter((x) => String(x.id) !== String(item.id)) : [...items, item];
    this.saveItems(next);
  }

  removeItem(id) {
    const next = this.getItems().filter((x) => String(x.id) !== String(id));
    this.saveItems(next);
  }

  open() {
    this.syncUI();
    this.classList.add('is-open');
    this.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.classList.remove('is-open');
    this.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  syncUI() {
    const items = this.getItems();
    const ids = new Set(items.map((x) => String(x.id)));

    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const isSaved = ids.has(String(btn.dataset.productId));
      btn.classList.toggle('is-saved', isSaved);
      btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    });

    const mobileWishlistBadge = document.getElementById('MobileWishlistCount');
    if (mobileWishlistBadge) {
      mobileWishlistBadge.textContent = items.length;
      mobileWishlistBadge.hidden = items.length === 0;
    }

    if (!this.listEl) return;
    if (items.length === 0) {
      this.listEl.innerHTML = `
        <div style="text-align: center; padding: 5rem 1.5rem;">
          <p style="color: var(--color-text-muted); margin-bottom: 2rem;">${escapeHtml(t('wishlistEmpty', 'No items saved to your wishlist yet.'))}</p>
          <a href="${window.Shopify?.routes?.root || '/'}collections/all" class="btn btn-primary btn-sm">${escapeHtml(t('wishlistExplore', 'Explore Collections'))}</a>
        </div>`;
      return;
    }

    const removeLabel = escapeHtml(t('wishlistRemove', 'Remove from Wishlist'));
    this.listEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.6rem;">
        ${items
          .map(
            (item) => `
          <div style="display: flex; gap: 1.4rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1.4rem; align-items: center;">
            ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" style="width: 64px; height: 64px; object-fit: cover; border-radius: var(--image-radius, 6px);" />` : ''}
            <div style="flex: 1;">
              <a href="${escapeHtml(item.url || '#')}" style="font-weight: 600; font-size: 1.35rem; color: var(--color-primary); display: block;">${escapeHtml(item.title)}</a>
              <div style="font-size: 1.3rem; font-weight: 700; color: var(--color-accent); margin-top: 0.3rem;">${escapeHtml(item.price || '')}</div>
            </div>
            <button type="button" class="header-action-icon" data-wishlist-remove="${escapeHtml(item.id)}" aria-label="${removeLabel}">&times;</button>
          </div>`
          )
          .join('')}
      </div>`;
  }
}

if (!customElements.get('wishlist-drawer')) {
  customElements.define('wishlist-drawer', WishlistDrawer);
}

/* --------------------------------------------------------------------------
 * 11. <mobile-bottom-nav> Web Component
 * -------------------------------------------------------------------------- */
class MobileBottomNav extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-mobile-nav-action]');
      if (!actionBtn) return;

      const action = actionBtn.dataset.mobileNavAction;
      if (action === 'cart') {
        e.preventDefault();
        const drawer = document.querySelector('cart-drawer') || window.ghosounCart;
        if (drawer && typeof drawer.open === 'function') drawer.open();
      } else if (action === 'wishlist') {
        e.preventDefault();
        const wishlistDrawer = document.querySelector('wishlist-drawer');
        if (wishlistDrawer && typeof wishlistDrawer.open === 'function') wishlistDrawer.open();
      } else if (action === 'menu') {
        e.preventDefault();
        const headerDrawer = document.querySelector('header-drawer');
        if (headerDrawer && typeof headerDrawer.open === 'function') headerDrawer.open();
      }
    });
  }
}

if (!customElements.get('mobile-bottom-nav')) {
  customElements.define('mobile-bottom-nav', MobileBottomNav);
}

/* --------------------------------------------------------------------------
 * 12. <newsletter-popup> Web Component (5-Second Timed Modal + Success State)
 * -------------------------------------------------------------------------- */
class NewsletterPopup extends HTMLElement {
  connectedCallback() {
    this.storageKey = 'ghosoun_newsletter_dismissed_until';
    this.delaySeconds = Number(this.dataset.delaySeconds || 5);
    this.dismissDays = Number(this.dataset.dismissDays || 7);
    this.timerId = null;

    this.closeButtons = this.querySelectorAll('[data-popup-close]');
    this.form = this.querySelector('form');
    this.emailInput = this.querySelector('[data-popup-email]');
    this.errorBanner = this.querySelector('[data-popup-error]');
    this.promptBox = this.querySelector('[data-popup-prompt]');
    this.clientSuccessBox = this.querySelector('[data-popup-client-success]');
    this.serverSuccess = this.querySelector('[data-popup-success="true"]');
    this.serverError = this.querySelector('[data-popup-server-error="true"]');

    this.closeButtons.forEach((btn) => btn.addEventListener('click', () => this.dismiss()));
    this.addEventListener('click', (e) => {
      if (e.target === this) this.dismiss();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.classList.contains('is-open')) {
        this.dismiss();
      }
    });

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        if (!this.emailInput) return;
        const emailVal = this.emailInput.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

        if (!isValid) {
          e.preventDefault();
          if (this.errorBanner) {
            this.errorBanner.textContent = t('invalidEmail', 'Please enter a valid email address.');
            this.errorBanner.hidden = false;
          }
          this.emailInput.focus();
          return;
        }

        if (this.errorBanner) this.errorBanner.hidden = true;
        this.persistDismissal(30);
      });
    }

    const params = new URLSearchParams(window.location.search);
    if (this.serverSuccess || params.get('customer_posted') === 'true' || this.serverError) {
      this.open();
      if (params.get('customer_posted') === 'true' && this.promptBox && this.clientSuccessBox) {
        this.promptBox.hidden = true;
        this.clientSuccessBox.hidden = false;
      }
      return;
    }

    const inThemeEditor = Boolean(window.Shopify && window.Shopify.designMode);
    if (!inThemeEditor && this.isDismissed()) return;

    this.timerId = window.setTimeout(() => {
      this.open();
    }, Math.max(0, this.delaySeconds) * 1000);
  }

  disconnectedCallback() {
    if (this.timerId) window.clearTimeout(this.timerId);
  }

  isDismissed() {
    try {
      const until = Number(localStorage.getItem(this.storageKey) || 0);
      return until > Date.now();
    } catch {
      return false;
    }
  }

  persistDismissal(days) {
    try {
      const ms = Math.max(1, days) * 24 * 60 * 60 * 1000;
      localStorage.setItem(this.storageKey, String(Date.now() + ms));
    } catch {
      // Storage blocked
    }
  }

  open() {
    this.classList.add('is-open');
    this.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      if (this.emailInput && this.promptBox && !this.promptBox.hidden) {
        this.emailInput.focus();
      }
    }, 60);
  }

  dismiss() {
    this.classList.remove('is-open');
    this.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.persistDismissal(this.dismissDays);
  }
}

if (!customElements.get('newsletter-popup')) {
  customElements.define('newsletter-popup', NewsletterPopup);
}

/* --------------------------------------------------------------------------
 * 13. <localization-form> Web Component
 * -------------------------------------------------------------------------- */
class LocalizationForm extends HTMLElement {
  connectedCallback() {
    this.select = this.querySelector('select[name="locale_code"]');
    this.form = this.querySelector('form');
    if (this.select && this.form) {
      this.select.addEventListener('change', () => this.form.submit());
    }
  }
}

if (!customElements.get('localization-form')) {
  customElements.define('localization-form', LocalizationForm);
}

/* --------------------------------------------------------------------------
 * 14. <product-recommendations> Web Component
 * -------------------------------------------------------------------------- */
class ProductRecommendations extends HTMLElement {
  connectedCallback() {
    const url = this.dataset.url;
    if (!url) return;

    const loadRecommendations = () => {
      fetch(url)
        .then((res) => res.text())
        .then((text) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          const fetched = doc.querySelector('product-recommendations');
          if (fetched && fetched.innerHTML.trim().length > 0) {
            this.innerHTML = fetched.innerHTML;
          }
        })
        .catch(() => {});
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          if (!entries[0]?.isIntersecting) return;
          obs.unobserve(this);
          loadRecommendations();
        },
        { rootMargin: '0px 0px 300px 0px' }
      );
      observer.observe(this);
    } else {
      loadRecommendations();
    }
  }
}

if (!customElements.get('product-recommendations')) {
  customElements.define('product-recommendations', ProductRecommendations);
}

/* --------------------------------------------------------------------------
 * Global Initializer: Sticky Scroll, Product Gallery, Zoom & Quantity Steppers
 * -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const drawerEl = document.querySelector('cart-drawer');
  if (drawerEl) window.ghosounCart = drawerEl;

  // Sticky / transparent header scroll detection
  const headerEl = document.querySelector('.site-header');
  if (headerEl) {
    const syncScroll = () => {
      headerEl.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
  }

  // Product thumbnails
  document.addEventListener('click', (e) => {
    const thumbBtn = e.target.closest('[data-thumb-media-id]');
    if (thumbBtn) {
      const mediaId = thumbBtn.dataset.thumbMediaId;
      const galleryCol = thumbBtn.closest('.product-media-column');
      if (!galleryCol) return;

      galleryCol.querySelectorAll('.product-gallery-slide').forEach((slide) => {
        slide.classList.toggle('is-active', slide.dataset.mediaId === mediaId);
      });
      galleryCol.querySelectorAll('[data-thumb-media-id]').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.thumbMediaId === mediaId);
      });
      return;
    }

    const zoomTrigger = e.target.closest('[data-zoom-trigger]');
    if (zoomTrigger) {
      const sectionId = zoomTrigger.dataset.zoomTrigger;
      const stage = document.getElementById(`ProductGalleryStage-${sectionId}`);
      const modal = document.getElementById(`ProductZoomModal-${sectionId}`);
      const zoomImg = document.getElementById(`ProductZoomImg-${sectionId}`);
      const activeSlide = stage?.querySelector('.product-gallery-slide.is-active');

      if (activeSlide && zoomImg && activeSlide.dataset.zoomSrc) {
        zoomImg.src = activeSlide.dataset.zoomSrc;
      }
      if (modal) modal.classList.add('is-open');
      return;
    }

    const zoomClose = e.target.closest('[data-zoom-close]');
    if (zoomClose) {
      const sectionId = zoomClose.dataset.zoomClose;
      document.getElementById(`ProductZoomModal-${sectionId}`)?.classList.remove('is-open');
      return;
    }

    const openZoomModal = e.target.closest('.product-zoom-modal');
    if (openZoomModal && e.target === openZoomModal) {
      openZoomModal.classList.remove('is-open');
      return;
    }

    const qtyBtn = e.target.closest('[data-qty-change]');
    if (qtyBtn) {
      const delta = Number(qtyBtn.dataset.qtyChange);
      const input = qtyBtn.parentElement?.querySelector('input[type="number"]');
      if (!input) return;
      input.value = Math.max(1, Number(input.value || 1) + delta);
    }
  });

  // Collection filter checkboxes auto-submit when toggled
  document.addEventListener('change', (e) => {
    const checkbox = e.target.closest('#CollectionFiltersForm input[type="checkbox"]');
    if (checkbox && checkbox.form) {
      checkbox.form.submit();
    }
  });

  // Close zoom modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.product-zoom-modal.is-open').forEach((modal) => {
        modal.classList.remove('is-open');
      });
    }
  });
});
