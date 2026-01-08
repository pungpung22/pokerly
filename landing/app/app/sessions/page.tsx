'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Search,
  Loader2,
  Calendar,
  Filter,
  X
} from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Session, GameType } from '@/lib/types';

type PeriodType = 'today' | 'week' | 'month' | 'last30' | 'all' | 'custom';

const periodLabels: Record<PeriodType, string> = {
  today: '오늘',
  week: '이번 주',
  month: '이번 달',
  last30: '최근 30일',
  all: '전체',
  custom: '커스텀',
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

function isInPeriod(sessionDate: string, period: PeriodType, startDate: string, endDate: string): boolean {
  const date = new Date(sessionDate);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  switch (period) {
    case 'today': {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      return date >= start && date <= today;
    }
    case 'week': {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      return date >= start && date <= today;
    }
    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return date >= start && date <= today;
    }
    case 'last30': {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      return date >= start && date <= today;
    }
    case 'custom': {
      if (!startDate || !endDate) return true;
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }
    case 'all':
    default:
      return true;
  }
}

export default function SessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | GameType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState<PeriodType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setError(null);
      try {
        const data = await sessionsApi.getAll();
        setSessions(data);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setError(err instanceof Error ? err.message : '세션 목록을 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const filteredSessions = sessions.filter((session) => {
    // 게임 타입 필터
    if (filterType !== 'all' && session.gameType !== filterType) return false;
    // 장소 검색
    if (searchQuery && !session.venue.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // 기간 필터
    if (!isInPeriod(session.date, period, startDate, endDate)) return false;
    return true;
  });

  const totalProfit = filteredSessions.reduce((acc, s) => acc + (s.cashOut - s.buyIn), 0);
  const winCount = filteredSessions.filter((s) => s.cashOut >= s.buyIn).length;
  const winRate = filteredSessions.length > 0 ? ((winCount / filteredSessions.length) * 100).toFixed(1) : 0;
  const totalHours = Math.round(filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60);

  const activeFiltersCount =
    (filterType !== 'all' ? 1 : 0) +
    (period !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const clearFilters = () => {
    setFilterType('all');
    setPeriod('all');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#6366F1', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#71717A' }}>세션 목록을 불러오는 중...</p>
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>세션 기록</h1>
          <p style={{ color: '#71717A' }}>모든 포커 세션을 확인하고 관리하세요</p>
        </div>
        <Link href="/app/upload" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Plus style={{ width: '18px', height: '18px' }} />
          새 세션 추가
        </Link>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '4px' }}>총 세션</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{filteredSessions.length}</p>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '4px' }}>총 수익</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: totalProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
          </p>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '4px' }}>승률</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{winRate}%</p>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '4px' }}>플레이 시간</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{totalHours}시간</p>
        </div>
      </div>

      {/* Search and Filter Toggle */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#71717A' }} />
          <input
            type="text"
            placeholder="장소 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 42px',
              background: '#141416',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '12px 20px',
            background: showFilters || activeFiltersCount > 0 ? 'rgba(99, 102, 241, 0.2)' : '#141416',
            border: `1px solid ${showFilters || activeFiltersCount > 0 ? '#6366F1' : '#27272A'}`,
            borderRadius: '8px',
            color: showFilters || activeFiltersCount > 0 ? '#6366F1' : '#71717A',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Filter style={{ width: '16px', height: '16px' }} />
          필터
          {activeFiltersCount > 0 && (
            <span style={{
              background: '#6366F1',
              color: 'white',
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '12px',
            }}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: '#71717A',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <X style={{ width: '14px', height: '14px' }} />
            초기화
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          {/* Game Type Filter */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '10px' }}>게임 타입</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['all', 'cash', 'tournament'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '8px 16px',
                    background: filterType === type ? 'rgba(99, 102, 241, 0.2)' : '#0A0A0B',
                    border: `1px solid ${filterType === type ? '#6366F1' : '#27272A'}`,
                    borderRadius: '6px',
                    color: filterType === type ? '#6366F1' : '#71717A',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {type === 'all' ? '전체' : type === 'cash' ? '캐시게임' : '토너먼트'}
                </button>
              ))}
            </div>
          </div>

          {/* Period Filter */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '10px' }}>기간</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(Object.keys(periodLabels) as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '8px 16px',
                    background: period === p ? 'rgba(99, 102, 241, 0.2)' : '#0A0A0B',
                    border: `1px solid ${period === p ? '#6366F1' : '#27272A'}`,
                    borderRadius: '6px',
                    color: period === p ? '#6366F1' : '#71717A',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {p === 'custom' && <Calendar style={{ width: '12px', height: '12px' }} />}
                  {periodLabels[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          {period === 'custom' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', color: '#71717A', fontSize: '12px', marginBottom: '4px' }}>시작일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: '#0A0A0B',
                    border: '1px solid #27272A',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
              <span style={{ color: '#71717A', marginTop: '20px' }}>~</span>
              <div>
                <label style={{ display: 'block', color: '#71717A', fontSize: '12px', marginBottom: '4px' }}>종료일</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: '#0A0A0B',
                    border: '1px solid #27272A',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sessions List */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {filteredSessions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: '#71717A', marginBottom: '16px' }}>
              {activeFiltersCount > 0 ? '필터 조건에 맞는 세션이 없습니다' : '아직 기록된 세션이 없습니다'}
            </p>
            {activeFiltersCount > 0 ? (
              <button onClick={clearFilters} className="btn-secondary">필터 초기화</button>
            ) : (
              <Link href="/app/upload" className="btn-primary">첫 세션 기록하기</Link>
            )}
          </div>
        ) : (
          <div>
            {filteredSessions.map((session, index) => {
              const profit = session.cashOut - session.buyIn;
              return (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderBottom: index < filteredSessions.length - 1 ? '1px solid #27272A' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: profit >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {profit >= 0 ? (
                        <TrendingUp style={{ width: '22px', height: '22px', color: '#10B981' }} />
                      ) : (
                        <TrendingDown style={{ width: '22px', height: '22px', color: '#EF4444' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 500, marginBottom: '4px' }}>{session.venue}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: session.gameType === 'cash' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(34, 211, 238, 0.2)',
                          color: session.gameType === 'cash' ? '#6366F1' : '#22D3EE',
                          fontSize: '12px',
                        }}>
                          {session.gameType === 'cash' ? '캐시' : '토너먼트'}
                        </span>
                        <span style={{ color: '#71717A', fontSize: '13px' }}>{session.stakes}</span>
                        <span style={{ color: '#71717A', fontSize: '13px' }}>·</span>
                        <span style={{ color: '#71717A', fontSize: '13px' }}>{formatDuration(session.durationMinutes)}</span>
                        <span style={{ color: '#71717A', fontSize: '13px' }}>·</span>
                        <span style={{ color: '#71717A', fontSize: '13px' }}>{session.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: profit >= 0 ? '#10B981' : '#EF4444', marginBottom: '4px' }}>
                      {profit >= 0 ? '+' : ''}{profit.toLocaleString()}원
                    </p>
                    <p style={{ color: '#71717A', fontSize: '13px' }}>
                      {session.buyIn.toLocaleString()} → {session.cashOut.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
