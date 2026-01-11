'use client';

import { Wallet, Target, Zap, Percent, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function StatsPreview() {
  const t = useTranslations('Landing');

  const stats = [
    { icon: Wallet, label: t('stats.items.profit.label'), value: t('stats.items.profit.value'), sub: t('stats.items.profit.sub'), positive: true },
    { icon: Target, label: t('stats.items.winrate.label'), value: t('stats.items.winrate.value'), sub: t('stats.items.winrate.sub'), positive: true },
    { icon: Zap, label: t('stats.items.bb100.label'), value: t('stats.items.bb100.value'), sub: t('stats.items.bb100.sub'), positive: true },
    { icon: Percent, label: t('stats.items.roi.label'), value: t('stats.items.roi.value'), sub: t('stats.items.roi.sub'), positive: true },
  ];

  return (
    <section className="section" style={{ background: 'rgba(20, 20, 22, 0.5)' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            {t('stats.title')}
          </h2>
          <p className="section-subtitle">
            {t('stats.subtitle')}
          </p>
        </div>

        {/* Stats grid - responsive 4 columns */}
        <div className="grid-4" style={{ marginBottom: '48px' }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{
                backdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <stat.icon style={{ width: '36px', height: '36px', color: '#6366F1', margin: '0 auto 16px' }} />
              <p style={{ color: '#D4D4D8', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: 'var(--section-subtitle)', fontWeight: 'bold', color: stat.positive ? '#10B981' : 'white', marginBottom: '4px' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '13px', color: '#D4D4D8' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart preview */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <TrendingUp style={{ width: '24px', height: '24px', color: '#6366F1' }} />
            <span style={{ color: 'white', fontWeight: 500, fontSize: 'var(--section-subtitle)' }}>{t('stats.chart.title')}</span>
          </div>

          {/* Fake chart */}
          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', padding: '0 16px' }}>
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${height}%`,
                    borderRadius: '4px 4px 0 0',
                    background: 'linear-gradient(to top, #6366F1, #22D3EE)'
                  }}
                />
                <span style={{ fontSize: '13px', color: '#D4D4D8' }}>{t(`stats.chart.months.${i + 1}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
