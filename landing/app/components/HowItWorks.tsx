'use client';

import { Camera, Upload, TrendingUp } from 'lucide-react';

const steps = [
  { number: '01', icon: Camera, title: '캡처', description: '게임 결과 화면을 스크린샷으로 찍으세요' },
  { number: '02', icon: Upload, title: '업로드', description: '드래그하거나 Ctrl+V로 붙여넣기' },
  { number: '03', icon: TrendingUp, title: '분석', description: 'AI가 자동으로 데이터를 추출하고 통계 생성' },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '96px 24px', background: '#0A0A0B' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            어떻게 작동하나요?
          </h2>
          <p style={{ fontSize: '18px', color: '#71717A' }}>
            단 3단계로 완벽한 포커 분석
          </p>
        </div>

        {/* Steps - 3 column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center'
              }}
            >
              {/* Number badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#6366F1',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginBottom: '24px'
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <step.icon style={{ width: '48px', height: '48px', color: '#22D3EE' }} />
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{ color: '#71717A', fontSize: '14px' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
