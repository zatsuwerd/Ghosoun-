'use client';

import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, Mail, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { validateNewsletterEmail } from '@/lib/store-pages';
import ProductVisual from './ProductVisual';

interface NewsletterPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreOils: () => void;
}

export default function NewsletterPopupModal({
  isOpen,
  onClose,
  onExploreOils,
}: NewsletterPopupModalProps) {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !subscribedEmail) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
  }, [isOpen, subscribedEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateNewsletterEmail(email);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    setErrorMsg(null);
    setSubscribedEmail(email.trim());
    setEmail('');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('WELCOME10');
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      // Clipboard unavailable in restricted browser context
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2F32]/55 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-popup-heading"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-[#FAF9F5] text-[#142224] border border-[#E2DDD2] rounded-md shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close newsletter popup"
              className="absolute top-3.5 end-3.5 z-10 w-9 h-9 rounded-full bg-[#FAF9F5]/95 border border-[#E2DDD2] flex items-center justify-center text-[#0D2F32] hover:bg-[#0D2F32] hover:text-[#FAF9F5] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Botanical Editorial Visual */}
              <div className="md:col-span-5 bg-[#F2EFE9] border-b md:border-b-0 md:border-e border-[#E2DDD2] p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-28 h-32 flex items-center justify-center">
                  <ProductVisual
                    bottleStyle="violet-dropper"
                    title="Tunisian Rosemary Essential Oil"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C59B43]">
                    Ghosoun Botanical Privilege
                  </p>
                  <p className="font-serif text-base font-semibold text-[#0D2F32]">
                    10% Off First Harvest
                  </p>
                </div>
              </div>

              {/* Right Interactive Form / Success State */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
                {subscribedEmail ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="space-y-4 text-center md:text-start"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#E9F3EC] border border-[#217C42]/30 text-[#217C42] inline-flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C59B43]">
                        Subscription Confirmed
                      </p>
                      <h2
                        id="newsletter-popup-heading"
                        className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D2F32] leading-tight"
                      >
                        Welcome to the Ghosoun Inner Circle
                      </h2>
                      <p className="text-sm text-[#526162] leading-relaxed">
                        Your welcome privilege and dilution guide have been prepared for{' '}
                        <strong className="text-[#0D2F32]">{subscribedEmail}</strong>.
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded bg-[#F2EFE9] border border-dashed border-[#C59B43]">
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#526162]">
                          Welcome Code
                        </span>
                        <span className="font-mono text-base font-bold tracking-[0.16em] text-[#0D2F32]">
                          WELCOME10
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-[#E2DDD2] text-xs font-semibold text-[#0D2F32] hover:border-[#217C42] cursor-pointer"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#217C42]" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onExploreOils();
                      }}
                      className="w-full min-h-[44px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#217C42] transition-colors cursor-pointer"
                    >
                      Explore Pure Oils
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="space-y-1.5 pe-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C59B43]">
                        Ghosoun Inner Circle
                      </p>
                      <h2
                        id="newsletter-popup-heading"
                        className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D2F32] leading-tight"
                      >
                        Receive 10% Off Your First Pure Harvest
                      </h2>
                      <p className="text-sm text-[#526162] leading-relaxed">
                        Join our community for single-origin harvest releases, dilution rituals,
                        and an instant welcome code.
                      </p>
                    </div>

                    {errorMsg && (
                      <div
                        role="alert"
                        className="px-3.5 py-2.5 rounded bg-[#FDF2F0] border border-[#9E3D31] text-xs text-[#6B261C]"
                      >
                        {errorMsg}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="newsletter-popup-email"
                          className="block text-[11px] font-semibold uppercase tracking-wider text-[#0D2F32] mb-1.5"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className="w-4 h-4 text-[#526162] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                          />
                          <input
                            ref={inputRef}
                            id="newsletter-popup-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errorMsg) setErrorMsg(null);
                            }}
                            placeholder="amira@example.com"
                            aria-invalid={Boolean(errorMsg)}
                            className="w-full ps-10 pe-3.5 py-2.5 text-sm bg-white border border-[#E2DDD2] rounded text-[#142224] placeholder:text-[#526162] focus:outline-none focus:border-[#217C42]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[46px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#217C42] transition-colors cursor-pointer"
                      >
                        Unlock 10% Welcome
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full text-center text-xs text-[#526162] underline hover:text-[#0D2F32] cursor-pointer pt-1"
                    >
                      No thanks, continue browsing
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
