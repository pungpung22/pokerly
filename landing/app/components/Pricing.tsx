'use client';

import { Check } from 'lucide-react';

const plans = [
  { name: '무료', price: '₩0', period: '', features: ['월 10회 업로드', '기본 통계', '최근 30일 기록'], cta: '무료로 시작', popular: false },
  { name: '프로', price: '₩9,900', period: '/월', features: ['무제한 업로드', '고급 통계 & 차트', '전체 기록 보관', '우선 지원'], cta: '프로 시작하기', popular: true },
];

export default function Pricing() {
  return (
    <section className="section" style={{ background: 'rgba(20, 20, 22, 0.5)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            심플한 요금제
          </h2>
          <p className="section-subtitle">필요한 만큼만 사용하세요</p>
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
                  인기
                </span>
              )}

              {/* Plan name */}
              <h3 style={{ fontSize: 'var(--section-subtitle)', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{plan.name}</h3>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: 'var(--section-title)', fontWeight: 'bold', color: 'white' }}>{plan.price}</span>
                <span style={{ color: '#71717A', fontSize: 'var(--body-text)' }}>{plan.period}</span>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Check style={{ width: '22px', height: '22px', color: '#10B981', flexShrink: 0 }} />
                    <span style={{ color: '#FAFAFA', fontSize: 'var(--body-text)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <a
                href="/login"
                className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
