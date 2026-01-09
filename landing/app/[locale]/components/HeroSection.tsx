'use client';

import { ArrowRight, Play, Lock, Zap, CreditCard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

export default function HeroSection() {
  const t = useTranslations('Landing');

  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(247, 37, 133, 0.1), transparent, transparent)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: '#141416',
            border: '1px solid #27272A',
            color: '#A1A1AA',
            marginBottom: '32px'
          }}
        >
          <span style={{ color: '#F72585' }}>✨</span>
          <span>{t('hero.badge')}</span>
        </div>

        {/* Main title */}
        <h1 className="hero-title">
          {t('hero.title.line1')}
          <br />
          <span className="gradient-text">{t('hero.title.line2')}</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
          {t('hero.subtitle.line1')}
          <br />
          {t('hero.subtitle.line2')}
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
          <Link href="/login" className="btn-primary">
            {t('hero.cta')}
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </Link>
          <button className="btn-secondary">
            <Play style={{ width: '20px', height: '20px' }} />
            {t('hero.demo')}
          </button>
        </div>

        {/* Trust indicators */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px', color: '#A1A1AA' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock style={{ width: '18px', height: '18px' }} />
            {t('hero.trust.privacy')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap style={{ width: '18px', height: '18px' }} />
            {t('hero.trust.fast')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard style={{ width: '18px', height: '18px' }} />
            {t('hero.trust.noCard')}
          </span>
        </div>

        {/* Hero image placeholder */}
        <div style={{ marginTop: '64px', position: 'relative' }}>
          <div className="card" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ background: '#0A0A0B', borderRadius: '12px', padding: '48px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <BarChart3Icon style={{ width: '80px', height: '80px', color: '#F72585', margin: '0 auto 16px' }} />
                <p style={{ color: '#A1A1AA', fontSize: 'var(--body-text)' }}>{t('hero.preview')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
