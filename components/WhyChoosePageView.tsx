'use client';

import { ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { COMPARISON_ROWS, WHY_CHOOSE_PILLARS } from '@/lib/store-pages';

interface WhyChoosePageViewProps {
  onShopNow: () => void;
}

export default function WhyChoosePageView({ onShopNow }: WhyChoosePageViewProps) {
  return (
    <section aria-labelledby="why-choose-heading" className="pb-16">
      <div className="bg-[#F2EFE9] border-b border-[#E2DDD2] py-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B43]">
            The Ghosoun Standard
          </p>
          <h1
            id="why-choose-heading"
            className="font-serif text-4xl sm:text-5xl font-semibold text-[#0D2F32]"
          >
            Why Choose Our Botanical Oils
          </h1>
          <p className="text-sm sm:text-base text-[#526162]">
            From cold-pressed virgin seed extraction without hexane solvents to full botanical
            species disclosure and UV-shielded dark apothecary glass.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 space-y-14">
        {/* 6-Card Purity Standard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white border border-[#E2DDD2] rounded-md p-6 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B43]">
                  {pillar.kicker}
                </span>
                <ShieldCheck className="w-4 h-4 text-[#217C42]" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#0D2F32]">{pillar.title}</h2>
              <p className="text-sm text-[#526162] leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Purity Benchmark Comparison Table */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C59B43] mb-1">
              Purity Benchmark
            </p>
            <h2 className="font-serif text-3xl font-semibold text-[#0D2F32]">
              Ghosoun vs. Typical Commercial Oils
            </h2>
          </div>

          <div className="overflow-x-auto bg-white border border-[#E2DDD2] rounded-md">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="bg-[#F2EFE9] border-b border-[#E2DDD2] text-xs uppercase tracking-wider text-[#0D2F32]">
                  <th className="py-3.5 px-5 font-semibold">Quality Standard</th>
                  <th className="py-3.5 px-5 font-semibold">Ghosoun</th>
                  <th className="py-3.5 px-5 font-semibold text-[#526162]">
                    Conventional Alternative
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD2]">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.criterion}>
                    <td className="py-4 px-5 font-medium text-[#0D2F32]">{row.criterion}</td>
                    <td className="py-4 px-5 font-medium text-[#217C42]">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {row.ghosoun}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#526162]">{row.commercial}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onShopNow}
              className="inline-flex items-center gap-2 px-6 min-h-[46px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors cursor-pointer"
            >
              Shop Single-Origin Oils
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
