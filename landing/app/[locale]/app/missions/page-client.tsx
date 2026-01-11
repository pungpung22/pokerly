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
  Crown,
  Medal,
  Users,
  Settings,
} from 'lucide-react';
import { sessionsApi, userApi } from '@/lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { DashboardStats, RankingCategory, RankingEntry, MyRankingResponse } from '@/lib/types';

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
  const tSettings = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();

  // Main tab state (missions vs ranking)
  const [mainTab, setMainTab] = useState<'missions' | 'ranking'>('missions');

  // Missions state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'inProgress' | 'completed'>('available');
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | 'all'>('all');

  // Ranking state
  const [rankingCategory, setRankingCategory] = useState<RankingCategory>('profit');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [myRanking, setMyRanking] = useState<MyRankingResponse | null>(null);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [totalParticipants, setTotalParticipants] = useState(0);

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

  // Fetch ranking data
  useEffect(() => {
    async function fetchRankings() {
      if (!user || mainTab !== 'ranking') return;
      setRankingLoading(true);
      try {
        const [rankingsData, myRankingData] = await Promise.all([
          userApi.getRankings(rankingCategory),
          userApi.getMyRanking(),
        ]);
        setRankings(rankingsData.rankings);
        setTotalParticipants(rankingsData.totalParticipants);
        setMyRanking(myRankingData);
      } catch (err) {
        console.error('Failed to fetch rankings:', err);
      } finally {
        setRankingLoading(false);
      }
    }
    fetchRankings();
  }, [user, mainTab, rankingCategory]);

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

  // Format ranking value based on category
  const formatRankingValue = (value: number, category: RankingCategory): string => {
    if (category === 'winRate') {
      return `${value.toFixed(1)}%`;
    }
    if (category === 'profit') {
      if (locale === 'ko') {
        if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
        if (value >= 10000) return `${Math.floor(value / 10000)}만`;
        return value.toLocaleString() + '원';
      }
      return value.toLocaleString();
    }
    if (category === 'level') {
      return `Lv.${value}`;
    }
    if (category === 'missions') {
      return locale === 'ko' ? `${value}개` : locale === 'ja' ? `${value}個` : `${value}`;
    }
    return value.toString();
  };

  // Get ranking category label
  const getRankingCategoryLabel = (cat: RankingCategory): string => {
    const labels: Record<RankingCategory, Record<string, string>> = {
      winRate: { ko: '승률', en: 'Win Rate', ja: '勝率' },
      profit: { ko: '수익', en: 'Profit', ja: '収益' },
      sessions: { ko: '세션 수', en: 'Sessions', ja: 'セッション' },
      level: { ko: '레벨', en: 'Level', ja: 'レベル' },
      missions: { ko: '달성 미션', en: 'Missions', ja: '達成ミッション' },
    };
    return labels[cat][locale] || labels[cat].en;
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

      {/* Main Tab Switcher (Missions / Ranking) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        background: '#0A0A0B',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid #27272A',
      }}>
        <button
          onClick={() => setMainTab('missions')}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '12px',
            border: 'none',
            background: mainTab === 'missions'
              ? 'linear-gradient(135deg, #F72585 0%, #D91C6B 100%)'
              : 'transparent',
            color: mainTab === 'missions' ? 'white' : '#A1A1AA',
            fontSize: '15px',
            fontWeight: mainTab === 'missions' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: mainTab === 'missions' ? '0 4px 16px rgba(247, 37, 133, 0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Target style={{ width: '18px', height: '18px' }} />
          {locale === 'ko' ? '미션' : locale === 'ja' ? 'ミッション' : 'Missions'}
        </button>
        <button
          onClick={() => setMainTab('ranking')}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '12px',
            border: 'none',
            background: mainTab === 'ranking'
              ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
              : 'transparent',
            color: mainTab === 'ranking' ? '#000' : '#A1A1AA',
            fontSize: '15px',
            fontWeight: mainTab === 'ranking' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: mainTab === 'ranking' ? '0 4px 16px rgba(255, 215, 0, 0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Crown style={{ width: '18px', height: '18px' }} />
          {locale === 'ko' ? '랭킹' : locale === 'ja' ? 'ランキング' : 'Ranking'}
        </button>
      </div>

      {/* Missions Tab Content */}
      {mainTab === 'missions' && (<>
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
      </>)}

      {/* Ranking Tab Content */}
      {mainTab === 'ranking' && (
        <>
          {/* My Ranking Banner */}
          {myRanking?.optedIn ? (
            <div className="card" style={{
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))',
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Crown style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#FFD700', fontSize: '13px', marginBottom: '4px' }}>
                    {locale === 'ko' ? '내 닉네임' : locale === 'ja' ? 'マイニックネーム' : 'My Nickname'}
                  </p>
                  <p style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                    {myRanking.nickname}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {myRanking.rankings?.profit && (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#A1A1AA', fontSize: '12px' }}>{getRankingCategoryLabel('profit')}</p>
                      <p style={{ color: '#FFD700', fontWeight: 'bold' }}>#{myRanking.rankings.profit.rank}</p>
                    </div>
                  )}
                  {myRanking.rankings?.winRate && (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#A1A1AA', fontSize: '12px' }}>{getRankingCategoryLabel('winRate')}</p>
                      <p style={{ color: '#FFD700', fontWeight: 'bold' }}>#{myRanking.rankings.winRate.rank}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{
              marginBottom: '24px',
              textAlign: 'center',
              padding: '32px 24px',
            }}>
              <Users style={{ width: '48px', height: '48px', color: '#52525B', margin: '0 auto 16px' }} />
              <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>
                {locale === 'ko' ? '랭킹에 참여하세요!' : locale === 'ja' ? 'ランキングに参加しましょう！' : 'Join the Ranking!'}
              </h3>
              <p style={{ color: '#A1A1AA', fontSize: '14px', marginBottom: '20px' }}>
                {locale === 'ko' ? '설정에서 랭킹 참여를 활성화하면 다른 플레이어들과 순위를 겨룰 수 있습니다.' : locale === 'ja' ? '設定でランキング参加を有効にすると、他のプレイヤーと競えます。' : 'Enable ranking participation in settings to compete with other players.'}
              </p>
              <button
                onClick={() => router.push(`/${locale}/app/settings`)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'black',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Settings style={{ width: '16px', height: '16px' }} />
                {locale === 'ko' ? '설정으로 이동' : locale === 'ja' ? '設定へ移動' : 'Go to Settings'}
              </button>
            </div>
          )}

          {/* Ranking Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}>
            {(['profit', 'winRate', 'sessions', 'level', 'missions'] as RankingCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setRankingCategory(cat)}
                style={{
                  padding: '10px 20px',
                  background: rankingCategory === cat ? 'rgba(255, 215, 0, 0.2)' : '#18181B',
                  border: `1px solid ${rankingCategory === cat ? '#FFD700' : '#27272A'}`,
                  borderRadius: '20px',
                  color: rankingCategory === cat ? '#FFD700' : '#D4D4D8',
                  fontSize: '14px',
                  fontWeight: rankingCategory === cat ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {getRankingCategoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Participants Count */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users style={{ width: '16px', height: '16px', color: '#A1A1AA' }} />
            <span style={{ color: '#A1A1AA', fontSize: '14px' }}>
              {locale === 'ko' ? `총 ${totalParticipants}명 참여중` : locale === 'ja' ? `${totalParticipants}人参加中` : `${totalParticipants} participants`}
            </span>
          </div>

          {/* Ranking List */}
          {rankingLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <Loader2 style={{ width: '32px', height: '32px', color: '#FFD700', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : rankings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Trophy style={{ width: '48px', height: '48px', color: '#27272A', margin: '0 auto 16px' }} />
              <p style={{ color: '#D4D4D8' }}>
                {locale === 'ko' ? '아직 참여자가 없습니다' : locale === 'ja' ? 'まだ参加者がいません' : 'No participants yet'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rankings.map((entry, index) => {
                const isTop3 = entry.rank <= 3;
                const isMe = myRanking?.optedIn && myRanking?.nickname === entry.nickname;
                const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

                return (
                  <div
                    key={entry.userId}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      background: isMe ? 'rgba(247, 37, 133, 0.1)' : isTop3 ? 'rgba(255, 215, 0, 0.05)' : '#141416',
                      border: isMe ? '1px solid #F72585' : isTop3 ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid #27272A',
                    }}
                  >
                    {/* Rank */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isTop3 ? medalColors[entry.rank - 1] : '#27272A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isTop3 ? (
                        <Medal style={{ width: '20px', height: '20px', color: entry.rank === 1 ? '#000' : '#fff' }} />
                      ) : (
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                          {entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Nickname & Level */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: isMe ? '#F72585' : 'white',
                        fontWeight: isMe ? 600 : 500,
                        fontSize: '15px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {entry.nickname} {isMe && <span style={{ fontSize: '12px' }}>(나)</span>}
                      </p>
                      <p style={{ color: '#A1A1AA', fontSize: '12px' }}>
                        Lv.{entry.level}
                      </p>
                    </div>

                    {/* Value */}
                    <div style={{
                      textAlign: 'right',
                      color: isTop3 ? '#FFD700' : isMe ? '#F72585' : '#D4D4D8',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}>
                      {formatRankingValue(entry.value, rankingCategory)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
