'use client';

import { X, ShoppingBag, Trash2, Heart } from 'lucide-react';
import type { DemoProduct, ProductVariant } from '@/lib/demo-catalog';
import ProductVisual from './ProductVisual';

interface WishlistDrawerProps {
  isOpen: boolean;
  products: DemoProduct[];
  onClose: () => void;
  onRemove: (product: DemoProduct) => void;
  onAddToCart: (product: DemoProduct, variant: ProductVariant) => void;
}

export default function WishlistDrawer({
  isOpen,
  products,
  onClose,
  onRemove,
  onAddToCart,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0D2F32]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-drawer-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md h-full bg-[#FAF9F5] text-[#142224] border-s border-[#E2DDD2] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD2]">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#217C42]" aria-hidden="true" />
            <h2
              id="wishlist-drawer-heading"
              className="font-serif text-2xl font-semibold text-[#0D2F32]"
            >
              Saved Botanicals
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#526162] hover:bg-[#F2EFE9] hover:text-[#0D2F32] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <Heart
                className="w-9 h-9 text-[#526162] mx-auto mb-3 stroke-[1.5]"
                aria-hidden="true"
              />
              <p className="font-serif text-xl text-[#0D2F32] mb-2">
                No botanical oils saved yet
              </p>
              <p className="text-sm text-[#526162] mb-6">
                Tap the heart icon on any essential oil, carrier oil, or diffuser to bookmark it
                here.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors cursor-pointer"
              >
                Explore Oils
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const defaultVariant = product.variants[0];
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3.5 bg-white border border-[#E2DDD2] rounded-md"
                  >
                    <div className="w-20 h-24 rounded bg-[#F2EFE9] shrink-0 overflow-hidden">
                      <ProductVisual
                        bottleStyle={product.bottleStyle}
                        title={product.title}
                        compact
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-serif italic text-xs text-[#C59B43]">
                            {product.botanicalName}
                          </p>
                          <h3 className="text-sm font-semibold text-[#0D2F32] leading-snug">
                            {product.title}
                          </h3>
                          <p className="text-xs text-[#526162] mt-1 tabular-nums">
                            {defaultVariant.label} &middot; AED {defaultVariant.priceAed}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(product)}
                          aria-label={`Remove ${product.title} from wishlist`}
                          className="p-1.5 text-[#526162] hover:text-[#0D2F32] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            onAddToCart(product, defaultVariant);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                          Move to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
