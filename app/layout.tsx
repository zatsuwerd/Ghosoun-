import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ghosoun (غصون) — Botanical Oils & Shopify OS 2.0 Storefront',
  description:
    'Ghosoun (غصون) production Shopify Online Store 2.0 theme and botanical storefront for single-origin essential oils, first-press carrier elixirs, and ceramic diffusers.',
  openGraph: {
    title: 'Ghosoun (غصون) — Botanical Oils & Shopify OS 2.0 Storefront',
    description:
      'Production-ready Shopify Online Store 2.0 theme and bilingual botanical storefront for Ghosoun.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghosoun (غصون) — Botanical Oils & Shopify OS 2.0',
    description:
      'Ghosoun Shopify OS 2.0 theme with EN/AR RTL support, botanical catalog, and responsive storefront.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${cairo.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-[#FAF9F5] text-[#142224] font-sans antialiased selection:bg-[#0D2F32] selection:text-[#FAF9F5]"
      >
        {children}
      </body>
    </html>
  );
}
