'use client';

import { Wallet, Target, Zap, Percent, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Wallet, label: '총 수익', value: '+₩12,450,000', sub: '최근 30일', positive: true },
  { icon: Target, label: '승률', value: '62.4%', sub: '156세션 기준', positive: true },
  { icon: Zap, label: 'BB/100', value: '+8.5', sub: '캐시게임', positive: true },
  { icon: Percent, label: 'ROI', value: '+24.3%', sub: '토너먼트', positive: true },
];

export default function StatsPreview() {
  return (
    <section style={{ padding: '96px 24px', background: 'rgba(20, 20, 22, 0.5)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            당신의 포커 실력을 숫자로 확인하세요
          </h2>
          <p style={{ fontSize: '18px', color: '#71717A' }}>
            다양한 통계와 차트로 강점과 약점을 분석
          </p>
        </div>

        {/* Stats grid - 4 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '48px' }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(20, 20, 22, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #27272A',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <stat.icon style={{ width: '32px', height: '32px', color: '#6366F1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: stat.positive ? '#10B981' : 'white', marginBottom: '4px' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '12px', color: '#71717A' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart preview */}
        <div style={{ background: '#141416', border: '1px solid #27272A', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <TrendingUp style={{ width: '20px', height: '20px', color: '#6366F1' }} />
            <span style={{ color: 'white', fontWeight: 500 }}>수익 추이</span>
          </div>

          {/* Fake chart */}
          <div style={{ height: '192px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', padding: '0 16px' }}>
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
                <span style={{ fontSize: '12px', color: '#71717A' }}>{i + 1}월</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
