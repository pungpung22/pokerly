'use client';

import { ArrowRight, Play, Lock, Zap, CreditCard } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.1), transparent, transparent)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: '#141416',
            border: '1px solid #27272A',
            color: '#71717A',
            marginBottom: '32px'
          }}
        >
          <span style={{ color: '#FBBF24' }}>✨</span>
          <span>200명 이상의 플레이어가 사용 중</span>
        </div>

        {/* Main title */}
        <h1 className="hero-title">
          스크린샷 한 장으로
          <br />
          <span className="gradient-text">포커 실력을 분석하세요</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
          게임 화면만 찍으면 AI가 자동으로 데이터를 추출합니다.
          <br />
          복잡한 입력 없이 당신의 수익률을 한눈에 확인하세요.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
          <a href="/login" className="btn-primary">
            무료로 시작하기
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </a>
          <button className="btn-secondary">
            <Play style={{ width: '20px', height: '20px' }} />
            데모 보기
          </button>
        </div>

        {/* Trust indicators */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px', color: '#71717A' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock style={{ width: '18px', height: '18px' }} />
            개인정보 보호
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap style={{ width: '18px', height: '18px' }} />
            3초만에 분석
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard style={{ width: '18px', height: '18px' }} />
            신용카드 불필요
          </span>
        </div>

        {/* Hero image placeholder */}
        <div style={{ marginTop: '64px', position: 'relative' }}>
          <div className="card" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ background: '#0A0A0B', borderRadius: '12px', padding: '48px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <BarChart3Icon style={{ width: '80px', height: '80px', color: '#6366F1', margin: '0 auto 16px' }} />
                <p style={{ color: '#71717A', fontSize: 'var(--body-text)' }}>대시보드 미리보기</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
