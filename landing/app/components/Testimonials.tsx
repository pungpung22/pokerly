'use client';

import { Quote, Star } from 'lucide-react';

const testimonials = [
  { stars: 5, content: '엑셀로 기록하던 시절이 있었는데, 이제는 스크린샷만 찍으면 끝이에요. 시간 절약이 엄청납니다.', name: 'Player_K***', info: 'NL200 레귤러' },
  { stars: 5, content: '토너먼트 ROI 계산이 자동으로 되니까 내 실력이 어느 정도인지 객관적으로 알 수 있어요.', name: 'MTT_Pro***', info: '토너먼트 그라인더' },
  { stars: 5, content: '통계 보는 재미가 있어요. BB/100 그래프 보면서 어디서 리크가 있는지 찾게 됩니다.', name: 'Shark_J***', info: 'NL500 플레이어' },
];

export default function Testimonials() {
  return (
    <section className="section" style={{ background: '#0A0A0B' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="section-title">
            플레이어들의 후기
          </h2>
        </div>

        {/* Testimonials grid - responsive 3 columns */}
        <div className="grid-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card" style={{ position: 'relative' }}>
              {/* Quote decoration */}
              <Quote style={{ position: 'absolute', top: '20px', right: '20px', width: '36px', height: '36px', color: '#27272A' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} style={{ width: '18px', height: '18px', fill: '#FBBF24', color: '#FBBF24' }} />
                ))}
              </div>

              {/* Content */}
              <p style={{ color: '#FAFAFA', marginBottom: '24px', lineHeight: 1.7 }}>
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p style={{ color: 'white', fontWeight: 'bold' }}>{testimonial.name}</p>
                <p style={{ color: '#71717A' }}>{testimonial.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
