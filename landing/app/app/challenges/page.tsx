'use client';

import { useState, useEffect } from 'react';
import {
  Trophy,
  Plus,
  Target,
  Clock,
  TrendingUp,
  Loader2,
  X,
  Check,
  Calendar,
  Award,
  Flame,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { challengesApi } from '@/lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Challenge, ChallengeStats, ChallengeType, ChallengeStatus, CreateChallengeDto } from '@/lib/types';
import { challengeTypeLabels, challengeStatusLabels } from '@/lib/types';

const challengeTypeIcons: Record<ChallengeType, typeof Target> = {
  sessions: Target,
  profit: TrendingUp,
  hours: Clock,
  streak: Flame,
  venue: MapPin,
};

const quickTargets = [
  { label: '+100만', value: 1000000 },
  { label: '+500만', value: 5000000 },
  { label: '+1000만', value: 10000000 },
  { label: '+1억', value: 100000000 },
  { label: '+5억', value: 500000000 },
];

const challengePresets = [
  { title: '수익 챌린지', type: 'profit' as ChallengeType, description: '목표 수익 달성하기' },
  { title: '세션 챌린지', type: 'sessions' as ChallengeType, description: '목표 세션 수 달성하기' },
  { title: '플레이 시간 챌린지', type: 'hours' as ChallengeType, description: '목표 시간 달성하기' },
];

function formatTargetValue(value: number, type: ChallengeType): string {
  if (type === 'profit') {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(0)}억`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toLocaleString();
  }
  if (type === 'hours') {
    return `${value}시간`;
  }
  if (type === 'sessions') {
    return `${value}세션`;
  }
  return value.toString();
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getProgressColor(progress: number): string {
  if (progress >= 100) return '#10B981';
  if (progress >= 75) return '#6366F1';
  if (progress >= 50) return '#F59E0B';
  return '#EF4444';
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Create modal state
  const [creating, setCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState<CreateChallengeDto>({
    title: '',
    description: '',
    type: 'profit',
    targetValue: 1000000,
    rewardPoints: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [challengesData, statsData] = await Promise.all([
        challengesApi.getAll(),
        challengesApi.getStats(),
      ]);
      setChallenges(challengesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      setError('챌린지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateChallenge() {
    setCreating(true);
    try {
      await challengesApi.create(newChallenge);
      setShowCreateModal(false);
      setNewChallenge({
        title: '',
        description: '',
        type: 'profit',
        targetValue: 1000000,
        rewardPoints: 100,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      fetchData();
    } catch (err) {
      console.error('Failed to create challenge:', err);
      alert('챌린지 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteChallenge(id: string) {
    if (!confirm('이 챌린지를 삭제하시겠습니까?')) return;
    try {
      await challengesApi.delete(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete challenge:', err);
      alert('챌린지 삭제에 실패했습니다.');
    }
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const displayedChallenges = activeTab === 'active' ? activeChallenges : completedChallenges;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="app-page">
      {/* Header */}
      <div className="challenges-header">
        <div>
          <h1 className="page-title">챌린지</h1>
          <p className="page-subtitle">목표를 설정하고 달성해보세요</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          새 챌린지
        </button>
      </div>

      {/* Stats Banner - Full Width */}
      {stats && (
        <div className="challenges-stats-banner">
          <div className="challenges-stat-item">
            <div style={{ color: '#6366F1', marginBottom: '8px' }}>
              <Flame className="challenges-stat-icon" />
            </div>
            <p className="challenges-stat-value">{stats.active}</p>
            <p className="challenges-stat-label">진행 중</p>
          </div>
          <div className="challenges-stat-item">
            <div style={{ color: '#10B981', marginBottom: '8px' }}>
              <Trophy className="challenges-stat-icon" />
            </div>
            <p className="challenges-stat-value">{stats.completed}</p>
            <p className="challenges-stat-label">완료</p>
          </div>
          <div className="challenges-stat-item">
            <div style={{ color: '#F59E0B', marginBottom: '8px' }}>
              <Award className="challenges-stat-icon" />
            </div>
            <p className="challenges-stat-value">{stats.totalRewardsEarned.toLocaleString()}</p>
            <p className="challenges-stat-label">획득 포인트</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="challenges-tabs">
        <button
          onClick={() => setActiveTab('active')}
          className={`filter-btn ${activeTab === 'active' ? 'active' : ''}`}
        >
          진행 중 ({activeChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
          style={activeTab === 'completed' ? { background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981', color: '#10B981' } : {}}
        >
          완료 ({completedChallenges.length})
        </button>
      </div>

      {/* Challenge List */}
      {error ? (
        <div className="card" style={{ textAlign: 'center', color: '#EF4444' }}>
          {error}
        </div>
      ) : displayedChallenges.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Trophy style={{ width: '48px', height: '48px', color: '#27272A', margin: '0 auto 16px' }} />
          <p style={{ color: '#71717A', marginBottom: '16px' }}>
            {activeTab === 'active' ? '진행 중인 챌린지가 없습니다' : '완료한 챌린지가 없습니다'}
          </p>
          {activeTab === 'active' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
              style={{ margin: '0 auto' }}
            >
              첫 챌린지 시작하기
            </button>
          )}
        </div>
      ) : (
        <div className="challenges-grid">
          {displayedChallenges.map((challenge) => {
            const progress = Math.min((challenge.currentValue / challenge.targetValue) * 100, 100);
            const daysRemaining = getDaysRemaining(challenge.endDate);
            const Icon = challengeTypeIcons[challenge.type];

            return (
              <div
                key={challenge.id}
                className="card"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {/* Progress background */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${getProgressColor(progress)}15, ${getProgressColor(progress)}05)`,
                    transition: 'width 0.3s ease',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* Icon */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: challenge.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {challenge.status === 'completed' ? (
                        <Check style={{ width: '24px', height: '24px', color: '#10B981' }} />
                      ) : (
                        <Icon style={{ width: '24px', height: '24px', color: '#6366F1' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
                          {challenge.title}
                        </h3>
                        <span
                          style={{
                            padding: '2px 8px',
                            background: 'rgba(99, 102, 241, 0.2)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#6366F1',
                          }}
                        >
                          {challengeTypeLabels[challenge.type]}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#71717A', marginBottom: '12px' }}>
                        {challenge.description}
                      </p>

                      {/* Progress */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', color: '#A1A1AA' }}>
                            {formatTargetValue(challenge.currentValue, challenge.type)} / {formatTargetValue(challenge.targetValue, challenge.type)}
                          </span>
                          <span style={{ fontSize: '13px', color: getProgressColor(progress), fontWeight: 500 }}>
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: '6px',
                            background: '#27272A',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${progress}%`,
                              background: getProgressColor(progress),
                              borderRadius: '3px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {challenge.status === 'active' && (
                            <span style={{ fontSize: '12px', color: daysRemaining <= 3 ? '#EF4444' : '#71717A' }}>
                              <Calendar style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                              {daysRemaining}일 남음
                            </span>
                          )}
                          <span style={{ fontSize: '12px', color: '#F59E0B' }}>
                            <Award style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                            {challenge.rewardPoints} 포인트
                          </span>
                        </div>

                        {challenge.status === 'active' && (
                          <button
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            style={{
                              padding: '4px 8px',
                              background: 'transparent',
                              border: '1px solid #27272A',
                              borderRadius: '4px',
                              color: '#71717A',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            포기
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>새 챌린지</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#71717A' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                빠른 선택
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {challengePresets.map((preset) => (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => setNewChallenge({
                      ...newChallenge,
                      title: preset.title,
                      description: preset.description,
                      type: preset.type,
                    })}
                    style={{
                      padding: '8px 14px',
                      background: newChallenge.type === preset.type ? 'rgba(99, 102, 241, 0.2)' : '#0A0A0B',
                      border: `1px solid ${newChallenge.type === preset.type ? '#6366F1' : '#27272A'}`,
                      borderRadius: '6px',
                      color: newChallenge.type === preset.type ? '#6366F1' : '#71717A',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                챌린지 이름
              </label>
              <input
                type="text"
                value={newChallenge.title}
                onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                placeholder="나만의 챌린지"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0A0A0B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                설명
              </label>
              <input
                type="text"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                placeholder="목표를 달성해보세요"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0A0A0B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>

            {/* Target Value */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                목표 {newChallenge.type === 'profit' ? '금액' : newChallenge.type === 'hours' ? '시간' : '세션 수'}
              </label>
              {newChallenge.type === 'profit' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {quickTargets.map((target) => (
                    <button
                      key={target.value}
                      type="button"
                      onClick={() => setNewChallenge({ ...newChallenge, targetValue: target.value })}
                      style={{
                        padding: '6px 12px',
                        background: newChallenge.targetValue === target.value ? 'rgba(99, 102, 241, 0.2)' : '#0A0A0B',
                        border: `1px solid ${newChallenge.targetValue === target.value ? '#6366F1' : '#27272A'}`,
                        borderRadius: '6px',
                        color: newChallenge.targetValue === target.value ? '#6366F1' : '#71717A',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      {target.label}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="number"
                value={newChallenge.targetValue}
                onChange={(e) => setNewChallenge({ ...newChallenge, targetValue: parseInt(e.target.value) || 0 })}
                min="1"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0A0A0B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>

            {/* Period */}
            <div className="upload-form-grid-2">
              <div>
                <label className="upload-form-label-block">
                  시작일
                </label>
                <input
                  type="date"
                  value={newChallenge.startDate}
                  onChange={(e) => setNewChallenge({ ...newChallenge, startDate: e.target.value })}
                  className="upload-form-input"
                />
              </div>
              <div>
                <label className="upload-form-label-block">
                  종료일
                </label>
                <input
                  type="date"
                  value={newChallenge.endDate}
                  onChange={(e) => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
                  className="upload-form-input"
                />
              </div>
            </div>

            {/* Reward Points */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                보상 포인트
              </label>
              <input
                type="number"
                value={newChallenge.rewardPoints}
                onChange={(e) => setNewChallenge({ ...newChallenge, rewardPoints: parseInt(e.target.value) || 0 })}
                min="0"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0A0A0B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'transparent',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: '#71717A',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                취소
              </button>
              <button
                onClick={handleCreateChallenge}
                disabled={creating || !newChallenge.title || !newChallenge.targetValue}
                className="btn-primary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  opacity: creating || !newChallenge.title || !newChallenge.targetValue ? 0.5 : 1,
                  cursor: creating || !newChallenge.title || !newChallenge.targetValue ? 'not-allowed' : 'pointer',
                }}
              >
                {creating ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    생성 중...
                  </>
                ) : (
                  '챌린지 시작'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
