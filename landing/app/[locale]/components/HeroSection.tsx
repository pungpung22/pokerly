'use client';

import { ArrowRight, Play, Lock, Zap, CreditCard, Camera, Trophy, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import { trackStartFreeTrial } from '@/lib/analytics';

export default function HeroSection() {
  const t = useTranslations('Landing');

  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(20, 184, 166, 0.15), transparent 50%, transparent)',
          pointerEvents: 'none'
        }}
      />

      {/* Floating glow effect */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(20, 184, 166, 0.15)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          borderRadius: '24px',
          marginBottom: '24px'
        }}>
          <Camera style={{ width: '16px', height: '16px', color: '#14B8A6' }} />
          <span style={{ color: '#14B8A6', fontSize: '14px', fontWeight: 500 }}>{t('hero.badge')}</span>
        </div>

        {/* Main title */}
        <h1 className="hero-title" style={{ marginBottom: '16px' }}>
          {t('hero.title.line1')}
          <br />
          <span className="gradient-text">{t('hero.title.line2')}</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto 32px' }}>
          {t('hero.subtitle.line1')}
          <br />
          {t('hero.subtitle.line2')}
        </p>

        {/* Feature highlights */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'rgba(139, 92, 246, 0.15)',
            borderRadius: '16px',
            fontSize: '13px',
            color: '#A78BFA'
          }}>
            <Trophy style={{ width: '14px', height: '14px' }} />
            8-Tier Level System
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'rgba(34, 197, 94, 0.15)',
            borderRadius: '16px',
            fontSize: '13px',
            color: '#4ADE80'
          }}>
            <Target style={{ width: '14px', height: '14px' }} />
            Mission Rewards
          </span>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
          <Link
            href="/login"
            className="btn-primary"
            onClick={() => trackStartFreeTrial('hero')}
          >
            {t('hero.cta')}
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </Link>
          <button className="btn-secondary">
            <Play style={{ width: '20px', height: '20px' }} />
            {t('hero.demo')}
          </button>
        </div>

        {/* Trust indicators */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px', color: '#D4D4D8' }}>
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
                <BarChart3Icon style={{ width: '80px', height: '80px', color: '#14B8A6', margin: '0 auto 16px' }} />
                <p style={{ color: '#D4D4D8', fontSize: 'var(--body-text)' }}>{t('hero.preview')}</p>
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
