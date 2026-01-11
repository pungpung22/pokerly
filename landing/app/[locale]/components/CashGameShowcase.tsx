'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CashGameShowcase() {
  const t = useTranslations('Landing');

  const features = [
    t('cashGame.features.1'),
    t('cashGame.features.2'),
    t('cashGame.features.3'),
    t('cashGame.features.4'),
  ];

  const sessions = [
    { level: 'NL200', table: 'Table #14', hands: 47, profit: 892000, date: t('cashGame.sessions.1.date') },
    { level: 'NL200', table: 'Table #28', hands: 125, profit: -340000, date: t('cashGame.sessions.2.date') },
    { level: 'NL500', table: 'Table #7', hands: 89, profit: 2150000, date: t('cashGame.sessions.3.date') },
    { level: 'NL100', table: 'Table #33', hands: 201, profit: 156000, date: t('cashGame.sessions.4.date') },
  ];

  return (
    <section className="section" style={{ background: 'rgba(20, 20, 22, 0.5)' }}>
      <div className="container">
        {/* 2 column grid - responsive */}
        <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
          {/* Left - Features */}
          <div>
            {/* Badge */}
            <span
              style={{
                display: 'inline-block',
                padding: '8px 18px',
                borderRadius: '9999px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#6366F1',
                fontWeight: 500,
                marginBottom: '24px'
              }}
            >
              {t('cashGame.badge')}
            </span>

            <h2 className="section-title" style={{ marginBottom: '16px' }}>
              {t('cashGame.title')}
            </h2>

            <p className="section-subtitle" style={{ marginBottom: '32px' }}>
              {t('cashGame.subtitle')}
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
                    <Check style={{ width: '16px', height: '16px', color: '#00D4AA' }} />
                  </div>
                  <span style={{ color: 'white' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Session cards (2x2 grid) */}
          <div className="grid-2" style={{ gap: '16px' }}>
            {sessions.map((session, index) => (
              <div key={index} className="card" style={{ padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#6366F1',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    {session.level}
                  </span>
                  <span style={{ fontSize: '13px', color: '#D4D4D8' }}>{session.date}</span>
                </div>

                {/* Info */}
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: 'white', fontWeight: 500 }}>{session.table}</p>
                  <p style={{ color: '#D4D4D8' }}>{session.hands} hands</p>
                </div>

                {/* Profit */}
                <p
                  style={{
                    fontSize: 'var(--section-subtitle)',
                    fontWeight: 'bold',
                    color: session.profit >= 0 ? '#00D4AA' : '#EF4444'
                  }}
                >
                  {session.profit >= 0 ? '+' : ''}
                  {session.profit.toLocaleString()}{t('cashGame.currency')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
