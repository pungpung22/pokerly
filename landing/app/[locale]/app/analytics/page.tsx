'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Target, Zap, Award, Loader2, Calendar, ChevronDown } from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';

type PeriodType = 'today' | 'week' | 'month' | 'last30' | 'all' | 'custom';

interface AnalyticsData {
  byGameType: { type: string; profit: number; sessions: number; winRate: number }[];
  byStakes: { stakes: string; profit: number; sessions: number; bbPer100: number }[];
  byVenue: { venue: string; profit: number; sessions: number }[];
  dailyTrend: { date: string; profit: number; sessions: number }[];
  monthlyTrend: { month: string; profit: number; sessions: number }[];
  totals: { sessions: number; profit: number; hours: number };
}

const periodKeys: PeriodType[] = ['today', 'week', 'month', 'last30', 'all', 'custom'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const t = useTranslations('Analytics');
  const tCommon = useTranslations('Common');
  const tUnits = useTranslations('Units');
  const locale = useLocale();
  const [period, setPeriod] = useState<PeriodType>('all');

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
    // For en/ja, use M for millions, K for thousands
    if (absValue >= 1000000) {
      return `${(safeValue / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 1000) {
      return `${(safeValue / 1000).toFixed(0)}K`;
    }
    return safeValue.toLocaleString();
  };

  const formatFullCurrency = (value: number | undefined | null): string => {
    const safeValue = value ?? 0;
    const currencySymbol = locale === 'en' ? '$' : locale === 'ja' ? '¥' : '';
    const currencySuffix = locale === 'ko' ? tUnits('won') : '';
    if (locale === 'en' || locale === 'ja') {
      return `${safeValue >= 0 ? '+' : ''}${currencySymbol}${Math.abs(safeValue).toLocaleString()}`;
    }
    return `${safeValue >= 0 ? '+' : ''}${safeValue.toLocaleString()}${currencySuffix}`;
  };
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
        setError(err instanceof Error ? err.message : t('loadError'));
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
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
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

      {/* Period Filter */}
      <div className="analytics-filter-section">
        <div className="analytics-period-filters">
          {periodKeys.map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`filter-btn ${period === p ? 'active' : ''}`}
            >
              {p === 'custom' && <Calendar style={{ width: '14px', height: '14px' }} />}
              {t(`periods.${p}`)}
            </button>
          ))}
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
      </div>

      {/* Summary Cards */}
      <div className="stats-grid analytics-stats-section">
        <div className="stats-card">
          <p className="stats-card-label">{t('stats.totalProfit')}</p>
          <p className="stats-card-value" style={{ color: totals.profit >= 0 ? '#10B981' : '#EF4444' }}>
            {formatFullCurrency(totals.profit)}
          </p>
        </div>
        <div className="stats-card">
          <p className="stats-card-label">{t('stats.sessions')}</p>
          <p className="stats-card-value">{t('stats.sessionsCount', { count: totals.sessions })}</p>
        </div>
        <div className="stats-card">
          <p className="stats-card-label">{t('stats.playTime')}</p>
          <p className="stats-card-value">{totals.hours}{tUnits('hours')}</p>
        </div>
        <div className="stats-card">
          <p className="stats-card-label">{t('stats.hourlyRate')}</p>
          <p className="stats-card-value" style={{ color: totals.hours > 0 ? (totals.profit / totals.hours >= 0 ? '#10B981' : '#EF4444') : '#A1A1AA' }}>
            {totals.hours > 0 ? formatFullCurrency(Math.round(totals.profit / totals.hours)) : '-'}
          </p>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="card analytics-chart-card">
        <div className="analytics-chart-header">
          <div className="analytics-title-group">
            <TrendingUp className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('profitTrend')}</h2>
          </div>
          <div className="analytics-chart-type-buttons">
            <button
              onClick={() => setChartType('daily')}
              className={`filter-btn ${chartType === 'daily' ? 'active' : ''}`}
            >
              {t('daily')}
            </button>
            <button
              onClick={() => setChartType('monthly')}
              className={`filter-btn ${chartType === 'monthly' ? 'active' : ''}`}
            >
              {t('monthly')}
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="analytics-chart-empty">
            <p className="analytics-empty-text">{t('noData')}</p>
          </div>
        ) : (
          <div className="analytics-chart-container">
            {chartData.slice(-15).map((data) => {
              const height = maxProfit > 0 ? (Math.abs(data.profit) / maxProfit) * 100 : 0;
              const isPositive = data.profit >= 0;
              const label = chartType === 'daily'
                ? (data as { date: string }).date.slice(5).replace('-', '/')
                : locale === 'ko'
                  ? (data as { month: string }).month.slice(5) + '월'
                  : (data as { month: string }).month.slice(5);
              return (
                <div key={chartType === 'daily' ? (data as { date: string }).date : (data as { month: string }).month} className="analytics-chart-bar-wrapper">
                  <div className="analytics-chart-bar-area">
                    <p className="analytics-chart-bar-value" style={{ color: isPositive ? '#10B981' : '#EF4444' }}>
                      {isPositive ? '+' : ''}{formatCurrency(data.profit)}
                    </p>
                    <div
                      className="analytics-chart-bar"
                      style={{
                        height: `${Math.max(height, 4)}%`,
                        background: isPositive
                          ? 'linear-gradient(to top, #10B981, #34D399)'
                          : 'linear-gradient(to bottom, #EF4444, #F87171)',
                        borderRadius: isPositive ? '4px 4px 0 0' : '0 0 4px 4px',
                      }}
                    />
                  </div>
                  <p className="analytics-chart-bar-label">{label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Game Type & Stakes Stats */}
      <div className="content-grid analytics-stats-grid">
        {/* By Game Type */}
        <div className="card">
          <div className="analytics-title-group analytics-section-header">
            <Target className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('byGameType')}</h2>
          </div>

          {gameTypeStats.length === 0 ? (
            <p className="analytics-empty-text analytics-empty-centered">{tCommon('noData')}</p>
          ) : (
            <div className="analytics-stat-list">
              {gameTypeStats.map((stat) => (
                <div key={stat.type} className="analytics-stat-item-card">
                  <div className="analytics-stat-row">
                    <span className="analytics-stat-name">{stat.type}</span>
                    <span className="analytics-stat-profit" style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444' }}>
                      {formatFullCurrency(stat.profit)}
                    </span>
                  </div>
                  <div className="analytics-stat-meta">
                    <span>{t('sessionsCount', { count: stat.sessions })}</span>
                    <span>{t('winRate', { rate: stat.winRate })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Stakes */}
        <div className="card">
          <div className="analytics-title-group analytics-section-header">
            <Zap className="analytics-section-icon" />
            <h2 className="analytics-section-title">{t('byStakes')}</h2>
          </div>

          {stakesStats.length === 0 ? (
            <p className="analytics-empty-text analytics-empty-centered">{tCommon('noData')}</p>
          ) : (
            <div className="analytics-stat-list">
              {stakesStats.map((stat) => (
                <div key={stat.stakes} className="analytics-stat-item-card">
                  <div className="analytics-stat-row">
                    <span className="analytics-stat-name">{stat.stakes}</span>
                    <span className="analytics-stat-profit" style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444' }}>
                      {formatFullCurrency(stat.profit)}
                    </span>
                  </div>
                  <div className="analytics-stat-meta">
                    <span>{t('sessionsCount', { count: stat.sessions })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Venue Performance */}
      <div className="card">
        <div className="analytics-title-group analytics-section-header">
          <Award className="analytics-section-icon" />
          <h2 className="analytics-section-title">{t('byVenue')}</h2>
        </div>

        {venueStats.length === 0 ? (
          <p className="analytics-empty-text analytics-empty-centered">{tCommon('noData')}</p>
        ) : (
          <div className="analytics-venue-grid">
            {venueStats.map((stat) => (
              <div key={stat.venue} className="analytics-venue-card">
                <p className="analytics-venue-name">
                  {stat.venue}
                </p>
                <p className="analytics-venue-profit" style={{ color: stat.profit >= 0 ? '#10B981' : '#EF4444' }}>
                  {formatFullCurrency(stat.profit)}
                </p>
                <p className="analytics-venue-sessions">{t('sessionsCount', { count: stat.sessions })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
