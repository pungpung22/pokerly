'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

export default function FinalCTA() {
  const t = useTranslations('Landing');

  return (
    <section
      id="cta"
      className="section"
      style={{
        background: 'linear-gradient(to bottom right, #6366F1, #4F46E5)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        <div style={{ position: 'absolute', top: '40px', left: '40px', width: '256px', height: '256px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(48px)' }} />
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', width: '384px', height: '384px', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.2)', filter: 'blur(48px)' }} />
      </div>

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Sparkle icon */}
        <Sparkles style={{ width: '56px', height: '56px', color: 'rgba(255, 255, 255, 0.8)', margin: '0 auto 24px' }} />

        {/* Title */}
        <h2 className="section-title" style={{ color: 'white', marginBottom: '24px' }}>
          {t('cta.title')}
        </h2>

        {/* Subtitle */}
        <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '700px', margin: '0 auto 40px' }}>
          {t('cta.subtitle.line1')}
          <br />
          {t('cta.subtitle.line2')}
        </p>

        {/* CTA Button */}
        <Link
          href="/app/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 36px',
            background: 'white',
            color: '#6366F1',
            fontWeight: 'bold',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: 'var(--button-text)',
            textDecoration: 'none'
          }}
        >
          {t('hero.cta')}
          <ArrowRight style={{ width: '22px', height: '22px' }} />
        </Link>

        {/* Trust text */}
        <p style={{ marginTop: '24px', color: 'rgba(255, 255, 255, 0.6)' }}>
          {t('cta.trust')}
        </p>
      </div>
    </section>
  );
}
