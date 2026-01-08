'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section
      id="cta"
      className="section"
      style={{
        background: 'linear-gradient(to bottom right, #6366F1, #4F46E5)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        <div style={{ position: 'absolute', top: '40px', left: '40px', width: '256px', height: '256px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(48px)' }} />
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', width: '384px', height: '384px', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.2)', filter: 'blur(48px)' }} />
      </div>

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Sparkle icon */}
        <Sparkles style={{ width: '56px', height: '56px', color: 'rgba(255, 255, 255, 0.8)', margin: '0 auto 24px' }} />

        {/* Title */}
        <h2 className="section-title" style={{ color: 'white', marginBottom: '24px' }}>
          지금 바로 시작하세요
        </h2>

        {/* Subtitle */}
        <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '700px', margin: '0 auto 40px' }}>
          스크린샷만 찍으면 포커 수익이 자동으로 기록됩니다.
          <br />
          번거로운 수동 기록은 이제 그만!
        </p>

        {/* CTA Button */}
        <a
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 36px',
            background: 'white',
            color: '#6366F1',
            fontWeight: 'bold',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: 'var(--button-text)',
            textDecoration: 'none'
          }}
        >
          무료로 시작하기
          <ArrowRight style={{ width: '22px', height: '22px' }} />
        </a>

        {/* Trust text */}
        <p style={{ marginTop: '24px', color: 'rgba(255, 255, 255, 0.6)' }}>
          신용카드 필요 없음 · 언제든 취소 가능
        </p>
      </div>
    </section>
  );
}
