'use client';

import { Check, Trophy, Medal, Award, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TournamentShowcase() {
  const t = useTranslations('Landing');

  const features = [
    t('tournament.features.1'),
    t('tournament.features.2'),
    t('tournament.features.3'),
    t('tournament.features.4'),
  ];

  const tournaments = [
    { name: 'Sunday Million', rank: 2, buyIn: 500000, prize: 8500000, date: t('tournament.tournaments.1.date') },
    { name: 'Daily 100K GTD', rank: 5, buyIn: 50000, prize: 320000, date: t('tournament.tournaments.2.date') },
    { name: 'Bounty Hunter', rank: 12, buyIn: 100000, prize: 180000, date: t('tournament.tournaments.3.date') },
    { name: 'Turbo 50K', rank: null, buyIn: 30000, prize: 0, date: t('tournament.tournaments.4.date') },
  ];

  function getRankBadge(rank: number | null) {
    if (rank === 1) return { icon: Trophy, color: '#FFD700', label: '1st' };
    if (rank === 2) return { icon: Medal, color: '#C0C0C0', label: '2nd' };
    if (rank === 3) return { icon: Award, color: '#CD7F32', label: '3rd' };
    if (rank && rank <= 10) return { icon: Star, color: '#6366F1', label: `${rank}th` };
    if (rank) return { icon: null, color: '#D4D4D8', label: `${rank}th` };
    return { icon: null, color: '#EF4444', label: t('tournament.eliminated') };
  }

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
                    <span style={{ fontSize: '13px', color: '#D4D4D8' }}>{tournament.date}</span>
                  </div>

                  {/* Buy-in */}
                  <div style={{ color: '#D4D4D8', marginBottom: '4px' }}>
                    {t('tournament.buyIn')}: {tournament.buyIn.toLocaleString()}{t('tournament.currency')}
                  </div>

                  {/* Prize */}
                  <div style={{ color: '#D4D4D8', marginBottom: '8px' }}>
                    {t('tournament.prize')}: {tournament.prize.toLocaleString()}{t('tournament.currency')}
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
                    {profit.toLocaleString()}{t('tournament.currency')}
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
              {t('tournament.badge')}
            </span>

            <h2 className="section-title" style={{ marginBottom: '16px' }}>
              {t('tournament.title')}
            </h2>

            <p className="section-subtitle" style={{ marginBottom: '32px' }}>
              {t('tournament.subtitle')}
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
