'use client';

import { Check } from 'lucide-react';

const plans = [
  { name: '무료', price: '₩0', period: '', features: ['월 10회 업로드', '기본 통계', '최근 30일 기록'], cta: '무료로 시작', popular: false },
  { name: '프로', price: '₩9,900', period: '/월', features: ['무제한 업로드', '고급 통계 & 차트', '전체 기록 보관', '우선 지원'], cta: '프로 시작하기', popular: true },
];

export default function Pricing() {
  return (
    <section style={{ padding: '96px 24px', background: 'rgba(20, 20, 22, 0.5)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            심플한 요금제
          </h2>
          <p style={{ fontSize: '18px', color: '#71717A' }}>필요한 만큼만 사용하세요</p>
        </div>

        {/* Plans grid - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: 'relative',
                background: '#141416',
                border: plan.popular ? '2px solid #6366F1' : '1px solid #27272A',
                borderRadius: '16px',
                padding: '32px',
                transform: plan.popular ? 'scale(1.05)' : 'none'
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
                    padding: '4px 16px',
                    borderRadius: '9999px',
                    background: '#6366F1',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  인기
                </span>
              )}

              {/* Plan name */}
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{plan.name}</h3>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>{plan.price}</span>
                <span style={{ color: '#71717A' }}>{plan.period}</span>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Check style={{ width: '20px', height: '20px', color: '#10B981' }} />
                    <span style={{ color: '#FAFAFA' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <a
                href="/login"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: plan.popular ? 'none' : '1px solid #27272A',
                  background: plan.popular ? '#6366F1' : 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxSizing: 'border-box'
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
