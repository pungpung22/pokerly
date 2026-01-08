'use client';

import { Quote, Star } from 'lucide-react';

const testimonials = [
  { stars: 5, content: '엑셀로 기록하던 시절이 있었는데, 이제는 스크린샷만 찍으면 끝이에요. 시간 절약이 엄청납니다.', name: 'Player_K***', info: 'NL200 레귤러' },
  { stars: 5, content: '토너먼트 ROI 계산이 자동으로 되니까 내 실력이 어느 정도인지 객관적으로 알 수 있어요.', name: 'MTT_Pro***', info: '토너먼트 그라인더' },
  { stars: 5, content: '통계 보는 재미가 있어요. BB/100 그래프 보면서 어디서 리크가 있는지 찾게 됩니다.', name: 'Shark_J***', info: 'NL500 플레이어' },
];

export default function Testimonials() {
  return (
    <section style={{ padding: '96px 24px', background: '#0A0A0B' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>
            플레이어들의 후기
          </h2>
        </div>

        {/* Testimonials grid - 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                padding: '24px'
              }}
            >
              {/* Quote decoration */}
              <Quote style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', color: '#27272A' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} style={{ width: '16px', height: '16px', fill: '#FBBF24', color: '#FBBF24' }} />
                ))}
              </div>

              {/* Content */}
              <p style={{ color: '#FAFAFA', marginBottom: '24px', lineHeight: 1.6 }}>
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p style={{ color: 'white', fontWeight: 'bold' }}>{testimonial.name}</p>
                <p style={{ fontSize: '14px', color: '#71717A' }}>{testimonial.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
