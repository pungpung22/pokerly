'use client';

import { Sparkles, Brain, TrendingUp, Target, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AICoachShowcase() {
  const t = useTranslations('Landing');

  const features = [
    { icon: Brain, titleKey: 'aiCoach.features.analysis.title', descKey: 'aiCoach.features.analysis.desc' },
    { icon: Target, titleKey: 'aiCoach.features.weakness.title', descKey: 'aiCoach.features.weakness.desc' },
    { icon: TrendingUp, titleKey: 'aiCoach.features.improvement.title', descKey: 'aiCoach.features.improvement.desc' },
  ];

  return (
    <section className="section" style={{ background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.05) 0%, rgba(20, 20, 22, 0.5) 100%)' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(20, 184, 166, 0.15)',
            borderRadius: '24px',
            marginBottom: '24px'
          }}>
            <Sparkles style={{ width: '16px', height: '16px', color: '#14B8A6' }} />
            <span style={{ color: '#14B8A6', fontSize: '14px', fontWeight: 500 }}>NEW</span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            {t('aiCoach.title')}
          </h2>
          <p className="section-subtitle">
            {t('aiCoach.subtitle')}
          </p>
        </div>

        {/* Main showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* Left - Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(20, 184, 166, 0.2)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <feature.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '8px', fontSize: '18px' }}>
                    {t(feature.titleKey)}
                  </h3>
                  <p style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: 1.6 }}>
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Preview Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(145deg, #1A1A20 0%, #121216 100%)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              padding: '32px'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles style={{ width: '22px', height: '22px', color: 'white' }} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>{t('aiCoach.preview.title')}</h4>
                <p style={{ color: '#71717A', fontSize: '12px' }}>{t('aiCoach.preview.subtitle')}</p>
              </div>
            </div>

            {/* Sample Report Content */}
            <div style={{
              background: 'rgba(20, 184, 166, 0.08)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MessageSquare style={{ width: '16px', height: '16px', color: '#14B8A6' }} />
                <span style={{ color: '#14B8A6', fontSize: '13px', fontWeight: 500 }}>{t('aiCoach.preview.insight')}</span>
              </div>
              <p style={{ color: '#D4D4D8', fontSize: '14px', lineHeight: 1.7 }}>
                {t('aiCoach.preview.sampleText')}
              </p>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 212, 170, 0.1)', borderRadius: '8px' }}>
                <p style={{ color: '#00D4AA', fontWeight: 700, fontSize: '20px' }}>+15.2%</p>
                <p style={{ color: '#71717A', fontSize: '11px' }}>{t('aiCoach.preview.winRate')}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '8px' }}>
                <p style={{ color: '#14B8A6', fontWeight: 700, fontSize: '20px' }}>+3.2</p>
                <p style={{ color: '#71717A', fontSize: '11px' }}>BB/100</p>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                <p style={{ color: '#6366F1', fontWeight: 700, fontSize: '20px' }}>A+</p>
                <p style={{ color: '#71717A', fontSize: '11px' }}>{t('aiCoach.preview.grade')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
