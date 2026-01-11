'use client';

import { Camera, Upload, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HowItWorks() {
  const t = useTranslations('Landing');

  const steps = [
    { number: '01', icon: Camera, title: t('howItWorks.step1.title'), description: t('howItWorks.step1.desc') },
    { number: '02', icon: Upload, title: t('howItWorks.step2.title'), description: t('howItWorks.step2.desc') },
    { number: '03', icon: TrendingUp, title: t('howItWorks.step3.title'), description: t('howItWorks.step3.desc') },
  ];

  return (
    <section className="section" style={{ background: '#0A0A0B' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            {t('howItWorks.title')}
          </h2>
          <p className="section-subtitle">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps - responsive grid */}
        <div className="grid-3">
          {steps.map((step) => (
            <div key={step.number} className="card" style={{ textAlign: 'center' }}>
              {/* Number badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#6366F1',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginBottom: '24px'
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <step.icon style={{ width: '56px', height: '56px', color: '#22D3EE' }} />
              </div>

              {/* Title */}
              <h3 style={{ fontSize: 'var(--section-subtitle)', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{ color: '#D4D4D8', fontSize: 'var(--body-text)' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
