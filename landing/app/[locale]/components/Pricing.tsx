'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

export default function Pricing() {
  const t = useTranslations('Landing');

  const plans = [
    {
      name: t('pricing.free.name'),
      price: t('pricing.free.price'),
      period: '',
      features: [
        t('pricing.free.features.uploads'),
        t('pricing.free.features.stats'),
        t('pricing.free.features.history')
      ],
      cta: t('pricing.free.cta'),
      popular: false
    },
    {
      name: t('pricing.pro.name'),
      price: t('pricing.pro.price'),
      period: t('pricing.pro.period'),
      features: [
        t('pricing.pro.features.uploads'),
        t('pricing.pro.features.stats'),
        t('pricing.pro.features.history'),
        t('pricing.pro.features.support')
      ],
      cta: t('pricing.pro.cta'),
      popular: true
    },
  ];

  return (
    <section className="section" style={{ background: 'rgba(20, 20, 22, 0.5)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            {t('pricing.title')}
          </h2>
          <p className="section-subtitle">{t('pricing.subtitle')}</p>
        </div>

        {/* Plans grid - responsive */}
        <div className="grid-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="card"
              style={{
                position: 'relative',
                border: plan.popular ? '2px solid #6366F1' : '1px solid #27272A',
                transform: plan.popular ? 'scale(1.02)' : 'none'
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '6px 20px',
                    borderRadius: '9999px',
                    background: '#6366F1',
                    color: 'white',
                    fontSize: 'var(--body-text)',
                    fontWeight: 500
                  }}
                >
                  {t('pricing.popular')}
                </span>
              )}

              {/* Plan name */}
              <h3 style={{ fontSize: 'var(--section-subtitle)', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{plan.name}</h3>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: 'var(--section-title)', fontWeight: 'bold', color: 'white' }}>{plan.price}</span>
                <span style={{ color: '#D4D4D8', fontSize: 'var(--body-text)' }}>{plan.period}</span>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Check style={{ width: '22px', height: '22px', color: '#00D4AA', flexShrink: 0 }} />
                    <span style={{ color: '#FAFAFA', fontSize: 'var(--body-text)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Link
                href="/login"
                className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
