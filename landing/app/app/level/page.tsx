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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !levelInfo) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#EF4444' }}>{error || '레벨 정보를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  const levelColor = levelColors[levelInfo.level] || levelColors[8];

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>레벨 & XP</h1>
        <p style={{ color: '#71717A' }}>활동을 통해 XP를 획득하고 레벨을 올려보세요</p>
      </div>

      {/* Level Card */}
      <div
        className="card"
        style={{
          marginBottom: '24px',
          background: `linear-gradient(135deg, ${levelColor}20 0%, ${levelColor}05 100%)`,
          border: `1px solid ${levelColor}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${levelColor} 0%, ${levelColor}80 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 30px ${levelColor}40`,
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
              {levelInfo.level}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '4px' }}>현재 레벨</p>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
              {levelInfo.levelName}
            </h2>
            <p style={{ fontSize: '14px', color: levelColor }}>
              총 {levelInfo.totalXp.toLocaleString()} XP 획득
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#A1A1AA' }}>
              다음 레벨까지
            </span>
            <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>
              {levelInfo.currentXp} / {levelInfo.requiredXp} XP
            </span>
          </div>
          <div
            style={{
              height: '12px',
              background: '#27272A',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${levelInfo.progress}%`,
                background: `linear-gradient(90deg, ${levelColor} 0%, ${levelColor}80 100%)`,
                borderRadius: '6px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {levelInfo.level < 8 && (
          <p style={{ fontSize: '13px', color: '#71717A', textAlign: 'center' }}>
            다음 레벨: <span style={{ color: levelColors[levelInfo.level + 1] || '#6366F1' }}>{levelNames[levelInfo.level + 1]}</span>
          </p>
        )}
      </div>

      {/* Today's XP */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: '20px', height: '20px', color: '#FBBF24' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#71717A' }}>오늘 획득한 XP</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FBBF24' }}>+{levelInfo.todayXp} XP</p>
          </div>
        </div>

        {/* Claimable XP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Daily Login */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: levelInfo.canEarnLoginXp ? 'rgba(99, 102, 241, 0.1)' : '#0A0A0B',
              borderRadius: '8px',
              border: `1px solid ${levelInfo.canEarnLoginXp ? '#6366F1' : '#27272A'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {levelInfo.canEarnLoginXp ? (
                <Circle style={{ width: '20px', height: '20px', color: '#6366F1' }} />
              ) : (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
              )}
              <div>
                <p style={{ color: 'white', fontWeight: 500 }}>일일 로그인</p>
                <p style={{ fontSize: '13px', color: '#71717A' }}>+{levelInfo.xpRules.dailyLogin} XP</p>
              </div>
            </div>
            {levelInfo.canEarnLoginXp ? (
              <button
                onClick={() => handleClaimXp('dailyLogin')}
                disabled={claiming === 'dailyLogin'}
                style={{
                  padding: '8px 16px',
                  background: '#6366F1',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {claiming === 'dailyLogin' ? (
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                )}
                받기
              </button>
            ) : (
              <span style={{ fontSize: '13px', color: '#10B981' }}>완료</span>
            )}
          </div>

          {/* Analytics View */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: levelInfo.canEarnAnalyticsXp ? 'rgba(99, 102, 241, 0.1)' : '#0A0A0B',
              borderRadius: '8px',
              border: `1px solid ${levelInfo.canEarnAnalyticsXp ? '#6366F1' : '#27272A'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {levelInfo.canEarnAnalyticsXp ? (
                <Circle style={{ width: '20px', height: '20px', color: '#6366F1' }} />
              ) : (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
              )}
              <div>
                <p style={{ color: 'white', fontWeight: 500 }}>분석 화면 조회</p>
                <p style={{ fontSize: '13px', color: '#71717A' }}>+{levelInfo.xpRules.viewAnalytics} XP (일 1회)</p>
              </div>
            </div>
            {levelInfo.canEarnAnalyticsXp ? (
              <button
                onClick={() => handleClaimXp('viewAnalytics')}
                disabled={claiming === 'viewAnalytics'}
                style={{
                  padding: '8px 16px',
                  background: '#6366F1',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {claiming === 'viewAnalytics' ? (
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                )}
                받기
              </button>
            ) : (
              <span style={{ fontSize: '13px', color: '#10B981' }}>완료</span>
            )}
          </div>
        </div>
      </div>

      {/* XP Guide */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star style={{ width: '18px', height: '18px', color: '#6366F1' }} />
          XP 획득 방법
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(xpTypeLabels).map(([key, label]) => {
            const Icon = xpTypeIcons[key as keyof typeof xpTypeIcons];
            const xp = levelInfo.xpRules[key as keyof typeof levelInfo.xpRules];
            const isManual = key === 'manualRecord';

            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #27272A',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon style={{ width: '18px', height: '18px', color: '#71717A' }} />
                  <span style={{ color: 'white' }}>{label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#6366F1', fontWeight: 500 }}>+{xp} XP</span>
                  {isManual && (
                    <p style={{ fontSize: '11px', color: '#71717A' }}>
                      일 최대 {levelInfo.xpRules.manualRecordDailyLimit} XP
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Record Progress */}
        <div style={{ marginTop: '16px', padding: '12px', background: '#0A0A0B', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#71717A' }}>오늘 수동 기록 XP</span>
            <span style={{ fontSize: '13px', color: 'white' }}>
              {levelInfo.todayManualXp} / {levelInfo.xpRules.manualRecordDailyLimit}
            </span>
          </div>
          <div style={{ height: '4px', background: '#27272A', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(levelInfo.todayManualXp / levelInfo.xpRules.manualRecordDailyLimit) * 100}%`,
                background: '#6366F1',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Level Roadmap */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy style={{ width: '18px', height: '18px', color: '#6366F1' }} />
          레벨 로드맵
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(levelNames).map(([lvl, name]) => {
            const level = parseInt(lvl);
            const isCurrentLevel = level === levelInfo.level;
            const isCompleted = level < levelInfo.level;
            const color = levelColors[level];

            return (
              <div
                key={level}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: isCurrentLevel ? `${color}15` : 'transparent',
                  borderRadius: '8px',
                  border: isCurrentLevel ? `1px solid ${color}40` : '1px solid transparent',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCompleted || isCurrentLevel ? color : '#27272A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isCompleted || isCurrentLevel ? 'white' : '#71717A',
                  }}
                >
                  {isCompleted ? <CheckCircle style={{ width: '18px', height: '18px' }} /> : level}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: isCurrentLevel ? 'white' : isCompleted ? '#A1A1AA' : '#71717A', fontWeight: isCurrentLevel ? 600 : 400 }}>
                    {name}
                  </p>
                </div>
                {isCurrentLevel && (
                  <span style={{ fontSize: '12px', color: color, fontWeight: 500 }}>현재</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
