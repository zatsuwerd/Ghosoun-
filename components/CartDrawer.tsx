'use client';

import { useState } from 'react';
import { X, Minus, Plus, Trash2, Truck, CheckCircle2 } from 'lucide-react';
import {
  computeCartSubtotal,
  computeFreeShippingProgress,
  FREE_SHIPPING_THRESHOLD_AED,
  type CartItem,
} from '@/lib/demo-catalog';
import ProductVisual from './ProductVisual';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [giftNote, setGiftNote] = useState('');
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);

  if (!isOpen) return null;

  const subtotal = computeCartSubtotal(items);
  const shipping = computeFreeShippingProgress(subtotal, FREE_SHIPPING_THRESHOLD_AED);

  const handleCheckout = () => {
    setCheckoutSubmitted(true);
    window.setTimeout(() => {
      onClearCart();
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0D2F32]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md h-full bg-[#FAF9F5] text-[#142224] border-s border-[#E2DDD2] flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD2]">
          <h2 id="cart-drawer-heading" className="font-serif text-2xl font-semibold text-[#0D2F32]">
            Your Apothecary Bag
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#526162] hover:bg-[#F2EFE9] hover:text-[#0D2F32] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="px-6 py-3.5 bg-[#F2EFE9] border-b border-[#E2DDD2]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#0D2F32] mb-2">
            <Truck className="w-4 h-4 text-[#217C42] shrink-0" aria-hidden="true" />
            {shipping.eligible ? (
              <span>You unlocked Complimentary Botanical Delivery.</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">AED {shipping.remainingAed}</strong> more for
                Complimentary Delivery.
              </span>
            )}
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E2DDD2] overflow-hidden">
            <div
              className="h-full bg-[#217C42] transition-all duration-300"
              style={{ width: `${shipping.percent}%` }}
            />
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {checkoutSubmitted ? (
            <div className="py-12 text-center">
              <CheckCircle2
                className="w-10 h-10 text-[#217C42] mx-auto mb-3"
                aria-hidden="true"
              />
              <h3 className="font-serif text-2xl font-semibold text-[#0D2F32] mb-2">
                Demo Order Prepared
              </h3>
              <p className="text-sm text-[#526162] max-w-xs mx-auto mb-6">
                In production Shopify OS 2.0, this transitions directly to Shopify Checkout via{' '}
                <code className="font-mono text-xs text-[#0D2F32]">/checkout</code>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCheckoutSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-xl text-[#0D2F32] mb-2">Your bag is currently empty</p>
              <p className="text-sm text-[#526162] mb-6">
                Explore single-origin essential oils, cold-pressed carrier oils, and ceramic
                diffusers.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors cursor-pointer"
              >
                Browse Botanicals
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-white border border-[#E2DDD2] rounded-md"
                >
                  <div className="w-20 h-24 rounded bg-[#F2EFE9] shrink-0 overflow-hidden">
                    <ProductVisual
                      bottleStyle={item.bottleStyle}
                      title={item.title}
                      compact
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-[#0D2F32] leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#C59B43] mt-0.5">{item.variantLabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.variantId)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="p-1.5 text-[#526162] hover:text-[#0D2F32] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-[#E2DDD2] rounded bg-[#FAF9F5]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.variantId, -1)}
                          aria-label={`Decrease quantity for ${item.title}`}
                          className="w-8 h-8 flex items-center justify-center text-[#0D2F32] hover:bg-[#F2EFE9] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.variantId, 1)}
                          aria-label={`Increase quantity for ${item.title}`}
                          className="w-8 h-8 flex items-center justify-center text-[#0D2F32] hover:bg-[#F2EFE9] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#0D2F32] tabular-nums">
                        AED {item.priceAed * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Gift Note */}
              <div className="pt-2">
                <label
                  htmlFor="cart-gift-note"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#526162] mb-1.5"
                >
                  Order / Botanical Gift Note
                </label>
                <textarea
                  id="cart-gift-note"
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Add a handwritten card message or delivery note..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E2DDD2] rounded focus:outline-none focus:border-[#217C42]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && !checkoutSubmitted && (
          <div className="p-6 border-t border-[#E2DDD2] bg-white space-y-4">
            <div className="flex items-center justify-between text-base font-semibold text-[#0D2F32]">
              <span>Subtotal</span>
              <span className="tabular-nums">AED {subtotal}</span>
            </div>
            <p className="text-xs text-[#526162]">
              Taxes and Shopify Markets regional shipping calculated at checkout.
            </p>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full min-h-[48px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#217C42] transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
