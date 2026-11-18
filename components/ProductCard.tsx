'use client';

import { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { calculateDiscountBadge, type DemoProduct, type ProductVariant } from '@/lib/demo-catalog';
import ProductVisual from './ProductVisual';

interface ProductCardProps {
  product: DemoProduct;
  isWishlisted: boolean;
  onToggleWishlist: (product: DemoProduct) => void;
  onAddToCart: (product: DemoProduct, variant: ProductVariant) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];

  const savings = calculateDiscountBadge(activeVariant);

  return (
    <article className="group flex flex-col bg-white border border-[#E2DDD2] rounded-md overflow-hidden transition-all hover:border-[#C59B43] hover:shadow-md">
      <div className="relative aspect-[4/5] bg-[#F2EFE9] flex items-center justify-center p-6">
        <ProductVisual bottleStyle={product.bottleStyle} title={product.title} />

        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Save ${product.title} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="absolute top-3 end-3 w-10 h-10 rounded-full bg-[#FAF9F5]/95 border border-[#E2DDD2] flex items-center justify-center text-[#0D2F32] hover:border-[#C59B43] transition-colors cursor-pointer"
        >
          <Heart
            className={`w-[18px] h-[18px] transition-colors ${
              isWishlisted ? 'fill-[#217C42] text-[#217C42]' : 'text-[#526162]'
            }`}
            aria-hidden="true"
          />
        </button>

        <span className="absolute bottom-3 start-3 text-[11px] font-medium tracking-wide text-[#526162]">
          {product.countryOfOrigin} &middot; {product.extractionMethod}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex-1">
          <p className="font-serif italic text-sm text-[#C59B43] font-medium mb-0.5">
            {product.botanicalName}
          </p>
          <h3 className="text-[15px] font-semibold text-[#0D2F32] leading-snug line-clamp-2">
            {product.title}
          </h3>

          <div
            className="flex flex-wrap gap-1.5 mt-3"
            role="group"
            aria-label={`Select size for ${product.title}`}
          >
            {product.variants.map((variant) => {
              const isSelected = variant.id === activeVariant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  aria-pressed={isSelected}
                  className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D2F32] text-[#FAF9F5] border-[#0D2F32]'
                      : 'bg-[#FAF9F5] text-[#526162] border-[#E2DDD2] hover:border-[#C59B43]'
                  }`}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2DDD2]/80 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums min-w-0">
            <span className="text-base font-semibold text-[#0D2F32] whitespace-nowrap">
              AED {activeVariant.priceAed}
            </span>
            {activeVariant.compareAtPriceAed && (
              <span className="text-xs text-[#526162] line-through whitespace-nowrap">
                AED {activeVariant.compareAtPriceAed}
              </span>
            )}
            {savings !== null && (
              <span className="text-[11px] font-semibold text-[#217C42] whitespace-nowrap">
                Save {savings}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product, activeVariant)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 min-h-[40px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
