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
import { useAuth } from '../../../contexts/AuthContext';
import type { LevelInfo } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { LevelUpModal } from '@/components/ui';

const levelColors: Record<number, string> = {
  1: '#D4D4D8',
  2: '#22C55E',
  3: '#3B82F6',
  4: '#FF4EA3',
  5: '#D91C6B',
  6: '#EF4444',
  7: '#EC4899',
  8: '#F72585',
};

const xpTypeKeys = ['dailyLogin', 'uploadScreenshot', 'manualRecord', 'viewAnalytics'] as const;

const xpTypeIcons = {
  dailyLogin: Calendar,
  uploadScreenshot: Upload,
  manualRecord: FileText,
  viewAnalytics: BarChart3,
};

export default function LevelPage() {
  const { user } = useAuth();
  const t = useTranslations('Level');
  const tTypes = useTranslations('Types');
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevelData, setNewLevelData] = useState<{ level: number; name: string } | null>(null);

  // Map xp type keys to translation keys
  const xpTypeTranslationKeys: Record<string, string> = {
    dailyLogin: 'dailyLogin',
    uploadScreenshot: 'screenshot',
    manualRecord: 'manualRecord',
    viewAnalytics: 'analyticsView',
  };

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
      setError(t('loadError'));
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimXp(type: 'dailyLogin' | 'viewAnalytics') {
    setClaiming(type);
    try {
      const result = await userApi.addXp(type);
      if (result.xpAwarded > 0) {
        // Check if user leveled up
        if (result.leveledUp && result.user) {
          const newLevel = result.user.level;
          setNewLevelData({
            level: newLevel,
            name: tTypes(`levelNames.${newLevel}`),
          });
          setShowLevelUpModal(true);
        } else {
          // Just show XP gained notification
          alert(`+${result.xpAwarded} XP!`);
        }
        fetchLevelInfo();
      } else if (result.message) {
        alert(result.message);
      }
    } catch (err) {
      console.error('Failed to claim XP:', err);
    } finally {
      setClaiming(null);
    }
  }

  if (loading) {
    return (
      <div className="level-loading-container">
        <Loader2 style={{ width: '32px', height: '32px', color: '#F72585', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !levelInfo) {
    return (
      <div className="level-error-container">
        <p className="level-error-text">{error || t('loadError')}</p>
      </div>
    );
  }

  const levelColor = levelColors[levelInfo.level] || levelColors[8];

  return (
    <div className="app-page">
      {/* Header */}
      <div className="level-header-margin">
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">{t('subtitle')}</p>
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
              <p className="level-current-level-label">{t('currentLevel')}</p>
              <h2 className="level-name">
                {tTypes(`levelNames.${levelInfo.level}`)}
              </h2>
              <p className="level-total-xp" style={{ color: levelColor }}>
                {t('totalXp', { xp: levelInfo.totalXp.toLocaleString() })}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="level-progress-container">
            <div className="level-progress-header">
              <span className="level-progress-label">
                {t('nextLevel')}
              </span>
              <span className="level-progress-value">
                {t('progress', { current: levelInfo.currentXp, required: levelInfo.requiredXp })}
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
              {t('nextLevelPreview', { name: '' })}<span style={{ color: levelColors[levelInfo.level + 1] || '#F72585' }}>{tTypes(`levelNames.${levelInfo.level + 1}`)}</span>
            </p>
          )}
        </div>

        {/* Today's XP */}
        <div className="card">
        <div className="level-today-xp-header">
          <div className="level-today-xp-icon-wrapper">
            <Zap style={{ width: '20px', height: '20px', color: '#F72585' }} />
          </div>
          <div>
            <p className="level-today-xp-text">{t('todayXp.title')}</p>
            <p className="level-today-xp-value">{t('todayXp.value', { xp: levelInfo.todayXp })}</p>
          </div>
        </div>

        {/* Claimable XP */}
        <div className="level-claimable-container">
          {/* Daily Login */}
          <div className={`level-claim-item ${levelInfo.canEarnLoginXp ? 'available' : 'completed'}`}>
            <div className="level-claim-left">
              {levelInfo.canEarnLoginXp ? (
                <Circle style={{ width: '20px', height: '20px', color: '#F72585' }} />
              ) : (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#00D4AA' }} />
              )}
              <div>
                <p className="level-claim-label">{t('claimable.dailyLogin')}</p>
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
                {t('claimable.claim')}
              </button>
            ) : (
              <span className="level-claim-completed">{t('claimable.completed')}</span>
            )}
          </div>

          {/* Analytics View */}
          <div className={`level-claim-item ${levelInfo.canEarnAnalyticsXp ? 'available' : 'completed'}`}>
            <div className="level-claim-left">
              {levelInfo.canEarnAnalyticsXp ? (
                <Circle style={{ width: '20px', height: '20px', color: '#F72585' }} />
              ) : (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#00D4AA' }} />
              )}
              <div>
                <p className="level-claim-label">{t('claimable.analyticsView')}</p>
                <p className="level-claim-xp">{t('claimable.oncePerDay', { xp: levelInfo.xpRules.viewAnalytics })}</p>
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
                {t('claimable.claim')}
              </button>
            ) : (
              <span className="level-claim-completed">{t('claimable.completed')}</span>
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
          <Star style={{ width: '18px', height: '18px', color: '#F72585' }} />
          {t('xpGuide.title')}
        </h3>

        <div className="level-xp-guide-list">
          {xpTypeKeys.map((key) => {
            const Icon = xpTypeIcons[key];
            const xp = levelInfo.xpRules[key as keyof typeof levelInfo.xpRules];
            const isManual = key === 'manualRecord';
            const translationKey = xpTypeTranslationKeys[key];

            return (
              <div key={key} className="level-xp-guide-item">
                <div className="level-xp-guide-left">
                  <Icon style={{ width: '18px', height: '18px', color: '#D4D4D8' }} />
                  <span className="level-xp-guide-label">{t(`xpGuide.${translationKey}`)}</span>
                </div>
                <div className="level-xp-guide-right">
                  <span className="level-xp-guide-value">+{xp} XP</span>
                  {isManual && (
                    <p className="level-xp-guide-limit">
                      {t('xpGuide.dailyLimit', { limit: levelInfo.xpRules.manualRecordDailyLimit })}
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
            <span className="level-manual-progress-label">{t('manualProgress.title')}</span>
            <span className="level-manual-progress-value">
              {t('manualProgress.progress', { current: levelInfo.todayManualXp, limit: levelInfo.xpRules.manualRecordDailyLimit })}
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
            <Trophy style={{ width: '18px', height: '18px', color: '#F72585' }} />
            {t('roadmap.title')}
          </h3>

          <div className="level-roadmap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
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
                      color: isCompleted || isCurrentLevel ? 'white' : '#D4D4D8',
                    }}
                  >
                    {isCompleted ? <CheckCircle style={{ width: '18px', height: '18px' }} /> : level}
                  </div>
                  <div className="level-roadmap-name" style={{ color: isCurrentLevel ? 'white' : isCompleted ? '#D4D4D8' : '#D4D4D8', fontWeight: isCurrentLevel ? 600 : 400 }}>
                    {tTypes(`levelNames.${level}`)}
                  </div>
                  {isCurrentLevel && (
                    <span className="level-roadmap-current" style={{ color: color }}>{t('roadmap.current')}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      {newLevelData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          newLevel={newLevelData.level}
          levelName={newLevelData.name}
        />
      )}
    </div>
  );
}
