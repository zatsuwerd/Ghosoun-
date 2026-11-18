'use client';

import { ArrowRight, Globe, FlaskConical, Leaf } from 'lucide-react';

interface AboutPageViewProps {
  onShopNow: () => void;
  onNavigateWhyChoose: () => void;
}

export default function AboutPageView({
  onShopNow,
  onNavigateWhyChoose,
}: AboutPageViewProps) {
  const milestones = [
    {
      icon: Globe,
      kicker: '01 · Origin',
      title: 'Regional Harvest Partnerships',
      desc: 'We select harvests where climate, soil minerals, and elevation naturally deepen plant chemistry—Provence lavender, Tunisian rosemary, Moroccan argan, and Dhofari Boswellia sacra.',
    },
    {
      icon: FlaskConical,
      kicker: '02 · Transparency',
      title: 'Open Botanical & Extraction Labeling',
      desc: 'Every essential and carrier oil discloses its Latin binomial, plant part harvested, and extraction craft with zero synthetic fragrances or mineral oil extenders.',
    },
    {
      icon: Leaf,
      kicker: '03 · Apothecary Vessel',
      title: 'UV-Protective Dark Apothecary Glass',
      desc: 'Dark glass shields delicate aromatic esters and cold-pressed polyunsaturated fatty acids from everyday visible light exposure.',
    },
  ];

  return (
    <section aria-labelledby="about-page-heading" className="pb-16">
      <div className="bg-[#F2EFE9] border-b border-[#E2DDD2] py-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B43]">
            Ghosoun Heritage &amp; Craft
          </p>
          <h1
            id="about-page-heading"
            className="font-serif text-4xl sm:text-5xl font-semibold text-[#0D2F32]"
          >
            Rooted in Nature. Crafted With Care.
          </h1>
          <p className="text-sm sm:text-base text-[#526162]">
            Ghosoun (غصون) brings uncompromised single-origin essential oils and cold-pressed
            botanicals from harvest regions directly to mindful daily rituals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif text-3xl font-semibold text-[#0D2F32]">
              Why Harvest Origin Shapes Botanical Character
            </h2>
            <p className="text-sm sm:text-base text-[#526162] leading-relaxed">
              Two drops of Lavender from different altitudes carry markedly distinct aromatic
              profiles. Rather than relying on anonymous commercial lots from fragrance brokers,
              Ghosoun partners with specialized distillers and cold-press producers committed to
              clean single-origin crops.
            </p>
            <p className="text-sm sm:text-base text-[#526162] leading-relaxed">
              Every bottle carries transparent origin details—botanical Latin binomial, plant part,
              extraction method, and harvest region—so you know precisely what enters your skincare
              and aromatherapy routines.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={onShopNow}
                className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#217C42] transition-colors cursor-pointer"
              >
                Explore Pure Oils
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onNavigateWhyChoose}
                className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded border border-[#0D2F32] text-[#0D2F32] text-xs font-semibold uppercase tracking-wider hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                Why Choose Ghosoun
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#F2EFE9] border border-[#E2DDD2] rounded-md p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF9F5] border border-[#E2DDD2] rounded">
                <div className="text-xl font-bold text-[#0D2F32]">Single-Origin</div>
                <div className="text-xs text-[#526162] mt-1">Named harvest terroir</div>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#E2DDD2] rounded">
                <div className="text-xl font-bold text-[#0D2F32] tabular-nums">100% Pure</div>
                <div className="text-xs text-[#526162] mt-1">Zero synthetic diluents</div>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#E2DDD2] rounded">
                <div className="text-xl font-bold text-[#0D2F32]">Cold-Pressed</div>
                <div className="text-xs text-[#526162] mt-1">Unrefined virgin oils</div>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#E2DDD2] rounded">
                <div className="text-xl font-bold text-[#0D2F32]">UV Dark Glass</div>
                <div className="text-xs text-[#526162] mt-1">Apothecary preservation</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white border border-[#E2DDD2] rounded-md p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B43]">
                    {item.kicker}
                  </span>
                  <Icon className="w-4 h-4 text-[#217C42]" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#0D2F32]">{item.title}</h3>
                <p className="text-sm text-[#526162] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
