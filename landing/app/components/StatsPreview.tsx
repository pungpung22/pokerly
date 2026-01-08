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
    <section className="section" style={{ background: 'rgba(20, 20, 22, 0.5)' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            당신의 포커 실력을 숫자로 확인하세요
          </h2>
          <p className="section-subtitle">
            다양한 통계와 차트로 강점과 약점을 분석
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
              <p style={{ color: '#71717A', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: 'var(--section-subtitle)', fontWeight: 'bold', color: stat.positive ? '#10B981' : 'white', marginBottom: '4px' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '13px', color: '#71717A' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart preview */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <TrendingUp style={{ width: '24px', height: '24px', color: '#6366F1' }} />
            <span style={{ color: 'white', fontWeight: 500, fontSize: 'var(--section-subtitle)' }}>수익 추이</span>
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
                <span style={{ fontSize: '13px', color: '#71717A' }}>{i + 1}월</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
