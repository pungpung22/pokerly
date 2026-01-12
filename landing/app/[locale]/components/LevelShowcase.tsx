'use client';

import { Crown, Zap, Trophy, Star, Target, Award, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LevelShowcase() {
  const t = useTranslations('Landing');

  const levels = [
    { level: 1, name: t('level.roadmap.1'), icon: '👁️', color: '#71717A', xp: '0' },
    { level: 2, name: t('level.roadmap.2'), icon: '🌱', color: '#22C55E', xp: '100' },
    { level: 3, name: t('level.roadmap.3'), icon: '🎮', color: '#3B82F6', xp: '300' },
    { level: 4, name: t('level.roadmap.4'), icon: '♠️', color: '#8B5CF6', xp: '600' },
    { level: 5, name: t('level.roadmap.5'), icon: '🦈', color: '#EC4899', xp: '1000' },
    { level: 6, name: t('level.roadmap.6'), icon: '👑', color: '#F59E0B', xp: '1500' },
    { level: 7, name: t('level.roadmap.7'), icon: '💎', color: '#06B6D4', xp: '2100' },
    { level: 8, name: t('level.roadmap.8'), icon: '🏆', color: '#EF4444', xp: '2800' },
  ];

  const xpSources = [
    { icon: Zap, label: t('level.xpSources.screenshot'), xp: '+100 XP' },
    { icon: Target, label: t('level.xpSources.manual'), xp: '+10 XP' },
    { icon: Star, label: t('level.xpSources.daily'), xp: '+50 XP' },
    { icon: Trophy, label: t('level.xpSources.mission'), xp: '+50~200 XP' },
  ];

  return (
    <section id="level-system" className="section" style={{ background: '#0A0A0B' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '20px', marginBottom: '20px' }}>
            <Crown style={{ width: '16px', height: '16px', color: '#8B5CF6' }} />
            <span style={{ color: '#8B5CF6', fontSize: '14px', fontWeight: 500 }}>{t('level.badge')}</span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            {t('level.title')}
          </h2>
          <p className="section-subtitle">
            {t('level.subtitle')}
          </p>
        </div>

        {/* Level Roadmap */}
        <div className="card" style={{ marginBottom: '48px', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Award style={{ width: '24px', height: '24px', color: '#8B5CF6' }} />
            <span style={{ color: 'white', fontWeight: 600, fontSize: '18px' }}>{t('level.roadmapTitle')}</span>
          </div>

          {/* Level Progress Bar */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            {/* Background line */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              right: '24px',
              height: '4px',
              background: '#27272A',
              borderRadius: '2px'
            }} />

            {/* Progress line (gradient) */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              width: '40%',
              height: '4px',
              background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
              borderRadius: '2px'
            }} />

            {/* Level dots */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {levels.map((level, index) => (
                <div key={level.level} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: index < 4 ? `linear-gradient(135deg, ${level.color} 0%, ${level.color}88 100%)` : '#1C1C1E',
                    border: index < 4 ? 'none' : `2px solid ${level.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: index < 4 ? `0 0 20px ${level.color}44` : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {level.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: index < 4 ? 'white' : '#71717A', fontSize: '13px', fontWeight: 600 }}>Lv.{level.level}</p>
                    <p style={{ color: index < 4 ? '#D4D4D8' : '#52525B', fontSize: '12px' }}>{level.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* XP Sources Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {xpSources.map((source) => (
            <div key={source.label} className="card" style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <source.icon style={{ width: '24px', height: '24px', color: '#8B5CF6' }} />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 500, marginBottom: '4px' }}>{source.label}</p>
                <p style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '18px' }}>{source.xp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Box */}
        <div style={{
          marginTop: '48px',
          padding: '24px 32px',
          background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <Sparkles style={{ width: '24px', height: '24px', color: '#EC4899' }} />
          <p style={{ color: 'white', fontSize: '16px' }}>
            {t('level.highlight')}
          </p>
        </div>
      </div>
    </section>
  );
}
