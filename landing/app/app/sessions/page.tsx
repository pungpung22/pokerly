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
import type { Session, GameType, PlayerLevel } from '@/lib/types';
import { playerLevelLabels } from '@/lib/types';

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
      <div className="sessions-loading">
        <div className="sessions-loading-inner">
          <Loader2 className="sessions-loading-spinner" />
          <p className="sessions-loading-text">세션 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sessions-error">
        <div className="sessions-error-inner">
          <p className="sessions-error-text">{error}</p>
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
    <div className="sessions-page">
      {/* Header */}
      <div className="sessions-header">
        <div>
          <h1 className="sessions-header-title">세션 기록</h1>
          <p className="sessions-header-subtitle">모든 포커 세션을 확인하고 관리하세요</p>
        </div>
        <Link href="/app/upload" className="btn-primary">
          <Plus style={{ width: '18px', height: '18px' }} />
          새 세션 추가
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="sessions-summary-grid">
        <div className="card sessions-summary-card">
          <p className="sessions-summary-label">총 세션</p>
          <p className="sessions-summary-value">{filteredSessions.length}</p>
        </div>
        <div className="card sessions-summary-card">
          <p className="sessions-summary-label">총 수익</p>
          <p className="sessions-summary-value" style={{ color: totalProfit >= 0 ? '#10B981' : '#EF4444' }}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
          </p>
        </div>
        <div className="card sessions-summary-card">
          <p className="sessions-summary-label">승률</p>
          <p className="sessions-summary-value">{winRate}%</p>
        </div>
        <div className="card sessions-summary-card">
          <p className="sessions-summary-label">플레이 시간</p>
          <p className="sessions-summary-value">{totalHours}시간</p>
        </div>
      </div>

      {/* Search and Filter Toggle */}
      <div className="sessions-search-area">
        {/* Search */}
        <div className="sessions-search-wrapper">
          <Search className="sessions-search-icon" />
          <input
            type="text"
            placeholder="장소 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sessions-search-input"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`sessions-filter-toggle ${showFilters || activeFiltersCount > 0 ? 'active' : 'inactive'}`}
        >
          <Filter style={{ width: '16px', height: '16px' }} />
          필터
          {activeFiltersCount > 0 && (
            <span className="sessions-filter-badge">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="sessions-clear-btn">
            <X style={{ width: '14px', height: '14px' }} />
            초기화
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card sessions-filter-panel">
          {/* Game Type Filter */}
          <div className="sessions-filter-group">
            <p className="sessions-filter-label">게임 타입</p>
            <div className="sessions-filter-buttons">
              {(['all', 'cash', 'tournament'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`sessions-filter-btn ${filterType === type ? 'active' : 'inactive'}`}
                >
                  {type === 'all' ? '전체' : type === 'cash' ? '캐시게임' : '토너먼트'}
                </button>
              ))}
            </div>
          </div>

          {/* Period Filter */}
          <div className="sessions-filter-group">
            <p className="sessions-filter-label">기간</p>
            <div className="sessions-filter-buttons">
              {(Object.keys(periodLabels) as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`sessions-filter-btn ${period === p ? 'active' : 'inactive'}`}
                >
                  {p === 'custom' && <Calendar style={{ width: '12px', height: '12px' }} />}
                  {periodLabels[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          {period === 'custom' && (
            <div className="sessions-date-range">
              <div className="sessions-date-input-wrapper">
                <label className="sessions-date-label">시작일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="sessions-date-input"
                />
              </div>
              <span className="sessions-date-separator">~</span>
              <div className="sessions-date-input-wrapper">
                <label className="sessions-date-label">종료일</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="sessions-date-input"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sessions List */}
      <div className="card sessions-list-card">
        {filteredSessions.length === 0 ? (
          <div className="sessions-empty">
            <p className="sessions-empty-text">
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
                  className={`session-item ${index < filteredSessions.length - 1 ? 'session-item-border' : ''}`}
                >
                  <div className="session-item-left">
                    <div className={`session-item-icon ${profit >= 0 ? 'profit' : 'loss'}`}>
                      {profit >= 0 ? (
                        <TrendingUp style={{ width: '22px', height: '22px', color: '#10B981' }} />
                      ) : (
                        <TrendingDown style={{ width: '22px', height: '22px', color: '#EF4444' }} />
                      )}
                    </div>
                    <div>
                      <p className="session-item-venue">{session.venue}</p>
                      <div className="session-item-meta">
                        <span className={`session-item-badge ${session.gameType === 'cash' ? 'cash' : 'tournament'}`}>
                          {session.gameType === 'cash' ? '캐시' : '토너먼트'}
                        </span>
                        <span className="session-item-meta-text">{session.stakes}</span>
                        <span className="session-item-separator">·</span>
                        <span className="session-item-meta-text">{formatDuration(session.durationMinutes)}</span>
                        {session.hands > 0 && (
                          <>
                            <span className="session-item-separator">·</span>
                            <span className="session-item-meta-text">{session.hands}핸드</span>
                          </>
                        )}
                        {session.level && (
                          <>
                            <span className="session-item-separator">·</span>
                            <span className="session-item-badge level">
                              {playerLevelLabels[session.level]}
                            </span>
                          </>
                        )}
                        <span className="session-item-separator">·</span>
                        <span className="session-item-meta-text">{session.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="session-item-right">
                    <p className={`session-item-profit ${profit >= 0 ? 'positive' : 'negative'}`}>
                      {profit >= 0 ? '+' : ''}{profit.toLocaleString()}원
                    </p>
                    <p className="session-item-buyin">
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
