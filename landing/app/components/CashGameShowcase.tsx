'use client';

import { Check } from 'lucide-react';

const features = [
  '블라인드 레벨 자동 인식',
  '핸드 수 자동 계산',
  '수익/손실 자동 분류',
  '날짜/시간 자동 추출',
];

const sessions = [
  { level: 'NL200', table: 'Table #14', hands: 47, profit: 892000, date: '오늘 19:37' },
  { level: 'NL200', table: 'Table #28', hands: 125, profit: -340000, date: '오늘 18:20' },
  { level: 'NL500', table: 'Table #7', hands: 89, profit: 2150000, date: '어제 22:15' },
  { level: 'NL100', table: 'Table #33', hands: 201, profit: 156000, date: '어제 20:00' },
];

export default function CashGameShowcase() {
  return (
    <section style={{ padding: '96px 24px', background: 'rgba(20, 20, 22, 0.5)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 2 column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          {/* Left - Features */}
          <div>
            {/* Badge */}
            <span
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#6366F1',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '24px'
              }}
            >
              캐시게임
            </span>

            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              세션별 수익을 자동으로 기록
            </h2>

            <p style={{ fontSize: '18px', color: '#71717A', marginBottom: '32px' }}>
              테이블 정보, 핸드 수, 수익금까지 스크린샷에서 자동 인식
            </p>

            {/* Feature list */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {features.map((feature) => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Check style={{ width: '16px', height: '16px', color: '#10B981' }} />
                  </div>
                  <span style={{ color: 'white' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Session cards (2x2 grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {sessions.map((session, index) => (
              <div
                key={index}
                style={{
                  background: '#141416',
                  border: '1px solid #27272A',
                  borderRadius: '12px',
                  padding: '16px'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#6366F1',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {session.level}
                  </span>
                  <span style={{ fontSize: '12px', color: '#71717A' }}>{session.date}</span>
                </div>

                {/* Info */}
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: 'white', fontWeight: 500 }}>{session.table}</p>
                  <p style={{ fontSize: '14px', color: '#71717A' }}>{session.hands} hands</p>
                </div>

                {/* Profit */}
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: session.profit >= 0 ? '#10B981' : '#EF4444'
                  }}
                >
                  {session.profit >= 0 ? '+' : ''}
                  {session.profit.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
