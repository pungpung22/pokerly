'use client';

import { Quote, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('Landing');

  const testimonials = [
    { stars: 5, content: t('testimonials.items.1.content'), name: t('testimonials.items.1.name'), info: t('testimonials.items.1.info') },
    { stars: 5, content: t('testimonials.items.2.content'), name: t('testimonials.items.2.name'), info: t('testimonials.items.2.info') },
    { stars: 5, content: t('testimonials.items.3.content'), name: t('testimonials.items.3.name'), info: t('testimonials.items.3.info') },
  ];

  return (
    <section id="testimonials" className="section" style={{ background: '#0A0A0B' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title">
            {t('testimonials.title')}
          </h2>
        </div>

        {/* Testimonials grid - responsive 3 columns */}
        <div className="grid-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card" style={{ position: 'relative' }}>
              {/* Quote decoration */}
              <Quote style={{ position: 'absolute', top: '20px', right: '20px', width: '36px', height: '36px', color: '#27272A' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} style={{ width: '18px', height: '18px', fill: '#14B8A6', color: '#14B8A6' }} />
                ))}
              </div>

              {/* Content */}
              <p style={{ color: '#FAFAFA', marginBottom: '24px', lineHeight: 1.7 }}>
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p style={{ color: 'white', fontWeight: 'bold' }}>{testimonial.name}</p>
                <p style={{ color: '#D4D4D8' }}>{testimonial.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
