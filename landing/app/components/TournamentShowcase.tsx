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
    <section className="section" style={{ background: '#0A0A0B' }}>
      <div className="container">
        {/* 2 column grid - responsive, reversed on desktop */}
        <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
          {/* Left - Tournament cards (2x2 grid) */}
          <div className="grid-2" style={{ gap: '16px', order: 2 }}>
            {tournaments.map((tournament, index) => {
              const badge = getRankBadge(tournament.rank);
              const profit = tournament.prize - tournament.buyIn;
              const IconComponent = badge.icon;

              return (
                <div key={index} className="card" style={{ padding: '20px' }}>
                  {/* Tournament name */}
                  <p style={{ color: 'white', fontWeight: 500, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tournament.name}
                  </p>

                  {/* Rank badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    {IconComponent && <IconComponent style={{ width: '18px', height: '18px', color: badge.color }} />}
                    <span style={{ fontWeight: 500, color: badge.color }}>
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '13px', color: '#71717A' }}>{tournament.date}</span>
                  </div>

                  {/* Buy-in */}
                  <div style={{ color: '#71717A', marginBottom: '4px' }}>
                    바이인: {tournament.buyIn.toLocaleString()}원
                  </div>

                  {/* Prize */}
                  <div style={{ color: '#71717A', marginBottom: '8px' }}>
                    상금: {tournament.prize.toLocaleString()}원
                  </div>

                  {/* Profit */}
                  <p
                    style={{
                      fontSize: 'var(--section-subtitle)',
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
          <div style={{ order: 1 }}>
            {/* Badge */}
            <span
              style={{
                display: 'inline-block',
                padding: '8px 18px',
                borderRadius: '9999px',
                background: 'rgba(34, 211, 238, 0.2)',
                color: '#22D3EE',
                fontWeight: 500,
                marginBottom: '24px'
              }}
            >
              토너먼트
            </span>

            <h2 className="section-title" style={{ marginBottom: '16px' }}>
              대회 성적도 완벽하게 추적
            </h2>

            <p className="section-subtitle" style={{ marginBottom: '32px' }}>
              참가비, 상금, 순위까지 한번에 기록하고 ROI를 계산하세요
            </p>

            {/* Feature list */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {features.map((feature) => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
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
