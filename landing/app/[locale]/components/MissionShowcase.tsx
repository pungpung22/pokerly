'use client';

import { Target, Flame, Trophy, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function MissionShowcase() {
  const t = useTranslations('Landing');

  const missions = [
    {
      icon: Target,
      title: t('missions.items.1.title'),
      desc: t('missions.items.1.desc'),
      reward: '+100 XP',
      progress: 75,
      color: '#22C55E'
    },
    {
      icon: TrendingUp,
      title: t('missions.items.2.title'),
      desc: t('missions.items.2.desc'),
      reward: '+150 XP',
      progress: 45,
      color: '#3B82F6'
    },
    {
      icon: Flame,
      title: t('missions.items.3.title'),
      desc: t('missions.items.3.desc'),
      reward: '+200 XP',
      progress: 60,
      color: '#F59E0B'
    },
    {
      icon: Trophy,
      title: t('missions.items.4.title'),
      desc: t('missions.items.4.desc'),
      reward: '+300 XP',
      progress: 20,
      color: '#EC4899'
    },
  ];

  const categories = [
    { icon: Target, label: t('missions.categories.winRate'), color: '#22C55E' },
    { icon: TrendingUp, label: t('missions.categories.profit'), color: '#3B82F6' },
    { icon: Flame, label: t('missions.categories.streak'), color: '#F59E0B' },
    { icon: Trophy, label: t('missions.categories.sessions'), color: '#EC4899' },
  ];

  return (
    <section id="mission-system" className="section" style={{ background: 'rgba(20, 20, 22, 0.5)' }}>
      <div className="container">
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '20px', marginBottom: '20px' }}>
            <Zap style={{ width: '16px', height: '16px', color: '#22C55E' }} />
            <span style={{ color: '#22C55E', fontSize: '14px', fontWeight: 500 }}>{t('missions.badge')}</span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            {t('missions.title')}
          </h2>
          <p className="section-subtitle">
            {t('missions.subtitle')}
          </p>
        </div>

        {/* Mission Categories */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '48px' }}>
          {categories.map((cat) => (
            <div key={cat.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: `${cat.color}15`,
              border: `1px solid ${cat.color}40`,
              borderRadius: '24px'
            }}>
              <cat.icon style={{ width: '18px', height: '18px', color: cat.color }} />
              <span style={{ color: cat.color, fontWeight: 500 }}>{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Missions Grid */}
        <div className="grid-2" style={{ gap: '24px' }}>
          {missions.map((mission, index) => (
            <div key={index} className="card" style={{
              padding: '28px',
              background: 'linear-gradient(135deg, rgba(28, 28, 30, 0.9) 0%, rgba(28, 28, 30, 0.6) 100%)',
              border: '1px solid #27272A',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Glow effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle, ${mission.color}15 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: `${mission.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <mission.icon style={{ width: '26px', height: '26px', color: mission.color }} />
                    </div>
                    <div>
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '17px', marginBottom: '4px' }}>{mission.title}</h3>
                      <p style={{ color: '#A1A1AA', fontSize: '14px' }}>{mission.desc}</p>
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    background: `${mission.color}20`,
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: mission.color, fontWeight: 700, fontSize: '14px' }}>{mission.reward}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#71717A', fontSize: '13px' }}>{t('missions.progress')}</span>
                    <span style={{ color: mission.color, fontWeight: 600, fontSize: '13px' }}>{mission.progress}%</span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#27272A',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${mission.progress}%`,
                      background: `linear-gradient(90deg, ${mission.color} 0%, ${mission.color}88 100%)`,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: '#A1A1AA', marginBottom: '8px' }}>{t('missions.cta')}</p>
          <p style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>
            <span style={{ color: '#22C55E' }}>12</span> {t('missions.templates')}
          </p>
        </div>
      </div>
    </section>
  );
}
