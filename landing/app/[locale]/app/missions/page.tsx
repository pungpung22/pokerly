'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Target,
  TrendingUp,
  Flame,
  Trophy,
  Loader2,
  Check,
  Award,
  Percent,
  Calendar,
  Zap,
  Lock,
} from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import type { DashboardStats } from '@/lib/types';

// Mission template type
type MissionCategory = 'winRate' | 'profit' | 'sessions' | 'streak';
type MissionDifficulty = 'easy' | 'medium' | 'hard';
type MissionStatus = 'available' | 'inProgress' | 'completed';

interface MissionTemplate {
  id: string;
  templateKey: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  targetValue: number;
  rewardXP: number;
  icon: typeof Target;
}

// Predefined mission templates
const missionTemplates: MissionTemplate[] = [
  // Win Rate missions
  { id: 'winRate10', templateKey: 'winRate10', category: 'winRate', difficulty: 'easy', targetValue: 10, rewardXP: 50, icon: Percent },
  { id: 'winRate30', templateKey: 'winRate30', category: 'winRate', difficulty: 'medium', targetValue: 30, rewardXP: 100, icon: Percent },
  { id: 'winRate50', templateKey: 'winRate50', category: 'winRate', difficulty: 'hard', targetValue: 50, rewardXP: 200, icon: Percent },
  // Profit missions
  { id: 'profit1m', templateKey: 'profit1m', category: 'profit', difficulty: 'easy', targetValue: 1000000, rewardXP: 100, icon: TrendingUp },
  { id: 'profit5m', templateKey: 'profit5m', category: 'profit', difficulty: 'medium', targetValue: 5000000, rewardXP: 200, icon: TrendingUp },
  { id: 'profit10m', templateKey: 'profit10m', category: 'profit', difficulty: 'hard', targetValue: 10000000, rewardXP: 500, icon: TrendingUp },
  // Sessions missions
  { id: 'sessions10', templateKey: 'sessions10', category: 'sessions', difficulty: 'easy', targetValue: 10, rewardXP: 50, icon: Calendar },
  { id: 'sessions50', templateKey: 'sessions50', category: 'sessions', difficulty: 'medium', targetValue: 50, rewardXP: 150, icon: Calendar },
  { id: 'sessions100', templateKey: 'sessions100', category: 'sessions', difficulty: 'hard', targetValue: 100, rewardXP: 300, icon: Calendar },
  // Streak missions
  { id: 'streak3', templateKey: 'streak3', category: 'streak', difficulty: 'easy', targetValue: 3, rewardXP: 75, icon: Flame },
  { id: 'streak5', templateKey: 'streak5', category: 'streak', difficulty: 'medium', targetValue: 5, rewardXP: 150, icon: Flame },
  { id: 'streak7', templateKey: 'streak7', category: 'streak', difficulty: 'hard', targetValue: 7, rewardXP: 300, icon: Flame },
];

const categoryIcons: Record<MissionCategory, typeof Target> = {
  winRate: Percent,
  profit: TrendingUp,
  sessions: Calendar,
  streak: Flame,
};

const difficultyColors: Record<MissionDifficulty, { bg: string; text: string; border: string }> = {
  easy: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E', border: '#22C55E' },
  medium: { bg: 'rgba(234, 179, 8, 0.15)', text: '#EAB308', border: '#EAB308' },
  hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: '#EF4444' },
};

export default function MissionsPage() {
  const { user } = useAuth();
  const t = useTranslations('Missions');
  const locale = useLocale();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'inProgress' | 'completed'>('available');
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | 'all'>('all');

  // Fetch user stats to calculate mission progress
  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await sessionsApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError(t('loadError'));
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user, t]);

  // Calculate mission progress and status
  const missionsWithProgress = useMemo(() => {
    if (!stats) return [];

    return missionTemplates.map((mission) => {
      let currentValue = 0;
      let progress = 0;

      switch (mission.category) {
        case 'winRate':
          currentValue = stats.winRate || 0;
          progress = Math.min((currentValue / mission.targetValue) * 100, 100);
          break;
        case 'profit':
          currentValue = Math.max(0, stats.totalProfit || 0);
          progress = Math.min((currentValue / mission.targetValue) * 100, 100);
          break;
        case 'sessions':
          currentValue = stats.totalSessions || 0;
          progress = Math.min((currentValue / mission.targetValue) * 100, 100);
          break;
        case 'streak':
          currentValue = stats.currentStreak || 0;
          progress = Math.min((currentValue / mission.targetValue) * 100, 100);
          break;
      }

      const status: MissionStatus = progress >= 100 ? 'completed' : progress > 0 ? 'inProgress' : 'available';

      return {
        ...mission,
        currentValue,
        progress,
        status,
      };
    });
  }, [stats]);

  // Filter missions by tab and category
  const filteredMissions = useMemo(() => {
    return missionsWithProgress.filter((mission) => {
      const matchesTab = mission.status === activeTab;
      const matchesCategory = selectedCategory === 'all' || mission.category === selectedCategory;
      return matchesTab && matchesCategory;
    });
  }, [missionsWithProgress, activeTab, selectedCategory]);

  // Stats summary
  const missionStats = useMemo(() => {
    const completed = missionsWithProgress.filter((m) => m.status === 'completed').length;
    const inProgress = missionsWithProgress.filter((m) => m.status === 'inProgress').length;
    const totalXP = missionsWithProgress
      .filter((m) => m.status === 'completed')
      .reduce((sum, m) => sum + m.rewardXP, 0);
    return { completed, inProgress, totalXP };
  }, [missionsWithProgress]);

  // Format values based on category
  const formatValue = (value: number, category: MissionCategory): string => {
    if (category === 'winRate') {
      return `${value.toFixed(1)}%`;
    }
    if (category === 'profit') {
      if (locale === 'ko') {
        if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
        if (value >= 10000) return `${Math.floor(value / 10000)}만`;
        return value.toLocaleString() + '원';
      }
      if (locale === 'ja') {
        if (value >= 1000000) return `¥${(value / 1000000).toFixed(1)}M`;
        return `¥${value.toLocaleString()}`;
      }
      return `$${value.toLocaleString()}`;
    }
    return value.toString();
  };

  const formatTarget = (target: number, category: MissionCategory): string => {
    if (category === 'winRate') {
      return `${target}%`;
    }
    if (category === 'profit') {
      if (locale === 'ko') {
        if (target >= 100000000) return `${target / 100000000}억`;
        if (target >= 10000) return `${target / 10000}만원`;
        return target.toLocaleString() + '원';
      }
      if (locale === 'ja') {
        if (target >= 1000000) return `¥${target / 1000000}M`;
        return `¥${target.toLocaleString()}`;
      }
      if (target >= 1000) return `$${target / 1000}K`;
      return `$${target.toLocaleString()}`;
    }
    if (category === 'streak') {
      return locale === 'ko' ? `${target}연승` : locale === 'ja' ? `${target}連勝` : `${target} wins`;
    }
    return locale === 'ko' ? `${target}세션` : locale === 'ja' ? `${target}セッション` : `${target} sessions`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#F72585', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="app-page">
      {/* Header */}
      <div className="challenges-header">
        <div>
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="challenges-stats-banner">
        <div className="challenges-stat-item">
          <div style={{ color: '#F72585', marginBottom: '8px' }}>
            <Zap className="challenges-stat-icon" />
          </div>
          <p className="challenges-stat-value">{missionStats.inProgress}</p>
          <p className="challenges-stat-label">{t('stats.active')}</p>
        </div>
        <div className="challenges-stat-item">
          <div style={{ color: '#00D4AA', marginBottom: '8px' }}>
            <Trophy className="challenges-stat-icon" />
          </div>
          <p className="challenges-stat-value">{missionStats.completed}</p>
          <p className="challenges-stat-label">{t('stats.completed')}</p>
        </div>
        <div className="challenges-stat-item">
          <div style={{ color: '#D91C6B', marginBottom: '8px' }}>
            <Award className="challenges-stat-icon" />
          </div>
          <p className="challenges-stat-value">{missionStats.totalXP.toLocaleString()}</p>
          <p className="challenges-stat-label">{t('stats.earnedPoints')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        background: '#141416',
        padding: '6px',
        borderRadius: '12px',
        border: '1px solid #27272A',
      }}>
        <button
          onClick={() => setActiveTab('available')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'available'
              ? 'linear-gradient(135deg, #F72585 0%, #D91C6B 100%)'
              : 'transparent',
            color: activeTab === 'available' ? 'white' : '#A1A1AA',
            fontSize: '14px',
            fontWeight: activeTab === 'available' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'available' ? '0 4px 12px rgba(247, 37, 133, 0.3)' : 'none',
          }}
        >
          {t('tabs.available')} ({missionsWithProgress.filter((m) => m.status === 'available').length})
        </button>
        <button
          onClick={() => setActiveTab('inProgress')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'inProgress'
              ? 'linear-gradient(135deg, #F72585 0%, #D91C6B 100%)'
              : 'transparent',
            color: activeTab === 'inProgress' ? 'white' : '#A1A1AA',
            fontSize: '14px',
            fontWeight: activeTab === 'inProgress' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'inProgress' ? '0 4px 12px rgba(247, 37, 133, 0.3)' : 'none',
          }}
        >
          {t('tabs.inProgress')} ({missionsWithProgress.filter((m) => m.status === 'inProgress').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'completed'
              ? 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)'
              : 'transparent',
            color: activeTab === 'completed' ? 'white' : '#A1A1AA',
            fontSize: '14px',
            fontWeight: activeTab === 'completed' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'completed' ? '0 4px 12px rgba(0, 212, 170, 0.3)' : 'none',
          }}
        >
          {t('tabs.completed')} ({missionStats.completed})
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '8px 16px',
            background: selectedCategory === 'all' ? 'rgba(247, 37, 133, 0.2)' : '#18181B',
            border: `1px solid ${selectedCategory === 'all' ? '#F72585' : '#27272A'}`,
            borderRadius: '20px',
            color: selectedCategory === 'all' ? '#F72585' : '#D4D4D8',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {locale === 'ko' ? '전체' : locale === 'ja' ? 'すべて' : 'All'}
        </button>
        {(['winRate', 'profit', 'sessions', 'streak'] as MissionCategory[]).map((cat) => {
          const Icon = categoryIcons[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === cat ? 'rgba(247, 37, 133, 0.2)' : '#18181B',
                border: `1px solid ${selectedCategory === cat ? '#F72585' : '#27272A'}`,
                borderRadius: '20px',
                color: selectedCategory === cat ? '#F72585' : '#D4D4D8',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon style={{ width: '14px', height: '14px' }} />
              {t(`categories.${cat}`)}
            </button>
          );
        })}
      </div>

      {/* Mission List */}
      {error ? (
        <div className="card" style={{ textAlign: 'center', color: '#EF4444' }}>
          {error}
        </div>
      ) : filteredMissions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Target style={{ width: '48px', height: '48px', color: '#27272A', margin: '0 auto 16px' }} />
          <p style={{ color: '#D4D4D8' }}>
            {t(`empty.${activeTab}`)}
          </p>
        </div>
      ) : (
        <div className="challenges-grid">
          {filteredMissions.map((mission) => {
            const Icon = mission.icon;
            const diffColor = difficultyColors[mission.difficulty];
            const isCompleted = mission.status === 'completed';
            const isLocked = mission.status === 'available' && mission.progress === 0;

            return (
              <div
                key={mission.id}
                className="card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: isCompleted ? 0.8 : 1,
                }}
              >
                {/* Progress background */}
                {!isCompleted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${mission.progress}%`,
                      background: `linear-gradient(90deg, rgba(247, 37, 133, 0.1), rgba(247, 37, 133, 0.02))`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* Icon */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(247, 37, 133, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? (
                        <Check style={{ width: '24px', height: '24px', color: '#00D4AA' }} />
                      ) : isLocked ? (
                        <Lock style={{ width: '24px', height: '24px', color: '#52525B' }} />
                      ) : (
                        <Icon style={{ width: '24px', height: '24px', color: '#F72585' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
                          {t(`templates.${mission.templateKey}.title`)}
                        </h3>
                        <span
                          style={{
                            padding: '2px 8px',
                            background: diffColor.bg,
                            border: `1px solid ${diffColor.border}`,
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: diffColor.text,
                          }}
                        >
                          {t(`difficulty.${mission.difficulty}`)}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '12px' }}>
                        {t(`templates.${mission.templateKey}.description`)}
                      </p>

                      {/* Progress */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', color: '#D4D4D8' }}>
                            {formatValue(mission.currentValue, mission.category)} / {formatTarget(mission.targetValue, mission.category)}
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              color: isCompleted ? '#00D4AA' : '#F72585',
                              fontWeight: 500,
                            }}
                          >
                            {mission.progress.toFixed(0)}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: '6px',
                            background: '#27272A',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${mission.progress}%`,
                              background: isCompleted
                                ? '#00D4AA'
                                : 'linear-gradient(90deg, #F72585, #D91C6B)',
                              borderRadius: '3px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>

                      {/* Reward */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award style={{ width: '14px', height: '14px', color: isCompleted ? '#00D4AA' : '#D91C6B' }} />
                          <span style={{ fontSize: '13px', color: isCompleted ? '#00D4AA' : '#D91C6B', fontWeight: 500 }}>
                            {t('reward')}: {t('points', { count: mission.rewardXP })}
                          </span>
                        </div>
                        {isCompleted && (
                          <span
                            style={{
                              padding: '4px 12px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              borderRadius: '12px',
                              fontSize: '12px',
                              color: '#00D4AA',
                              fontWeight: 500,
                            }}
                          >
                            {t('completedLabel')}
                          </span>
                        )}
                        {mission.status === 'inProgress' && (
                          <span
                            style={{
                              padding: '4px 12px',
                              background: 'rgba(247, 37, 133, 0.2)',
                              borderRadius: '12px',
                              fontSize: '12px',
                              color: '#F72585',
                              fontWeight: 500,
                            }}
                          >
                            {t('inProgressLabel')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
