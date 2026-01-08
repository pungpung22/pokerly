'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Target, Zap, Award, Loader2, Calendar, ChevronDown } from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { useAuth } from '../../contexts/AuthContext';

type PeriodType = 'today' | 'week' | 'month' | 'last30' | 'all' | 'custom';

interface AnalyticsData {
  byGameType: { type: string; profit: number; sessions: number; winRate: number }[];
  byStakes: { stakes: string; profit: number; sessions: number; bbPer100: number }[];
  byVenue: { venue: string; profit: number; sessions: number }[];
  dailyTrend: { date: string; profit: number; sessions: number }[];
  monthlyTrend: { month: string; profit: number; sessions: number }[];
  totals: { sessions: number; profit: number; hours: number };
}

const periodLabels: Record<PeriodType, string> = {
  today: '오늘',
  week: '이번 주',
  month: '이번 달',
  last30: '최근 30일',
  all: '전체',
  custom: '커스텀',
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

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<PeriodType>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartType, setChartType] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const data = await sessionsApi.getAnalytics(
          period === 'custom' ? 'custom' : period,
          period === 'custom' ? startDate : undefined,
          period === 'custom' ? endDate : undefined
        );
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err instanceof Error ? err.message : '분석 데이터를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchAnalytics();
    }
  }, [user, period, startDate, endDate]);

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    if (newPeriod === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      setShowDatePicker(false);
    }
  };

  const dailyData = Array.isArray(analytics?.dailyTrend) ? analytics.dailyTrend : [];
  const monthlyData = Array.isArray(analytics?.monthlyTrend) ? analytics.monthlyTrend : [];
  const gameTypeStats = Array.isArray(analytics?.byGameType) ? analytics.byGameType : [];
  const stakesStats = Array.isArray(analytics?.byStakes) ? analytics.byStakes : [];
  const venueStats = Array.isArray(analytics?.byVenue) ? analytics.byVenue : [];
  const totals = analytics?.totals || { sessions: 0, profit: 0, hours: 0 };

  const chartData = chartType === 'daily' ? dailyData : monthlyData;
  const maxProfit = chartData.length > 0 ? Math.max(...chartData.map((d) => Math.abs(d.profit))) : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ width: '40px', height: '40px', color: '#6366F1', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#71717A' }}>분석 데이터를 불러오는 중...</p>
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>분석</h1>
        <p style={{ color: '#71717A' }}>포커 성과를 다양한 관점에서 분석합니다</p>
      </div>

      {/* Period Filter */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {(Object.keys(periodLabels) as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              style={{
                padding: '10px 16px',
                background: period === p ? 'rgba(99, 102, 241, 0.2)' : '#141416',
                border: `1px solid ${period === p ? '#6366F1' : '#27272A'}`,
                borderRadius: '8px',
                color: period === p ? '#6366F1' : '#71717A',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: period === p ? 500 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {p === 'custom' && <Calendar style={{ width: '14px', height: '14px' }} />}
              {periodLabels[p]}
            </button>
          ))}
        </div>

        {/* Custom Date Picker */}
        {showDatePicker && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: '#141416', borderRadius: '8px', border: '1px solid #27272A' }}>
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
            <button
              onClick={handleCustomDateApply}
              disabled={!startDate || !endDate}
              style={{
                marginTop: '20px',
                padding: '8px 16px',
                background: startDate && endDate ? '#6366F1' : '#27272A',
                border: 'none',
                borderRadius: '6px',
                color: startDate && endDate ? 'white' : '#71717A',
                cursor: startDate && endDate ? 'pointer' : 'not-allowed',
                fontSize: '14px',
              }}
            >
              적용
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '8px' }}>총 수익</p>
          <p style={{ fontSize: '22px', fontWeight: 'bold', color: totals.profit >= 0 ? '#10B981' : '#EF4444' }}>
            {totals.profit >= 0 ? '+' : ''}{formatCurrency(totals.profit)}원
          </p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '8px' }}>세션 수</p>
          <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>{totals.sessions}회</p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '8px' }}>플레이 시간</p>
          <p style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>{totals.hours}시간</p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '8px' }}>시간당 수익</p>
          <p style={{ fontSize: '22px', fontWeight: 'bold', color: totals.hours > 0 ? (totals.profit / totals.hours >= 0 ? '#10B981' : '#EF4444') : '#71717A' }}>
            {totals.hours > 0 ? `${Math.round(totals.profit / totals.hours).toLocaleString()}원` : '-'}
          </p>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp style={{ width: '24px', height: '24px', color: '#6366F1' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>수익 추이</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setChartType('daily')}
              style={{
                padding: '6px 12px',
                background: chartType === 'daily' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: `1px solid ${chartType === 'daily' ? '#6366F1' : '#27272A'}`,
                borderRadius: '6px',
                color: chartType === 'daily' ? '#6366F1' : '#71717A',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              일별
            </button>
            <button
              onClick={() => setChartType('monthly')}
              style={{
                padding: '6px 12px',
                background: chartType === 'monthly' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: `1px solid ${chartType === 'monthly' ? '#6366F1' : '#27272A'}`,
                borderRadius: '6px',
                color: chartType === 'monthly' ? '#6366F1' : '#71717A',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              월별
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#71717A' }}>해당 기간에 데이터가 없습니다</p>
          </div>
        ) : (
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '32px', overflowX: 'auto' }}>
            {chartData.slice(-15).map((data) => {
              const height = maxProfit > 0 ? (Math.abs(data.profit) / maxProfit) * 100 : 0;
              const isPositive = data.profit >= 0;
              const label = chartType === 'daily'
                ? (data as { date: string }).date.slice(5).replace('-', '/')
                : (data as { month: string }).month.slice(5) + '월';
              return (
                <div key={chartType === 'daily' ? (data as { date: string }).date : (data as { month: string }).month} style={{ flex: '0 0 auto', minWidth: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: isPositive ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
                    <p style={{ color: isPositive ? '#10B981' : '#EF4444', fontWeight: 'bold', marginBottom: '4px', fontSize: '11px' }}>
                      {isPositive ? '+' : ''}{formatCurrency(data.profit)}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '40px',
                        height: `${Math.max(height, 4)}%`,
                        minHeight: '4px',
                        background: isPositive
                          ? 'linear-gradient(to top, #10B981, #34D399)'
                          : 'linear-gradient(to bottom, #EF4444, #F87171)',
                        borderRadius: isPositive ? '4px 4px 0 0' : '0 0 4px 4px',
                      }}
                    />
                  </div>
                  <p style={{ color: '#71717A', marginTop: '8px', fontSize: '11px' }}>{label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Game Type & Stakes Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* By Game Type */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Target style={{ width: '24px', height: '24px', color: '#6366F1' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>게임 유형별</h2>
          </div>

          {gameTypeStats.length === 0 ? (
            <p style={{ color: '#71717A', textAlign: 'center', padding: '20px 0' }}>데이터 없음</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {gameTypeStats.map((stat) => (
                <div key={stat.type} style={{ padding: '16px', background: '#0A0A0B', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'white', fontWeight: 500 }}>{stat.type}</span>
                    <span style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                      {stat.profit >= 0 ? '+' : ''}{stat.profit.toLocaleString()}원
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: '#71717A', fontSize: '13px' }}>
                    <span>{stat.sessions} 세션</span>
                    <span>승률 {stat.winRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Stakes */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Zap style={{ width: '24px', height: '24px', color: '#6366F1' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>스테이크별</h2>
          </div>

          {stakesStats.length === 0 ? (
            <p style={{ color: '#71717A', textAlign: 'center', padding: '20px 0' }}>데이터 없음</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stakesStats.map((stat) => (
                <div key={stat.stakes} style={{ padding: '16px', background: '#0A0A0B', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'white', fontWeight: 500 }}>{stat.stakes}</span>
                    <span style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                      {stat.profit >= 0 ? '+' : ''}{stat.profit.toLocaleString()}원
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: '#71717A', fontSize: '13px' }}>
                    <span>{stat.sessions} 세션</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Venue Performance */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Award style={{ width: '24px', height: '24px', color: '#6366F1' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>장소별 성적</h2>
        </div>

        {venueStats.length === 0 ? (
          <p style={{ color: '#71717A', textAlign: 'center', padding: '20px 0' }}>데이터 없음</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {venueStats.map((stat) => (
              <div key={stat.venue} style={{ padding: '16px', background: '#0A0A0B', borderRadius: '8px' }}>
                <p style={{ color: 'white', fontWeight: 500, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {stat.venue}
                </p>
                <p style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>
                  {stat.profit >= 0 ? '+' : ''}{stat.profit.toLocaleString()}원
                </p>
                <p style={{ color: '#71717A', fontSize: '13px' }}>{stat.sessions} 세션</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
