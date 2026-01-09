'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  Zap,
  Trophy,
  Calendar,
  Upload,
  FileText,
  BarChart3,
  Loader2,
  CheckCircle,
  Circle,
  Sparkles,
} from 'lucide-react';
import { userApi } from '@/lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { LevelInfo } from '@/lib/types';
import { levelNames } from '@/lib/types';

const levelColors: Record<number, string> = {
  1: '#71717A',
  2: '#22C55E',
  3: '#3B82F6',
  4: '#8B5CF6',
  5: '#F59E0B',
  6: '#EF4444',
  7: '#EC4899',
  8: '#6366F1',
};

const xpTypeLabels = {
  dailyLogin: '일일 로그인',
  uploadScreenshot: 'OCR 스크린샷 업로드',
  manualRecord: '수동 세션 기록',
  viewAnalytics: '분석 화면 조회',
};

const xpTypeIcons = {
  dailyLogin: Calendar,
  uploadScreenshot: Upload,
  manualRecord: FileText,
  viewAnalytics: BarChart3,
};

export default function LevelPage() {
  const { user } = useAuth();
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    fetchLevelInfo();
  }, [user]);

  async function fetchLevelInfo() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getLevelInfo();
      setLevelInfo(data);
    } catch (err) {
      console.error('Failed to fetch level info:', err);
      setError('레벨 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimXp(type: 'dailyLogin' | 'viewAnalytics') {
    setClaiming(type);
    try {
      const result = await userApi.addXp(type);
      if (result.xpAwarded > 0) {
        alert(`+${result.xpAwarded} XP 획득!${result.leveledUp ? ' 레벨 업!' : ''}`);
        fetchLevelInfo();
      } else if (result.message) {
        alert(result.message);
      }
    } catch (err) {
      console.error('Failed to claim XP:', err);
      alert('XP 획득에 실패했습니다.');
    } finally {
      setClaiming(null);
    }
  }

  if (loading) {
    return (
      <div className="level-loading-container">
        <Loader2 style={{ width: '32px', height: '32px', color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !levelInfo) {
    return (
      <div className="level-error-container">
        <p className="level-error-text">{error || '레벨 정보를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  const levelColor = levelColors[levelInfo.level] || levelColors[8];

  return (
    <div className="app-page">
      {/* Header */}
      <div className="level-header-margin">
        <h1 className="page-title">레벨 & XP</h1>
        <p className="page-subtitle">활동을 통해 XP를 획득하고 레벨을 올려보세요</p>
      </div>

      {/* 2 Column Grid for Level Card and Today's XP */}
      <div className="level-grid">
        {/* Level Card */}
        <div
          className="card level-main-card"
          style={{
            background: `linear-gradient(135deg, ${levelColor}20 0%, ${levelColor}05 100%)`,
            border: `1px solid ${levelColor}40`,
          }}
        >
          <div className="level-info-header">
            <div
              className="level-badge"
              style={{
                background: `linear-gradient(135deg, ${levelColor} 0%, ${levelColor}80 100%)`,
                boxShadow: `0 0 30px ${levelColor}40`,
              }}
            >
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {levelInfo.level}
              </span>
            </div>
            <div>
              <p className="level-current-level-label">현재 레벨</p>
              <h2 className="level-name">
                {levelInfo.levelName}
              </h2>
              <p className="level-total-xp" style={{ color: levelColor }}>
                총 {levelInfo.totalXp.toLocaleString()} XP 획득
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="level-progress-container">
            <div className="level-progress-header">
              <span className="level-progress-label">
                다음 레벨까지
              </span>
              <span className="level-progress-value">
                {levelInfo.currentXp} / {levelInfo.requiredXp} XP
              </span>
            </div>
            <div className="level-progress-bar">
              <div
                className="level-progress-fill"
                style={{
                  width: `${levelInfo.progress}%`,
                  background: `linear-gradient(90deg, ${levelColor} 0%, ${levelColor}80 100%)`,
                }}
              />
            </div>
          </div>

          {levelInfo.level < 8 && (
            <p className="level-next-level">
              다음 레벨: <span style={{ color: levelColors[levelInfo.level + 1] || '#6366F1' }}>{levelNames[levelInfo.level + 1]}</span>
            </p>
          )}
        </div>

        {/* Today's XP */}
        <div className="card">
        <div className="level-today-xp-header">
          <div className="level-today-xp-icon-wrapper">
            <Zap style={{ width: '20px', height: '20px', color: '#FBBF24' }} />
          </div>
          <div>
            <p className="level-today-xp-text">오늘 획득한 XP</p>
            <p className="level-today-xp-value">+{levelInfo.todayXp} XP</p>
          </div>
        </div>

        {/* Claimable XP */}
        <div className="level-claimable-container">
          {/* Daily Login */}
          <div className={`level-claim-item ${levelInfo.canEarnLoginXp ? 'available' : 'completed'}`}>
            <div className="level-claim-left">
              {levelInfo.canEarnLoginXp ? (
                <Circle style={{ width: '20px', height: '20px', color: '#6366F1' }} />
              ) : (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
              )}
              <div>
                <p className="level-claim-label">일일 로그인</p>
                <p className="level-claim-xp">+{levelInfo.xpRules.dailyLogin} XP</p>
              </div>
            </div>
            {levelInfo.canEarnLoginXp ? (
              <button
                onClick={() => handleClaimXp('dailyLogin')}
                disabled={claiming === 'dailyLogin'}
                className="level-claim-btn"
              >
                {claiming === 'dailyLogin' ? (
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                )}
                받기
              </button>
            ) : (
              <span className="level-claim-completed">완료</span>
            )}
          </div>

          {/* Analytics View */}
          <div className={`level-claim-item ${levelInfo.canEarnAnalyticsXp ? 'available' : 'completed'}`}>
            <div className="level-claim-left">
              {levelInfo.canEarnAnalyticsXp ? (
                <Circle style={{ width: '20px', height: '20px', color: '#6366F1' }} />
              ) : (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
              )}
              <div>
                <p className="level-claim-label">분석 화면 조회</p>
                <p className="level-claim-xp">+{levelInfo.xpRules.viewAnalytics} XP (일 1회)</p>
              </div>
            </div>
            {levelInfo.canEarnAnalyticsXp ? (
              <button
                onClick={() => handleClaimXp('viewAnalytics')}
                disabled={claiming === 'viewAnalytics'}
                className="level-claim-btn"
              >
                {claiming === 'viewAnalytics' ? (
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                )}
                받기
              </button>
            ) : (
              <span className="level-claim-completed">완료</span>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* XP Guide and Level Roadmap Grid */}
      <div className="level-bottom-grid">
        {/* XP Guide */}
        <div className="card">
        <h3 className="level-xp-guide-header">
          <Star style={{ width: '18px', height: '18px', color: '#6366F1' }} />
          XP 획득 방법
        </h3>

        <div className="level-xp-guide-list">
          {Object.entries(xpTypeLabels).map(([key, label]) => {
            const Icon = xpTypeIcons[key as keyof typeof xpTypeIcons];
            const xp = levelInfo.xpRules[key as keyof typeof levelInfo.xpRules];
            const isManual = key === 'manualRecord';

            return (
              <div key={key} className="level-xp-guide-item">
                <div className="level-xp-guide-left">
                  <Icon style={{ width: '18px', height: '18px', color: '#71717A' }} />
                  <span className="level-xp-guide-label">{label}</span>
                </div>
                <div className="level-xp-guide-right">
                  <span className="level-xp-guide-value">+{xp} XP</span>
                  {isManual && (
                    <p className="level-xp-guide-limit">
                      일 최대 {levelInfo.xpRules.manualRecordDailyLimit} XP
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Record Progress */}
        <div className="level-manual-progress">
          <div className="level-manual-progress-header">
            <span className="level-manual-progress-label">오늘 수동 기록 XP</span>
            <span className="level-manual-progress-value">
              {levelInfo.todayManualXp} / {levelInfo.xpRules.manualRecordDailyLimit}
            </span>
          </div>
          <div className="level-manual-progress-bar">
            <div
              className="level-manual-progress-fill"
              style={{
                width: `${(levelInfo.todayManualXp / levelInfo.xpRules.manualRecordDailyLimit) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

        {/* Level Roadmap */}
        <div className="card">
          <h3 className="level-roadmap-header">
            <Trophy style={{ width: '18px', height: '18px', color: '#6366F1' }} />
            레벨 로드맵
          </h3>

          <div className="level-roadmap">
            {Object.entries(levelNames).map(([lvl, name]) => {
              const level = parseInt(lvl);
              const isCurrentLevel = level === levelInfo.level;
              const isCompleted = level < levelInfo.level;
              const color = levelColors[level];

              return (
                <div
                  key={level}
                  className="level-roadmap-item"
                  style={{
                    background: isCurrentLevel ? `${color}15` : 'transparent',
                    border: isCurrentLevel ? `1px solid ${color}40` : '1px solid transparent',
                  }}
                >
                  <div
                    className="level-roadmap-badge"
                    style={{
                      background: isCompleted || isCurrentLevel ? color : '#27272A',
                      color: isCompleted || isCurrentLevel ? 'white' : '#71717A',
                    }}
                  >
                    {isCompleted ? <CheckCircle style={{ width: '18px', height: '18px' }} /> : level}
                  </div>
                  <div className="level-roadmap-name" style={{ color: isCurrentLevel ? 'white' : isCompleted ? '#A1A1AA' : '#71717A', fontWeight: isCurrentLevel ? 600 : 400 }}>
                    {name}
                  </div>
                  {isCurrentLevel && (
                    <span className="level-roadmap-current" style={{ color: color }}>현재</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
