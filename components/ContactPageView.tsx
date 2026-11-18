'use client';

import { useState } from 'react';
import { Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import {
  validateContactForm,
  type ContactFormValues,
  type ContactValidationErrors,
} from '@/lib/store-pages';

export default function ContactPageView() {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    topic: 'Aromatherapy Consultation',
    message: '',
  });
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [submittedSummary, setSubmittedSummary] = useState<ContactFormValues | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmittedSummary(values);
    setValues({
      name: '',
      email: '',
      phone: '',
      topic: 'Aromatherapy Consultation',
      message: '',
    });
  };

  return (
    <section aria-labelledby="contact-page-heading" className="pb-16">
      <div className="bg-[#F2EFE9] border-b border-[#E2DDD2] py-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B43]">
            Botanical Concierge
          </p>
          <h1
            id="contact-page-heading"
            className="font-serif text-4xl sm:text-5xl font-semibold text-[#0D2F32]"
          >
            Connect With Our Team
          </h1>
          <p className="text-sm sm:text-base text-[#526162]">
            Questions about dilution blends, wholesale refills, order status, or botanical
            origin details? Our team responds within 1 business day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border border-[#E2DDD2] rounded-md p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#0D2F32] mb-1">
              Send a Direct Inquiry
            </h2>
            <p className="text-xs text-[#526162] mb-6">
              Uses Shopify&apos;s native <code className="font-mono">{'{% form "contact" %}'}</code>{' '}
              architecture in production.
            </p>

            {submittedSummary && (
              <div
                role="status"
                className="mb-6 p-4 rounded-md bg-[#E9F3EC] border border-[#217C42] text-[#0D2F32] flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#217C42] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-semibold">
                    Thank you, {submittedSummary.name}. Your inquiry has been received.
                  </p>
                  <p className="text-xs text-[#526162] mt-1">
                    Topic: {submittedSummary.topic} &middot; Reply will be sent to{' '}
                    {submittedSummary.email}.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#0D2F32] mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#E2DDD2] rounded focus:outline-none focus:border-[#217C42]"
                    placeholder="Amira Al-Mansoor"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="text-xs text-[#9E3D31] mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#0D2F32] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#E2DDD2] rounded focus:outline-none focus:border-[#217C42]"
                    placeholder="amira@example.com"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="text-xs text-[#9E3D31] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#0D2F32] mb-1.5"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={values.phone}
                    onChange={(e) => setValues({ ...values, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#E2DDD2] rounded focus:outline-none focus:border-[#217C42]"
                    placeholder="+971 50 000 0000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#0D2F32] mb-1.5"
                  >
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={values.topic}
                    onChange={(e) => setValues({ ...values, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#E2DDD2] rounded focus:outline-none focus:border-[#217C42]"
                  >
                    <option value="Aromatherapy Consultation">Aromatherapy Consultation</option>
                    <option value="Order & Delivery">Order &amp; Delivery</option>
                    <option value="Wholesale & Spa Partnerships">Wholesale &amp; Spa Partnerships</option>
                    <option value="Botanical Origin Details">Botanical Origin Details</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#0D2F32] mb-1.5"
                >
                  How Can We Help?
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={values.message}
                  onChange={(e) => setValues({ ...values, message: e.target.value })}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F5] border border-[#E2DDD2] rounded focus:outline-none focus:border-[#217C42]"
                  placeholder="Share your question regarding oil pairing, delivery, or wholesale..."
                />
                {errors.message && (
                  <p id="contact-message-error" className="text-xs text-[#9E3D31] mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="px-6 min-h-[46px] rounded bg-[#0D2F32] text-[#FAF9F5] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#217C42] transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Concierge Details Column */}
          <div className="lg:col-span-5 bg-[#F2EFE9] border border-[#E2DDD2] rounded-md p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-[#0D2F32]">
              Concierge Channels
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3 border-b border-[#E2DDD2] pb-4">
                <Mail className="w-4 h-4 text-[#217C42] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B43]">
                    Customer Care &amp; Consultations
                  </div>
                  <div className="font-semibold text-[#0D2F32] mt-0.5">care@ghosoun.com</div>
                  <p className="text-xs text-[#526162] mt-0.5">
                    Personalized dilution blends &amp; order concierge
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-b border-[#E2DDD2] pb-4">
                <MapPin className="w-4 h-4 text-[#217C42] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B43]">
                    Ghosoun Apothecary Studio
                  </div>
                  <div className="font-semibold text-[#0D2F32] mt-0.5">
                    Editable in Shopify Theme Customizer
                  </div>
                  <p className="text-xs text-[#526162] mt-0.5">
                    Regional dispatch details configured per market
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#217C42] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B43]">
                    Concierge Hours
                  </div>
                  <div className="font-semibold text-[#0D2F32] mt-0.5">
                    Mon – Sat, 9:00 AM – 6:00 PM GST
                  </div>
                  <p className="text-xs text-[#526162] mt-0.5">
                    Wholesale &amp; hospitality partners: partners@ghosoun.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
