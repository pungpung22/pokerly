'use client';

import { Check, Trophy, Medal, Award, Star } from 'lucide-react';

const features = [
  '토너먼트명 자동 인식',
  '바이인/리바이 자동 합산',
  '상금 및 순위 추출',
  'ROI 자동 계산',
];

const tournaments = [
  { name: 'Sunday Million', rank: 2, buyIn: 500000, prize: 8500000, date: '일요일' },
  { name: 'Daily 100K GTD', rank: 5, buyIn: 50000, prize: 320000, date: '토요일' },
  { name: 'Bounty Hunter', rank: 12, buyIn: 100000, prize: 180000, date: '금요일' },
  { name: 'Turbo 50K', rank: null, buyIn: 30000, prize: 0, date: '금요일' },
];

function getRankBadge(rank: number | null) {
  if (rank === 1) return { icon: Trophy, color: '#FFD700', label: '1st' };
  if (rank === 2) return { icon: Medal, color: '#C0C0C0', label: '2nd' };
  if (rank === 3) return { icon: Award, color: '#CD7F32', label: '3rd' };
  if (rank && rank <= 10) return { icon: Star, color: '#6366F1', label: `${rank}th` };
  if (rank) return { icon: null, color: '#71717A', label: `${rank}th` };
  return { icon: null, color: '#EF4444', label: '탈락' };
}

export default function TournamentShowcase() {
  return (
    <section style={{ padding: '96px 24px', background: '#0A0A0B' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 2 column grid - reversed order */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          {/* Left - Tournament cards (2x2 grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {tournaments.map((tournament, index) => {
              const badge = getRankBadge(tournament.rank);
              const profit = tournament.prize - tournament.buyIn;
              const IconComponent = badge.icon;

              return (
                <div
                  key={index}
                  style={{
                    background: '#141416',
                    border: '1px solid #27272A',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  {/* Tournament name */}
                  <p style={{ color: 'white', fontWeight: 500, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tournament.name}
                  </p>

                  {/* Rank badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    {IconComponent && <IconComponent style={{ width: '16px', height: '16px', color: badge.color }} />}
                    <span style={{ fontSize: '14px', fontWeight: 500, color: badge.color }}>
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#71717A' }}>{tournament.date}</span>
                  </div>

                  {/* Buy-in */}
                  <div style={{ fontSize: '14px', color: '#71717A', marginBottom: '4px' }}>
                    바이인: {tournament.buyIn.toLocaleString()}원
                  </div>

                  {/* Prize */}
                  <div style={{ fontSize: '14px', color: '#71717A', marginBottom: '8px' }}>
                    상금: {tournament.prize.toLocaleString()}원
                  </div>

                  {/* Profit */}
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: profit >= 0 ? '#10B981' : '#EF4444'
                    }}
                  >
                    {profit >= 0 ? '+' : ''}
                    {profit.toLocaleString()}원
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right - Features */}
          <div>
            {/* Badge */}
            <span
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(34, 211, 238, 0.2)',
                color: '#22D3EE',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '24px'
              }}
            >
              토너먼트
            </span>

            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              대회 성적도 완벽하게 추적
            </h2>

            <p style={{ fontSize: '18px', color: '#71717A', marginBottom: '32px' }}>
              참가비, 상금, 순위까지 한번에 기록하고 ROI를 계산하세요
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
        </div>
      </div>
    </section>
  );
}
