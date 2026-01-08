'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Flame,
  ArrowUpRight,
  Plus,
  History,
  Loader2,
  X,
  Calendar,
  Sparkles,
  Sun,
  CalendarDays,
  Hash
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sessionsApi } from '@/lib/api';
import type { Session, DashboardStats } from '@/lib/types';

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

function formatCurrency(value: number | undefined | null): string {
  const safeValue = value ?? 0;
  const absValue = Math.abs(safeValue);
  if (absValue >= 1000000) {
    return `${(safeValue / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 10000) {
    return `${(safeValue / 10000).toFixed(0)}만`;
  }
  return safeValue.toLocaleString();
}

function formatFullCurrency(value: number | undefined | null): string {
  const safeValue = value ?? 0;
  return `${safeValue >= 0 ? '+' : ''}${safeValue.toLocaleString()}원`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  useEffect(() => {
    // 환영 배너 상태 복원
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
        const [statsData, sessionsData] = await Promise.all([
          sessionsApi.getStats(),
          sessionsApi.getAll(5),
        ]);
        setStats(statsData);
        setRecentSessions(sessionsData);
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
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: '24px', height: '24px', color: '#6366F1' }} />
            </div>
            <div>
              <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '4px' }}>Pokerly에 오신 것을 환영합니다!</h3>
              <p style={{ color: '#A1A1AA', fontSize: '14px' }}>
                세션을 기록하고 분석하여 포커 실력을 향상시켜 보세요.
              </p>
            </div>
          </div>
          <button
            onClick={dismissWelcomeBanner}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}
          >
            <X style={{ width: '20px', height: '20px', color: '#71717A' }} />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
          안녕하세요, {user?.displayName?.split(' ')[0] || '플레이어'}님
        </h1>
        <p style={{ color: '#71717A' }}>오늘의 포커 현황을 확인하세요</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link
          href="/app/upload"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          세션 기록하기
        </Link>
        <Link
          href="/app/sessions"
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <History style={{ width: '18px', height: '18px' }} />
          전체 기록 보기
        </Link>
      </div>

      {/* Today & This Week Stats - Highlighted */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Today */}
        <div
          className="card"
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sun style={{ width: '24px', height: '24px', color: '#FBBF24' }} />
            </div>
            <div>
              <p style={{ color: '#FBBF24', fontSize: '13px', fontWeight: 500 }}>오늘</p>
              <p style={{ color: '#71717A', fontSize: '12px' }}>{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: stats.todayProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {formatFullCurrency(stats.todayProfit)}
          </p>
        </div>

        {/* This Week */}
        <div
          className="card"
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays style={{ width: '24px', height: '24px', color: '#22D3EE' }} />
            </div>
            <div>
              <p style={{ color: '#22D3EE', fontSize: '13px', fontWeight: 500 }}>이번 주</p>
              <p style={{ color: '#71717A', fontSize: '12px' }}>일요일부터 오늘까지</p>
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: stats.weekProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {formatFullCurrency(stats.weekProfit)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Total Profit */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#71717A', fontSize: '13px' }}>총 수익</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: '18px', height: '18px', color: '#10B981' }} />
            </div>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: stats.totalProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {formatFullCurrency(stats.totalProfit)}
          </p>
          <p style={{ color: '#71717A', fontSize: '12px', marginTop: '4px' }}>{stats.totalSessions} 세션</p>
        </div>

        {/* This Month */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#71717A', fontSize: '13px' }}>이번 달</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: '18px', height: '18px', color: '#6366F1' }} />
            </div>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: stats.monthProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {formatFullCurrency(stats.monthProfit)}
          </p>
        </div>

        {/* Win Rate */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#71717A', fontSize: '13px' }}>승률</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target style={{ width: '18px', height: '18px', color: '#8B5CF6' }} />
            </div>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{stats.winRate}%</p>
        </div>

        {/* Play Time */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#71717A', fontSize: '13px' }}>플레이 시간</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock style={{ width: '18px', height: '18px', color: '#EC4899' }} />
            </div>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{stats.totalHours}시간</p>
        </div>

        {/* Total Hands */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#71717A', fontSize: '13px' }}>총 핸드</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hash style={{ width: '18px', height: '18px', color: '#FBBF24' }} />
            </div>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{(stats.totalHands || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #27272A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>최근 세션</h2>
          <Link href="/app/sessions" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366F1', textDecoration: 'none', fontSize: '14px' }}>
            전체 보기
            <ArrowUpRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
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
                    padding: '16px 24px',
                    borderBottom: index < recentSessions.length - 1 ? '1px solid #27272A' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: profit >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {profit >= 0 ? (
                        <TrendingUp style={{ width: '20px', height: '20px', color: '#10B981' }} />
                      ) : (
                        <TrendingDown style={{ width: '20px', height: '20px', color: '#EF4444' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 500, marginBottom: '2px' }}>{session.venue}</p>
                      <p style={{ color: '#71717A', fontSize: '13px' }}>
                        {session.stakes} · {session.gameType === 'cash' ? '캐시게임' : '토너먼트'} · {session.date}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: profit >= 0 ? '#10B981' : '#EF4444' }}>
                    {formatFullCurrency(profit)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
