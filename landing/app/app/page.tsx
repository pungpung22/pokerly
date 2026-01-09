'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  ArrowUpRight,
  Plus,
  History,
  Loader2,
  X,
  Calendar,
  Sparkles,
  Sun,
  CalendarDays,
  Hash,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sessionsApi, challengesApi } from '@/lib/api';
import type { Session, DashboardStats, Challenge } from '@/lib/types';
import { challengeTypeLabels } from '@/lib/types';

const emptyStats: DashboardStats = {
  totalProfit: 0,
  totalSessions: 0,
  totalHours: 0,
  totalHands: 0,
  todayProfit: 0,
  weekProfit: 0,
  monthProfit: 0,
  winRate: 0,
};

function formatFullCurrency(value: number | undefined | null): string {
  const safeValue = value ?? 0;
  return `${safeValue >= 0 ? '+' : ''}${safeValue.toLocaleString()}원`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem('pokerly_welcome_banner_dismissed');
    if (bannerDismissed === 'true') {
      setShowWelcomeBanner(false);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [statsData, sessionsData, challengesData] = await Promise.all([
          sessionsApi.getStats(),
          sessionsApi.getAll(5),
          challengesApi.getActive().catch(() => []),
        ]);
        setStats(statsData);
        setRecentSessions(sessionsData);
        setActiveChallenges(challengesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchData();
    }
  }, [user]);

  const dismissWelcomeBanner = () => {
    setShowWelcomeBanner(false);
    localStorage.setItem('pokerly_welcome_banner_dismissed', 'true');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#6366F1', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#71717A' }}>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#EF4444', marginBottom: '16px' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div className="welcome-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles style={{ width: '28px', height: '28px', color: '#6366F1' }} />
            </div>
            <div>
              <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '6px', fontSize: '18px' }}>Pokerly에 오신 것을 환영합니다!</h3>
              <p style={{ color: '#A1A1AA', fontSize: '15px' }}>
                세션을 기록하고 분석하여 포커 실력을 향상시켜 보세요.
              </p>
            </div>
          </div>
          <button onClick={dismissWelcomeBanner} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', flexShrink: 0 }}>
            <X style={{ width: '24px', height: '24px', color: '#71717A' }} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="app-page-header">
        <h1 className="app-page-title">
          안녕하세요, {user?.displayName?.split(' ')[0] || '플레이어'}님
        </h1>
        <p className="app-page-subtitle">오늘의 포커 현황을 확인하세요</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/app/upload" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Plus style={{ width: '18px', height: '18px' }} />
          세션 기록하기
        </Link>
        <Link href="/app/sessions" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <History style={{ width: '18px', height: '18px' }} />
          전체 기록 보기
        </Link>
      </div>

      {/* Today & This Week Stats - Full Width Highlighted */}
      <div className="stats-grid stats-grid-highlight">
        {/* Today */}
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sun style={{ width: '28px', height: '28px', color: '#FBBF24' }} />
            </div>
            <div>
              <p style={{ color: '#FBBF24', fontSize: '15px', fontWeight: 600 }}>오늘</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <p className="stats-card-value" style={{ color: stats.todayProfit >= 0 ? '#10B981' : '#EF4444', fontSize: '32px' }}>
            {formatFullCurrency(stats.todayProfit)}
          </p>
        </div>

        {/* This Week */}
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '1px solid rgba(34, 211, 238, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays style={{ width: '28px', height: '28px', color: '#22D3EE' }} />
            </div>
            <div>
              <p style={{ color: '#22D3EE', fontSize: '15px', fontWeight: 600 }}>이번 주</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>일요일부터 오늘까지</p>
            </div>
          </div>
          <p className="stats-card-value" style={{ color: stats.weekProfit >= 0 ? '#10B981' : '#EF4444', fontSize: '32px' }}>
            {formatFullCurrency(stats.weekProfit)}
          </p>
        </div>
      </div>

      {/* Stats Grid - 5 columns on PC */}
      <div className="stats-grid stats-grid-5-cols">
        {/* Total Profit */}
        <div className="stats-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="stats-card-label">총 수익</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: '22px', height: '22px', color: '#10B981' }} />
            </div>
          </div>
          <p className="stats-card-value" style={{ color: stats.totalProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {formatFullCurrency(stats.totalProfit)}
          </p>
          <p style={{ color: '#71717A', fontSize: '13px', marginTop: '6px' }}>{stats.totalSessions} 세션</p>
        </div>

        {/* This Month */}
        <div className="stats-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="stats-card-label">이번 달</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: '22px', height: '22px', color: '#6366F1' }} />
            </div>
          </div>
          <p className="stats-card-value" style={{ color: stats.monthProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {formatFullCurrency(stats.monthProfit)}
          </p>
        </div>

        {/* Win Rate */}
        <div className="stats-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="stats-card-label">승률</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target style={{ width: '22px', height: '22px', color: '#8B5CF6' }} />
            </div>
          </div>
          <p className="stats-card-value" style={{ color: 'white' }}>{stats.winRate}%</p>
        </div>

        {/* Play Time */}
        <div className="stats-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="stats-card-label">플레이 시간</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock style={{ width: '22px', height: '22px', color: '#EC4899' }} />
            </div>
          </div>
          <p className="stats-card-value" style={{ color: 'white' }}>{stats.totalHours}시간</p>
        </div>

        {/* Total Hands */}
        <div className="stats-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="stats-card-label">총 핸드</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hash style={{ width: '22px', height: '22px', color: '#FBBF24' }} />
            </div>
          </div>
          <p className="stats-card-value" style={{ color: 'white' }}>{(stats.totalHands || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Two Column Layout for PC */}
      <div className="content-grid">
        {/* Active Challenges Widget */}
        <div className="full-width-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Trophy style={{ width: '24px', height: '24px', color: '#6366F1' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>진행 중인 챌린지</h2>
            </div>
            <Link href="/app/challenges" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366F1', textDecoration: 'none', fontSize: '14px' }}>
              전체 보기
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
          <div style={{ padding: '16px 24px' }}>
            {activeChallenges.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <p style={{ color: '#71717A', marginBottom: '16px' }}>진행 중인 챌린지가 없습니다</p>
                <Link href="/app/challenges" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                  챌린지 참여하기
                </Link>
              </div>
            ) : (
              activeChallenges.slice(0, 3).map((challenge, index) => {
                const progress = Math.min((challenge.currentValue / challenge.targetValue) * 100, 100);
                const progressColor = progress >= 100 ? '#10B981' : progress >= 50 ? '#6366F1' : '#F59E0B';
                const daysRemaining = Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

                return (
                  <div key={challenge.id} style={{ padding: '16px 0', borderBottom: index < Math.min(activeChallenges.length, 3) - 1 ? '1px solid #27272A' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 500, color: 'white', fontSize: '15px' }}>{challenge.title}</span>
                        <span style={{ padding: '3px 8px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '4px', fontSize: '12px', color: '#6366F1' }}>
                          {challengeTypeLabels[challenge.type]}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', color: daysRemaining <= 3 ? '#EF4444' : '#71717A' }}>
                        {daysRemaining}일 남음
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="progress-bar-container" style={{ flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: `${progress}%`, background: progressColor }} />
                      </div>
                      <span style={{ fontSize: '14px', color: progressColor, fontWeight: 600, minWidth: '45px', textAlign: 'right' }}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="full-width-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <History style={{ width: '24px', height: '24px', color: '#6366F1' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>최근 세션</h2>
            </div>
            <Link href="/app/sessions" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366F1', textDecoration: 'none', fontSize: '14px' }}>
              전체 보기
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>

          {recentSessions.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ color: '#71717A', marginBottom: '16px' }}>아직 기록된 세션이 없습니다</p>
              <Link href="/app/upload" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Plus style={{ width: '18px', height: '18px' }} />
                첫 세션 기록하기
              </Link>
            </div>
          ) : (
            <div>
              {recentSessions.map((session, index) => {
                const profit = session.cashOut - session.buyIn;
                return (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 24px',
                      borderBottom: index < recentSessions.length - 1 ? '1px solid #27272A' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: profit >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {profit >= 0 ? (
                          <TrendingUp style={{ width: '24px', height: '24px', color: '#10B981' }} />
                        ) : (
                          <TrendingDown style={{ width: '24px', height: '24px', color: '#EF4444' }} />
                        )}
                      </div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 500, marginBottom: '4px', fontSize: '15px' }}>{session.venue}</p>
                        <p style={{ color: '#71717A', fontSize: '13px' }}>
                          {session.stakes} · {session.gameType === 'cash' ? '캐시게임' : '토너먼트'} · {session.date}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: profit >= 0 ? '#10B981' : '#EF4444' }}>
                      {formatFullCurrency(profit)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
