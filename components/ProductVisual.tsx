'use client';

import { Droplet, Leaf, Wind } from 'lucide-react';
import type { DemoProduct } from '@/lib/demo-catalog';

interface ProductVisualProps {
  bottleStyle: DemoProduct['bottleStyle'];
  title: string;
  compact?: boolean;
}

export default function ProductVisual({
  bottleStyle,
  title,
  compact = false,
}: ProductVisualProps) {
  if (bottleStyle === 'ceramic-diffuser') {
    return (
      <div
        aria-label={title}
        className={`relative flex items-center justify-center w-full h-full ${
          compact ? 'scale-75' : ''
        }`}
      >
        <div className="flex flex-col items-center">
          <Wind className="w-5 h-5 text-[#C59B43] mb-2 stroke-[1.5]" aria-hidden="true" />
          <div className="w-20 h-28 rounded-t-[40px] rounded-b-xl bg-gradient-to-b from-[#FFFFFF] via-[#F7F5EF] to-[#E8E2D5] border border-[#D4CCBD] shadow-sm flex flex-col items-center justify-end pb-3 relative overflow-hidden">
            <div className="w-10 h-1 rounded-full bg-[#C59B43]/50 mb-3" />
            <div className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#0D2F32]">
              Ghosoun
            </div>
            <div className="w-full h-2.5 bg-[#C59B43]/25 border-t border-[#C59B43]/40 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  const isDarkBottle = bottleStyle === 'violet-dropper';

  return (
    <div
      aria-label={title}
      className={`relative flex items-center justify-center w-full h-full ${
        compact ? 'scale-75' : ''
      }`}
    >
      <div className="flex flex-col items-center">
        {isDarkBottle ? (
          <>
            <div className="w-4 h-5 rounded-t-full bg-[#0D2F32]" />
            <div className="w-7 h-2.5 rounded-sm bg-[#164246] border-b border-[#C59B43]/50" />
          </>
        ) : (
          <div className="w-7 h-4 rounded-t-sm bg-[#0D2F32] border-b border-[#C59B43]/50" />
        )}

        <div
          className={`w-16 h-24 rounded-t-2xl rounded-b-md border shadow-sm flex flex-col items-center justify-center px-1.5 relative ${
            isDarkBottle
              ? 'bg-gradient-to-br from-[#14474B] via-[#0D2F32] to-[#081F21] border-[#1E565B]'
              : 'bg-gradient-to-br from-[#2B8A4E] via-[#217C42] to-[#13522A] border-[#2C9653]'
          }`}
        >
          <div className="w-full py-2.5 px-1 rounded-[2px] bg-[#FAF9F5] border border-[#E2DDD2] flex flex-col items-center text-center">
            {isDarkBottle ? (
              <Droplet className="w-3 h-3 text-[#217C42] mb-0.5" aria-hidden="true" />
            ) : (
              <Leaf className="w-3 h-3 text-[#217C42] mb-0.5" aria-hidden="true" />
            )}
            <span className="text-[7px] font-bold tracking-[0.14em] uppercase text-[#0D2F32] leading-tight">
              Ghosoun
            </span>
            <span className="text-[7px] text-[#C59B43] leading-tight font-semibold">
              غصون
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
