'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Target, Zap, Award, Loader2, Calendar, AlertTriangle, Trophy, Flame, TrendingDown, Activity, BarChart3, Percent, Clock, DollarSign, Hash } from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';

type PeriodType = 'today' | 'week' | 'month' | 'last30' | 'all' | 'custom';

interface AnalyticsData {
  byGameType: { type: string; profit: number; sessions: number; winRate: number }[];
  byStakes: { stakes: string; profit: number; sessions: number; bbPer100: number }[];
  byVenue: { venue: string; profit: number; sessions: number }[];
  dailyTrend: { date: string; profit: number; sessions: number; hands?: number }[];
  monthlyTrend: { month: string; profit: number; sessions: number }[];
  totals: { sessions: number; profit: number; hours: number; hands?: number };
  bbStats?: {
    avgBbPer100: number;
    stdDev: number;
    reliabilityLevel: number;
    reliabilityLabel: string;
    playStyle: string;
    volatilityLevel: string;
    sessionsWithData: number;
  };
}

const periodKeys: PeriodType[] = ['today', 'week', 'month', 'last30', 'all', 'custom'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const t = useTranslations('Analytics');
  const tCommon = useTranslations('Common');
  const tUnits = useTranslations('Units');
  const locale = useLocale();
  const [period, setPeriod] = useState<PeriodType>('all');
  const [gameTypeFilter, setGameTypeFilter] = useState<'all' | 'cash' | 'tournament'>('all');

  // Locale-aware currency formatting
  const formatCurrency = (value: number | undefined | null): string => {
    const safeValue = value ?? 0;
    const absValue = Math.abs(safeValue);
    if (locale === 'ko') {
      if (absValue >= 10000) {
        return `${(safeValue / 10000).toFixed(0)}만`;
      }
      return safeValue.toLocaleString();
    }
    if (absValue >= 1000000) {
      return `${(safeValue / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 1000) {
      return `${(safeValue / 1000).toFixed(0)}K`;
    }
    return safeValue.toLocaleString();
  };

  const formatFullCurrency = (value: number | undefined | null, showSign: boolean = true): string => {
    const safeValue = value ?? 0;
    const currencySymbol = locale === 'en' ? '$' : locale === 'ja' ? '¥' : '';
    const currencySuffix = locale === 'ko' ? tUnits('won') : '';
    const sign = showSign ? (safeValue >= 0 ? '+' : '-') : (safeValue < 0 ? '-' : '');
    const absValue = Math.abs(safeValue);
    if (locale === 'en' || locale === 'ja') {
      return `${sign}${currencySymbol}${absValue.toLocaleString()}`;
    }
    return `${sign}${absValue.toLocaleString()}${currencySuffix}`;
  };
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartType, setChartType] = useState<'daily' | 'monthly'>('daily');
  const [hoveredBar, setHoveredBar] = useState<{ idx: number; x: number; y: number; data: { date?: string; month?: string; profit: number }; sigma?: number } | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const data = await sessionsApi.getAnalytics(
          period === 'custom' ? 'custom' : period,
          period === 'custom' ? startDate : undefined,
          period === 'custom' ? endDate : undefined,
          gameTypeFilter
        );
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err instanceof Error ? err.message : t('loadError'));
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchAnalytics();
    }
  }, [user, period, startDate, endDate, gameTypeFilter]);

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

  // Calculate cumulative data for line chart
  const cumulativeData = dailyData.reduce((acc: { date: string; cumulative: number }[], curr, idx) => {
    const prevCumulative = idx > 0 ? acc[idx - 1].cumulative : 0;
    acc.push({ date: curr.date, cumulative: prevCumulative + curr.profit });
    return acc;
  }, []);

  // Period insights
  const bestDay = dailyData.length > 0 ? dailyData.reduce((best, curr) => curr.profit > best.profit ? curr : best, dailyData[0]) : null;
  const worstDay = dailyData.length > 0 ? dailyData.reduce((worst, curr) => curr.profit < worst.profit ? curr : worst, dailyData[0]) : null;

  // Calculate streaks
  const calculateStreaks = () => {
    if (dailyData.length === 0) return { winStreak: 0, lossStreak: 0, currentStreak: 0, currentType: 'none' as 'win' | 'loss' | 'none' };

    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;

    for (const day of dailyData) {
      if (day.profit > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else if (day.profit < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      }
    }

    let currentStreak = 0;
    let currentType: 'win' | 'loss' | 'none' = 'none';
    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i].profit > 0) {
        if (currentType === 'none' || currentType === 'win') {
          currentType = 'win';
          currentStreak++;
        } else break;
      } else if (dailyData[i].profit < 0) {
        if (currentType === 'none' || currentType === 'loss') {
          currentType = 'loss';
          currentStreak++;
        } else break;
      } else break;
    }

    return { winStreak: maxWinStreak, lossStreak: maxLossStreak, currentStreak, currentType };
  };

  const streaks = calculateStreaks();

  // Average session stats
  const avgSessionProfit = totals.sessions > 0 ? totals.profit / totals.sessions : 0;
  const avgSessionDuration = totals.sessions > 0 ? (totals.hours * 60) / totals.sessions : 0;

  // Tournament ROI
  const tournamentStats = gameTypeStats.find(g => g.type === '토너먼트' || g.type === 'Tournament');
  const tournamentROI = tournamentStats && tournamentStats.sessions > 0
    ? ((tournamentStats.profit) / (tournamentStats.sessions * 10000)) * 100
    : null;

  // Cumulative chart
  const maxCumulative = cumulativeData.length > 0 ? Math.max(...cumulativeData.map(d => d.cumulative)) : 0;
  const minCumulative = cumulativeData.length > 0 ? Math.min(...cumulativeData.map(d => d.cumulative)) : 0;

  // Period display
  const getPeriodDisplay = () => {
    const today = new Date();
    const formatDate = (d: Date) => d.toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale === 'ja' ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    switch (period) {
      case 'today':
        return formatDate(today);
      case 'week': {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return `${formatDate(weekStart)} ~ ${formatDate(today)}`;
      }
      case 'month': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return `${formatDate(monthStart)} ~ ${formatDate(today)}`;
      }
      case 'last30': {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return `${formatDate(thirtyDaysAgo)} ~ ${formatDate(today)}`;
      }
      case 'all':
        return locale === 'ko' ? '전체 기간' : locale === 'ja' ? '全期間' : 'All Time';
      case 'custom':
        if (startDate && endDate) {
          return `${startDate} ~ ${endDate}`;
        }
        return locale === 'ko' ? '기간 선택' : locale === 'ja' ? '期間選択' : 'Select period';
      default:
        return '';
    }
  };

  // Insights
  const getInsights = () => {
    const insights: { type: 'warning' | 'success' | 'info'; message: string }[] = [];

    if (stakesStats.length > 0) {
      const worstStakes = stakesStats.reduce((worst, curr) => curr.profit < worst.profit ? curr : worst, stakesStats[0]);
      if (worstStakes.profit < 0 && worstStakes.sessions >= 1) {
        insights.push({ type: 'warning', message: t('insights.worstStakes', { stakes: worstStakes.stakes, profit: formatFullCurrency(worstStakes.profit) }) });
      }
    }

    if (venueStats.length > 0) {
      const bestVenue = venueStats.reduce((best, curr) => curr.profit > best.profit ? curr : best, venueStats[0]);
      if (bestVenue.profit > 0) {
        insights.push({ type: 'success', message: t('insights.bestVenue', { venue: bestVenue.venue, profit: formatFullCurrency(bestVenue.profit) }) });
      }
    }

    const winRate = totals.sessions > 0 ? gameTypeStats.reduce((sum, g) => sum + g.winRate * g.sessions, 0) / totals.sessions : 0;
    if (winRate < 40 && totals.sessions >= 3) {
      insights.push({ type: 'warning', message: t('insights.lowWinRate', { rate: Math.round(winRate) }) });
    } else if (winRate >= 60 && totals.sessions >= 3) {
      insights.push({ type: 'success', message: t('insights.highWinRate', { rate: Math.round(winRate) }) });
    }

    return insights;
  };

  const insights = getInsights();

  // Calculate max values for progress bars
  const maxGameTypeProfit = gameTypeStats.length > 0 ? Math.max(...gameTypeStats.map(s => Math.abs(s.profit))) : 0;
  const maxStakesProfit = stakesStats.length > 0 ? Math.max(...stakesStats.map(s => Math.abs(s.profit))) : 0;
  const maxVenueProfit = venueStats.length > 0 ? Math.max(...venueStats.map(s => Math.abs(s.profit))) : 0;

  if (loading) {
    return (
      <div className="analytics-loading-state">
        <div className="analytics-loading-content">
          <Loader2 className="analytics-loading-spinner" />
          <p className="analytics-loading-text">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error-state">
        <div className="analytics-error-content">
          <p className="analytics-error-text">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            {tCommon('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      {/* Header */}
      <div className="app-page-header">
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">{t('subtitle')}</p>
      </div>

      {/* Filters Section - Improved */}
      <div className="card analytics-filter-card">
        {/* Game Type Filter */}
        <div className="analytics-filter-group">
          <div className="analytics-filter-group-header">
            <Target style={{ width: '16px', height: '16px', color: '#F72585' }} />
            <span className="analytics-filter-group-label">{t('filters.gameType')}</span>
          </div>
          <div className="analytics-filter-buttons">
            {(['all', 'cash', 'tournament'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setGameTypeFilter(type)}
                className={`filter-btn ${gameTypeFilter === type ? 'active' : ''}`}
              >
                {t(`filters.${type}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="analytics-filter-divider" />

        {/* Period Filter */}
        <div className="analytics-filter-group">
          <div className="analytics-filter-group-header">
            <Calendar style={{ width: '16px', height: '16px', color: '#F72585' }} />
            <span className="analytics-filter-group-label">{t('filters.period')}</span>
          </div>
          <div className="analytics-filter-buttons">
            {periodKeys.map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`filter-btn ${period === p ? 'active' : ''}`}
              >
                {p === 'custom' && <Calendar style={{ width: '14px', height: '14px', marginRight: '4px' }} />}
                {t(`periods.${p}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Picker */}
        {showDatePicker && (
          <div className="analytics-date-picker">
            <div className="analytics-date-input-group">
              <label className="analytics-date-label">{t('dateRange.startDate')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="analytics-date-input"
              />
            </div>
            <span className="analytics-date-separator">~</span>
            <div className="analytics-date-input-group">
              <label className="analytics-date-label">{t('dateRange.endDate')}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="analytics-date-input"
              />
            </div>
            <button
              onClick={handleCustomDateApply}
              disabled={!startDate || !endDate}
              className={`analytics-date-apply-btn ${startDate && endDate ? 'enabled' : 'disabled'}`}
            >
              {t('dateRange.apply')}
            </button>
          </div>
        )}

        {/* Selected Period Display */}
        <div className="analytics-period-badge">
          <Calendar style={{ width: '14px', height: '14px' }} />
          <span>{getPeriodDisplay()}</span>
        </div>
      </div>

      {/* Summary Cards - Equal Width Grid */}
      <div className="analytics-summary-grid">
        <div className="analytics-summary-card">
          <div className="analytics-summary-icon" style={{ background: totals.profit >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
            <DollarSign style={{ width: '20px', height: '20px', color: totals.profit >= 0 ? '#10B981' : '#EF4444' }} />
          </div>
          <div className="analytics-summary-content">
            <p className="analytics-summary-label">{totals.profit >= 0 ? t('stats.totalProfit') : t('stats.totalLoss')}</p>
            <p className="analytics-summary-value" style={{ color: totals.profit >= 0 ? '#10B981' : '#EF4444' }}>
              {formatFullCurrency(totals.profit)}
            </p>
          </div>
        </div>
        <div className="analytics-summary-card">
          <div className="analytics-summary-icon" style={{ background: 'rgba(247, 37, 133, 0.15)' }}>
            <Hash style={{ width: '20px', height: '20px', color: '#F72585' }} />
          </div>
          <div className="analytics-summary-content">
            <p className="analytics-summary-label">{t('stats.sessions')}</p>
            <p className="analytics-summary-value">{totals.sessions}<span className="analytics-summary-unit">{locale === 'ko' ? '회' : ''}</span></p>
          </div>
        </div>
        <div className="analytics-summary-card">
          <div className="analytics-summary-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <Clock style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
          </div>
          <div className="analytics-summary-content">
            <p className="analytics-summary-label">{t('stats.playTime')}</p>
            <p className="analytics-summary-value">{totals.hours}<span className="analytics-summary-unit">{tUnits('hours')}</span></p>
          </div>
        </div>
        <div className="analytics-summary-card">
          <div className="analytics-summary-icon" style={{ background: totals.hours > 0 && totals.profit / totals.hours >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
            <TrendingUp style={{ width: '20px', height: '20px', color: totals.hours > 0 && totals.profit / totals.hours >= 0 ? '#10B981' : '#EF4444' }} />
          </div>
          <div className="analytics-summary-content">
            <p className="analytics-summary-label">{totals.hours > 0 && totals.profit / totals.hours >= 0 ? t('stats.hourlyRate') : t('stats.hourlyLoss')}</p>
            <p className="analytics-summary-value" style={{ color: totals.hours > 0 ? (totals.profit / totals.hours >= 0 ? '#10B981' : '#EF4444') : '#71717A' }}>
              {totals.hours > 0 ? formatFullCurrency(Math.round(totals.profit / totals.hours)) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Profit Chart - SVG with Axes */}
      <div className="card analytics-chart-card">
        <div className="analytics-chart-header">
          <div className="analytics-title-group">
            <TrendingUp className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('profitTrend')}</h2>
          </div>
          <div className="analytics-chart-type-buttons">
            <button
              onClick={() => setChartType('daily')}
              className={`filter-btn sm ${chartType === 'daily' ? 'active' : ''}`}
            >
              {t('daily')}
            </button>
            <button
              onClick={() => setChartType('monthly')}
              className={`filter-btn sm ${chartType === 'monthly' ? 'active' : ''}`}
            >
              {t('monthly')}
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="analytics-chart-empty">
            <p className="analytics-empty-text">{t('noData')}</p>
          </div>
        ) : (() => {
          const displayData = chartData.slice(-12);
          const barChartHeight = 260;
          const barPadding = { top: 35, bottom: 50, left: 70, right: 30 };
          const barChartWidth = 700;
          const barGraphWidth = barChartWidth - barPadding.left - barPadding.right;
          const barGraphHeight = barChartHeight - barPadding.top - barPadding.bottom;

          // 막대 너비와 위치 계산 - 전체 너비에 균등 분배
          const barCount = displayData.length;
          const maxBarWidth = 50;
          const minBarWidth = 20;
          // 전체 그래프 영역을 barCount 등분
          const sectionWidth = barGraphWidth / barCount;
          const barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, sectionWidth * 0.6));

          const getBarX = (idx: number) => {
            // 각 섹션 중앙에 막대 배치
            const sectionCenter = barPadding.left + sectionWidth * idx + sectionWidth / 2;
            return sectionCenter - barWidth / 2;
          };

          const profits = displayData.map(d => d.profit);

          // σ(시그마) 계산을 위한 평균과 표준편차
          const profitMean = profits.reduce((a, b) => a + b, 0) / profits.length;
          const profitStdDev = profits.length >= 2
            ? Math.sqrt(profits.map(p => Math.pow(p - profitMean, 2)).reduce((a, b) => a + b, 0) / profits.length)
            : 0;
          const getSigma = (profit: number) => profitStdDev > 0 ? (profit - profitMean) / profitStdDev : 0;
          const barMaxVal = Math.max(...profits, 0);
          const barMinVal = Math.min(...profits, 0);
          const barRange = barMaxVal - barMinVal || 1;

          const getBarY = (val: number) => {
            if (barMaxVal === barMinVal) return barPadding.top + barGraphHeight / 2;
            return barPadding.top + barGraphHeight - ((val - barMinVal) / barRange) * barGraphHeight;
          };
          const zeroY = getBarY(0);

          // Y축 눈금 계산 (5개 정도로 나누기)
          const yTickCount = 5;
          const yTicks: number[] = [];
          for (let i = 0; i <= yTickCount; i++) {
            const val = barMinVal + (barRange / yTickCount) * i;
            yTicks.push(Math.round(val));
          }
          // 0이 없으면 추가
          if (!yTicks.includes(0) && barMinVal < 0 && barMaxVal > 0) {
            yTicks.push(0);
            yTicks.sort((a, b) => b - a);
          }

          return (
            <div className="analytics-chart-wrapper">
              <div className="analytics-svg-container">
                <svg
                  width="100%"
                  height={barChartHeight}
                  viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Y축 그리드 라인 & 레이블 */}
                  {yTicks.map((tick, i) => (
                    <g key={i}>
                      <line
                        x1={barPadding.left}
                        y1={getBarY(tick)}
                        x2={barChartWidth - barPadding.right}
                        y2={getBarY(tick)}
                        stroke={tick === 0 ? '#52525B' : '#27272A'}
                        strokeWidth={tick === 0 ? 1 : 0.5}
                        strokeDasharray={tick === 0 ? '0' : '4'}
                      />
                      <text
                        x={barPadding.left - 10}
                        y={getBarY(tick) + 4}
                        textAnchor="end"
                        fill={tick > 0 ? '#10B981' : tick < 0 ? '#EF4444' : '#71717A'}
                        fontSize="11"
                      >
                        {formatCurrency(tick)}
                      </text>
                    </g>
                  ))}

                  {/* 막대 그래프 */}
                  {displayData.map((data, idx) => {
                    const isPositive = data.profit >= 0;
                    const barX = getBarX(idx);
                    const barHeight = Math.abs(getBarY(data.profit) - zeroY);
                    const barY = isPositive ? getBarY(data.profit) : zeroY;
                    const label = chartType === 'daily'
                      ? (data as { date: string }).date
                      : locale === 'ko'
                        ? (data as { month: string }).month.slice(5) + '월'
                        : (data as { month: string }).month.slice(5);

                    return (
                      <g key={chartType === 'daily' ? (data as { date: string }).date : (data as { month: string }).month}>
                        {/* 막대 */}
                        <rect
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={Math.max(barHeight, 8)}
                          rx="3"
                          fill={isPositive ? '#10B981' : '#EF4444'}
                          style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                          opacity={hoveredBar && hoveredBar.idx !== idx ? 0.4 : 1}
                          onMouseEnter={() => setHoveredBar({
                            idx,
                            x: barX + barWidth / 2,
                            y: barY,
                            data: data as { date?: string; month?: string; profit: number },
                            sigma: getSigma(data.profit)
                          })}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                        {/* X축 레이블 (날짜) */}
                        <text
                          x={barX + barWidth / 2}
                          y={barChartHeight - barPadding.bottom + 20}
                          textAnchor="middle"
                          fill="#A1A1AA"
                          fontSize="11"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}

                  {/* 호버 툴팁 */}
                  {hoveredBar && (() => {
                    // 툴팁이 위로 잘리면 아래에 표시
                    const tooltipAbove = hoveredBar.y > 80;
                    const tooltipY = tooltipAbove ? hoveredBar.y - 65 : hoveredBar.y + 60;
                    const sigma = hoveredBar.sigma || 0;
                    const sigmaColor = Math.abs(sigma) >= 2 ? '#F59E0B' : sigma >= 0 ? '#10B981' : '#EF4444';
                    return (
                      <g>
                        <rect
                          x={hoveredBar.x - 85}
                          y={tooltipY}
                          width={170}
                          height={52}
                          rx="8"
                          fill="#18181B"
                          stroke="#3F3F46"
                          strokeWidth="1"
                          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                        />
                        <text
                          x={hoveredBar.x}
                          y={tooltipY + 22}
                          textAnchor="middle"
                          fill={hoveredBar.data.profit >= 0 ? '#10B981' : '#EF4444'}
                          fontSize="14"
                          fontWeight="700"
                        >
                          {formatFullCurrency(hoveredBar.data.profit)}
                        </text>
                        <text
                          x={hoveredBar.x}
                          y={tooltipY + 42}
                          textAnchor="middle"
                          fill={sigmaColor}
                          fontSize="12"
                        >
                          {sigma >= 0 ? '+' : ''}{sigma.toFixed(2)}σ {Math.abs(sigma) >= 2 ? '(극단적)' : Math.abs(sigma) >= 1 ? '(평균 이상/이하)' : '(평균 근처)'}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
              {displayData.length < 5 && (
                <p className="analytics-chart-hint">{t('chartHint')}</p>
              )}
            </div>
          );
        })()}
      </div>

      {/* Cumulative Profit - SVG Line Chart with Axes */}
      {cumulativeData.length >= 1 && (() => {
        // 0에서 시작하는 데이터 생성 (시작점 추가)
        const rawData = cumulativeData.slice(-11);
        const chartDataWithStart = [
          { date: 'start', cumulative: 0 },
          ...rawData
        ];

        const lineChartHeight = 280;
        const linePadding = { top: 35, bottom: 50, left: 70, right: 30 };
        const lineChartWidth = 700;
        const lineGraphWidth = lineChartWidth - linePadding.left - linePadding.right;
        const lineGraphHeight = lineChartHeight - linePadding.top - linePadding.bottom;

        const values = chartDataWithStart.map(d => d.cumulative);
        const lineMaxVal = Math.max(...values, 0);
        const lineMinVal = Math.min(...values, 0);
        const lineRange = lineMaxVal - lineMinVal || 1;

        const getLineY = (val: number) => {
          if (lineMaxVal === lineMinVal) return linePadding.top + lineGraphHeight / 2;
          return linePadding.top + lineGraphHeight - ((val - lineMinVal) / lineRange) * lineGraphHeight;
        };
        // X좌표: 시작점부터 끝점까지 전체 너비에 균등 분배 (좌우 끝에 맞춤)
        const getLineX = (idx: number) => {
          if (chartDataWithStart.length === 1) return linePadding.left + lineGraphWidth / 2;
          return linePadding.left + (idx / (chartDataWithStart.length - 1)) * lineGraphWidth;
        };
        const zeroLineY = getLineY(0);

        const pathD = chartDataWithStart.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getLineX(i)} ${getLineY(d.cumulative)}`).join(' ');
        const lastValue = chartDataWithStart[chartDataWithStart.length - 1]?.cumulative || 0;
        const lineColor = lastValue >= 0 ? '#10B981' : '#EF4444';

        // Y축 눈금 계산 (5개 정도로 나누기)
        const yTickCount = 5;
        const lineYTicks: number[] = [];
        for (let i = 0; i <= yTickCount; i++) {
          const val = lineMinVal + (lineRange / yTickCount) * i;
          lineYTicks.push(Math.round(val));
        }

        return (
          <div className="card analytics-chart-card">
            <div className="analytics-chart-header">
              <div className="analytics-title-group">
                <Activity className="analytics-section-icon" />
                <h2 className="analytics-section-title">{t('cumulativeProfit') || '일별 누적 수익 추세'}</h2>
              </div>
              <div className="analytics-cumulative-badge" style={{ background: lastValue >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
                <span style={{ color: lineColor, fontWeight: 700, fontSize: '18px' }}>
                  {formatFullCurrency(lastValue)}
                </span>
              </div>
            </div>
            <div className="analytics-svg-container">
              <svg
                width="100%"
                height={lineChartHeight}
                viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Y축 그리드 라인 & 레이블 */}
                {lineYTicks.map((tick, i) => (
                  <g key={i}>
                    <line
                      x1={linePadding.left}
                      y1={getLineY(tick)}
                      x2={lineChartWidth - linePadding.right}
                      y2={getLineY(tick)}
                      stroke={tick === 0 ? '#52525B' : '#27272A'}
                      strokeWidth={tick === 0 ? 1 : 0.5}
                      strokeDasharray={tick === 0 ? '0' : '4'}
                    />
                    <text
                      x={linePadding.left - 10}
                      y={getLineY(tick) + 4}
                      textAnchor="end"
                      fill={tick > 0 ? '#10B981' : tick < 0 ? '#EF4444' : '#71717A'}
                      fontSize="11"
                    >
                      {formatCurrency(tick)}
                    </text>
                  </g>
                ))}

                {/* 영역 채우기 */}
                <path
                  d={`${pathD} L ${getLineX(chartDataWithStart.length - 1)} ${zeroLineY} L ${linePadding.left} ${zeroLineY} Z`}
                  fill={lineColor}
                  opacity="0.1"
                />

                {/* 라인 */}
                <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* 점 */}
                {chartDataWithStart.map((d, i) => (
                  <g key={d.date + i}>
                    <circle cx={getLineX(i)} cy={getLineY(d.cumulative)} r="5" fill={d.cumulative >= 0 ? '#10B981' : '#EF4444'} />
                    <circle cx={getLineX(i)} cy={getLineY(d.cumulative)} r="2.5" fill="#18181B" />
                  </g>
                ))}
                {/* X축 레이블: 첫번째 실제 데이터와 마지막 데이터 */}
                {rawData.length > 0 && (
                  <>
                    <text
                      x={getLineX(1)}
                      y={lineChartHeight - linePadding.bottom + 20}
                      textAnchor="middle"
                      fill="#A1A1AA"
                      fontSize="11"
                    >
                      {rawData[0]?.date}
                    </text>
                    {rawData.length > 1 && (
                      <text
                        x={getLineX(chartDataWithStart.length - 1)}
                        y={lineChartHeight - linePadding.bottom + 20}
                        textAnchor="middle"
                        fill="#A1A1AA"
                        fontSize="11"
                      >
                        {rawData[rawData.length - 1]?.date}
                      </text>
                    )}
                  </>
                )}
              </svg>
            </div>
            {rawData.length < 5 && (
              <p className="analytics-chart-hint">{t('chartHint')}</p>
            )}
          </div>
        );
      })()}

{/* BB/100 Statistics Card */}
      {analytics?.bbStats && analytics.bbStats.sessionsWithData > 0 && (
        <div className="card analytics-bb-card">
          <div className="analytics-chart-header">
            <div className="analytics-title-group">
              <BarChart3 className="analytics-section-icon" />
              <h2 className="analytics-section-title">BB/100 분석</h2>
            </div>
          </div>

          <div className="analytics-bb-grid">
            {/* 신뢰도 배지 */}
            <div className="analytics-bb-item">
              <div className="analytics-bb-label">
                <span>📊 데이터 신뢰도</span>
              </div>
              <div className="analytics-bb-value">
                <span className={`analytics-reliability-badge level-${analytics.bbStats.reliabilityLevel}`}>
                  {analytics.bbStats.reliabilityLevel === 7 && '🏆 매우 높음'}
                  {analytics.bbStats.reliabilityLevel === 6 && '✅✅ 높음'}
                  {analytics.bbStats.reliabilityLevel === 5 && '✅ 보통 (상)'}
                  {analytics.bbStats.reliabilityLevel === 4 && '📈 보통'}
                  {analytics.bbStats.reliabilityLevel === 3 && '📊 보통 (하)'}
                  {analytics.bbStats.reliabilityLevel === 2 && '🔶 낮음'}
                  {analytics.bbStats.reliabilityLevel === 1 && '⚠️ 매우 낮음'}
                </span>
              </div>
              <div className="analytics-bb-subtext">
                {(analytics.totals.hands || 0).toLocaleString()}핸드 / 다음 레벨까지 {
                  analytics.bbStats.reliabilityLevel === 1 ? `${(10000 - (analytics.totals.hands || 0)).toLocaleString()}핸드` :
                  analytics.bbStats.reliabilityLevel === 2 ? `${(30000 - (analytics.totals.hands || 0)).toLocaleString()}핸드` :
                  analytics.bbStats.reliabilityLevel === 3 ? `${(60000 - (analytics.totals.hands || 0)).toLocaleString()}핸드` :
                  analytics.bbStats.reliabilityLevel === 4 ? `${(100000 - (analytics.totals.hands || 0)).toLocaleString()}핸드` :
                  analytics.bbStats.reliabilityLevel === 5 ? `${(200000 - (analytics.totals.hands || 0)).toLocaleString()}핸드` :
                  analytics.bbStats.reliabilityLevel === 6 ? `${(300000 - (analytics.totals.hands || 0)).toLocaleString()}핸드` :
                  '최고 레벨 달성!'
                }
              </div>
            </div>

            {/* 평균 BB/100 */}
            <div className="analytics-bb-item">
              <div className="analytics-bb-label">
                <span>📈 평균 BB/100</span>
              </div>
              <div className="analytics-bb-value">
                <span style={{ color: analytics.bbStats.avgBbPer100 >= 0 ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: '24px' }}>
                  {analytics.bbStats.avgBbPer100 >= 0 ? '+' : ''}{analytics.bbStats.avgBbPer100.toFixed(2)}
                </span>
              </div>
              <div className="analytics-bb-subtext">
                {analytics.bbStats.avgBbPer100 >= 5 ? '🔥 매우 좋음 (상위 10%)' :
                 analytics.bbStats.avgBbPer100 >= 2 ? '👍 좋음 (수익 플레이어)' :
                 analytics.bbStats.avgBbPer100 >= 0 ? '😐 손익분기점' :
                 analytics.bbStats.avgBbPer100 >= -3 ? '⚠️ 소폭 손실' :
                 '❌ 개선 필요'}
              </div>
            </div>

            {/* 표준편차 */}
            <div className="analytics-bb-item">
              <div className="analytics-bb-label">
                <span>📉 변동성 (σ)</span>
              </div>
              <div className="analytics-bb-value">
                <span style={{ color: analytics.bbStats.volatilityLevel === 'stable' ? '#10B981' : analytics.bbStats.volatilityLevel === 'normal' ? '#F59E0B' : '#EF4444', fontWeight: 700, fontSize: '24px' }}>
                  {analytics.bbStats.stdDev.toFixed(1)}
                </span>
              </div>
              <div className="analytics-bb-subtext">
                {analytics.bbStats.volatilityLevel === 'stable' && '✅ 안정적 (σ < 15)'}
                {analytics.bbStats.volatilityLevel === 'normal' && '📊 보통 (15 ≤ σ < 25)'}
                {analytics.bbStats.volatilityLevel === 'high' && '⚠️ 변동성 큼 (σ ≥ 25)'}
              </div>
            </div>

            {/* 플레이 스타일 */}
            <div className="analytics-bb-item">
              <div className="analytics-bb-label">
                <span>🎯 플레이 스타일</span>
              </div>
              <div className="analytics-bb-value">
                <span style={{ fontSize: '18px', fontWeight: 600 }}>
                  {analytics.bbStats.playStyle === 'stable' && '✅ 안정적인 플레이'}
                  {analytics.bbStats.playStyle === 'highVariance' && '📈 분산 큰 플레이'}
                  {analytics.bbStats.playStyle === 'bigLoss' && '⚠️ 큰 손실 주의'}
                </span>
              </div>
              <div className="analytics-bb-subtext">
                {analytics.bbStats.playStyle === 'stable' && '꾸준한 수익 구조'}
                {analytics.bbStats.playStyle === 'highVariance' && '대박 세션으로 평균 상승 - 안정성 개선 필요'}
                {analytics.bbStats.playStyle === 'bigLoss' && '특정 세션 손실 큼 - 손절/뱅크롤 관리 점검'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period Analysis - Best & Worst Day */}
      {dailyData.length > 0 && (bestDay || worstDay) && (
        <div className="analytics-period-cards">
          <div className={`analytics-period-card success ${(!bestDay || bestDay.profit <= 0) ? 'empty-state' : ''}`}>
            <div className="analytics-period-card-icon">
              <Trophy style={{ width: '24px', height: '24px', color: bestDay && bestDay.profit > 0 ? '#10B981' : '#52525B' }} />
            </div>
            <div className="analytics-period-card-content">
              <p className="analytics-period-card-label">{t('periodAnalysis.bestDay')}</p>
              {bestDay && bestDay.profit > 0 ? (
                <>
                  <p className="analytics-period-card-date">{bestDay.date.slice(5).replace('-', '/')}</p>
                  <p className="analytics-period-card-value" style={{ color: '#10B981' }}>{formatFullCurrency(bestDay.profit)}</p>
                </>
              ) : (
                <p className="analytics-period-card-empty">{locale === 'ko' ? '아직 수익 기록 없음' : locale === 'ja' ? 'まだ収益記録なし' : 'No profit recorded yet'}</p>
              )}
            </div>
          </div>
          <div className={`analytics-period-card warning ${(!worstDay || worstDay.profit >= 0) ? 'empty-state' : ''}`}>
            <div className="analytics-period-card-icon">
              <TrendingDown style={{ width: '24px', height: '24px', color: worstDay && worstDay.profit < 0 ? '#EF4444' : '#52525B' }} />
            </div>
            <div className="analytics-period-card-content">
              <p className="analytics-period-card-label">{t('periodAnalysis.worstDay')}</p>
              {worstDay && worstDay.profit < 0 ? (
                <>
                  <p className="analytics-period-card-date">{worstDay.date.slice(5).replace('-', '/')}</p>
                  <p className="analytics-period-card-value" style={{ color: '#EF4444' }}>{formatFullCurrency(worstDay.profit)}</p>
                </>
              ) : (
                <p className="analytics-period-card-empty">{locale === 'ko' ? '아직 손실 기록 없음' : locale === 'ja' ? 'まだ損失記録なし' : 'No loss recorded yet'}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Average Session Stats & Streaks - Equal Height */}
      <div className="analytics-dual-grid">
        {/* Average Session Stats */}
        <div className="card analytics-dual-card">
          <div className="analytics-title-group analytics-section-header">
            <BarChart3 className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('avgSessionStats') || '평균 세션 데이터'}</h2>
          </div>
          <div className="analytics-metric-list">
            <div className="analytics-metric-item">
              <span className="analytics-metric-label">{t('avgProfit') || '평균 수익'}</span>
              <span className="analytics-metric-value" style={{ color: avgSessionProfit >= 0 ? '#10B981' : '#EF4444' }}>
                {formatFullCurrency(Math.round(avgSessionProfit))}
              </span>
            </div>
            <div className="analytics-metric-item">
              <span className="analytics-metric-label">{t('avgDuration') || '평균 시간'}</span>
              <span className="analytics-metric-value">{Math.round(avgSessionDuration)}{tUnits('minutes') || '분'}</span>
            </div>
            <div className="analytics-metric-item">
              <span className="analytics-metric-label">{t('profitPerHour') || '시간당 수익'}</span>
              <span className="analytics-metric-value" style={{ color: totals.hours > 0 ? (totals.profit / totals.hours >= 0 ? '#10B981' : '#EF4444') : '#71717A' }}>
                {totals.hours > 0 ? formatFullCurrency(Math.round(totals.profit / totals.hours)) : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="card analytics-dual-card">
          <div className="analytics-title-group analytics-section-header">
            <Flame className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('streaks') || '연승/연패 기록'}</h2>
          </div>
          <div className="analytics-metric-list">
            <div className="analytics-metric-item">
              <div className="analytics-metric-with-icon">
                <Trophy style={{ width: '16px', height: '16px', color: '#10B981' }} />
                <span className="analytics-metric-label">{t('maxWinStreak') || '최장 연승'}</span>
              </div>
              <span className="analytics-metric-value" style={{ color: '#10B981' }}>{streaks.winStreak}{t('days') || '일'}</span>
            </div>
            <div className="analytics-metric-item">
              <div className="analytics-metric-with-icon">
                <TrendingDown style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                <span className="analytics-metric-label">{t('maxLossStreak') || '최장 연패'}</span>
              </div>
              <span className="analytics-metric-value" style={{ color: '#EF4444' }}>{streaks.lossStreak}{t('days') || '일'}</span>
            </div>
            {streaks.currentStreak > 0 && (
              <div className="analytics-metric-item">
                <div className="analytics-metric-with-icon">
                  <Activity style={{ width: '16px', height: '16px', color: streaks.currentType === 'win' ? '#10B981' : '#EF4444' }} />
                  <span className="analytics-metric-label">{t('currentStreak') || '현재 연속'}</span>
                </div>
                <span className="analytics-metric-value" style={{ color: streaks.currentType === 'win' ? '#10B981' : '#EF4444' }}>
                  {streaks.currentStreak}{t('days') || '일'} {streaks.currentType === 'win' ? '연승' : '연패'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament ROI */}
      {tournamentStats && tournamentStats.sessions > 0 && (
        <div className="card analytics-roi-card">
          <div className="analytics-title-group analytics-section-header">
            <Percent className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('tournamentROI') || '토너먼트 ROI'}</h2>
          </div>
          <div className="analytics-roi-content">
            <div className="analytics-roi-main">
              <p className="analytics-roi-value" style={{ color: (tournamentROI || 0) >= 0 ? '#10B981' : '#EF4444' }}>
                {(tournamentROI || 0) >= 0 ? '+' : ''}{(tournamentROI || 0).toFixed(1)}%
              </p>
              <p className="analytics-roi-label">ROI (Return on Investment)</p>
            </div>
            <div className="analytics-roi-details">
              <div className="analytics-roi-detail-item">
                <span className="analytics-roi-detail-label">{t('tournamentSessions') || '토너먼트 참가'}</span>
                <span className="analytics-roi-detail-value">{tournamentStats.sessions}{t('times') || '회'}</span>
              </div>
              <div className="analytics-roi-detail-item">
                <span className="analytics-roi-detail-label">{t('tournamentProfit') || '총 수익'}</span>
                <span className="analytics-roi-detail-value" style={{ color: tournamentStats.profit >= 0 ? '#10B981' : '#EF4444' }}>
                  {formatFullCurrency(tournamentStats.profit)}
                </span>
              </div>
              <div className="analytics-roi-detail-item">
                <span className="analytics-roi-detail-label">{t('tournamentWinRate') || '승률'}</span>
                <span className="analytics-roi-detail-value">{tournamentStats.winRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="card analytics-insights">
          <div className="analytics-title-group analytics-section-header">
            <AlertTriangle className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('insights.title')}</h2>
          </div>
          <div className="analytics-insights-list">
            {insights.map((insight, idx) => (
              <div key={idx} className={`analytics-insight-item ${insight.type}`}>
                <span className="analytics-insight-icon">{insight.type === 'warning' ? '⚠️' : insight.type === 'success' ? '✅' : 'ℹ️'}</span>
                <span className="analytics-insight-text">{insight.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Type & Stakes Stats with Progress Bars */}
      <div className="analytics-dual-grid">
        {/* By Game Type */}
        <div className="card analytics-dual-card">
          <div className="analytics-title-group analytics-section-header">
            <Target className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('byGameType')}</h2>
          </div>

          {gameTypeStats.length === 0 ? (
            <p className="analytics-empty-text analytics-empty-centered">{tCommon('noData')}</p>
          ) : (
            <div className="analytics-stat-list">
              {gameTypeStats.map((stat) => {
                const percent = maxGameTypeProfit > 0 ? (Math.abs(stat.profit) / maxGameTypeProfit) * 100 : 0;
                return (
                  <div key={stat.type} className="analytics-stat-item-card">
                    <div className="analytics-stat-row">
                      <span className="analytics-stat-name">{stat.type}</span>
                      <span className="analytics-stat-profit" style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444' }}>
                        {formatFullCurrency(stat.profit)}
                      </span>
                    </div>
                    <div className="analytics-stat-bar-bg">
                      <div
                        className="analytics-stat-bar-fill"
                        style={{
                          width: `${percent}%`,
                          background: stat.profit >= 0 ? '#10B981' : '#EF4444'
                        }}
                      />
                    </div>
                    <div className="analytics-stat-meta">
                      <span>{t('sessionsCount', { count: stat.sessions })}</span>
                      <span>{t('winRate', { rate: stat.winRate })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* By Stakes */}
        <div className="card analytics-dual-card">
          <div className="analytics-title-group analytics-section-header">
            <Zap className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('byStakes')}</h2>
          </div>

          {stakesStats.length === 0 ? (
            <p className="analytics-empty-text analytics-empty-centered">{tCommon('noData')}</p>
          ) : (
            <div className="analytics-stat-list">
              {stakesStats.map((stat) => {
                const percent = maxStakesProfit > 0 ? (Math.abs(stat.profit) / maxStakesProfit) * 100 : 0;
                return (
                  <div key={stat.stakes} className="analytics-stat-item-card">
                    <div className="analytics-stat-row">
                      <span className="analytics-stat-name">{stat.stakes}</span>
                      <span className="analytics-stat-profit" style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444' }}>
                        {formatFullCurrency(stat.profit)}
                      </span>
                    </div>
                    <div className="analytics-stat-bar-bg">
                      <div
                        className="analytics-stat-bar-fill"
                        style={{
                          width: `${percent}%`,
                          background: stat.profit >= 0 ? '#10B981' : '#EF4444'
                        }}
                      />
                    </div>
                    <div className="analytics-stat-meta">
                      <span>{t('sessionsCount', { count: stat.sessions })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Venue Performance with Progress Bars */}
      <div className="card">
        <div className="analytics-title-group analytics-section-header">
          <Award className="analytics-section-icon" />
          <h2 className="analytics-section-title">{t('byVenue')}</h2>
        </div>

        {venueStats.length === 0 ? (
          <p className="analytics-empty-text analytics-empty-centered">{tCommon('noData')}</p>
        ) : (
          <div className="analytics-venue-list">
            {venueStats.map((stat) => {
              const percent = maxVenueProfit > 0 ? (Math.abs(stat.profit) / maxVenueProfit) * 100 : 0;
              return (
                <div key={stat.venue} className="analytics-venue-item">
                  <div className="analytics-venue-row">
                    <span className="analytics-venue-name">{stat.venue}</span>
                    <span className="analytics-venue-profit" style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444' }}>
                      {formatFullCurrency(stat.profit)}
                    </span>
                  </div>
                  <div className="analytics-stat-bar-bg">
                    <div
                      className="analytics-stat-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: stat.profit >= 0 ? '#10B981' : '#EF4444'
                      }}
                    />
                  </div>
                  <div className="analytics-venue-meta">
                    <span>{t('sessionsCount', { count: stat.sessions })}</span>
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
