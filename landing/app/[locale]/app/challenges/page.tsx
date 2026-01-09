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
import { useAuth } from '../../../contexts/AuthContext';
import type { Challenge, ChallengeStats, ChallengeType, ChallengeStatus, CreateChallengeDto } from '@/lib/types';
import { useTranslations, useLocale } from 'next-intl';

const challengeTypeIcons: Record<ChallengeType, typeof Target> = {
  sessions: Target,
  profit: TrendingUp,
  hours: Clock,
  streak: Flame,
  venue: MapPin,
};


function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getProgressColor(progress: number): string {
  if (progress >= 100) return '#10B981';
  if (progress >= 75) return '#F72585';
  if (progress >= 50) return '#D91C6B';
  return '#EF4444';
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const t = useTranslations('Challenges');
  const tTypes = useTranslations('Types');
  const tCommon = useTranslations('Common');
  const tUnits = useTranslations('Units');
  const locale = useLocale();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Locale-aware quick targets
  const quickTargets = locale === 'ko' ? [
    { label: '+100만', value: 1000000 },
    { label: '+500만', value: 5000000 },
    { label: '+1000만', value: 10000000 },
    { label: '+1억', value: 100000000 },
    { label: '+5억', value: 500000000 },
  ] : locale === 'ja' ? [
    { label: '+¥1M', value: 1000000 },
    { label: '+¥5M', value: 5000000 },
    { label: '+¥10M', value: 10000000 },
    { label: '+¥100M', value: 100000000 },
    { label: '+¥500M', value: 500000000 },
  ] : [
    { label: '+$1K', value: 1000 },
    { label: '+$5K', value: 5000 },
    { label: '+$10K', value: 10000 },
    { label: '+$50K', value: 50000 },
    { label: '+$100K', value: 100000 },
  ];

  // Translated challenge presets
  const challengePresets = [
    { title: t('create.profitChallenge'), type: 'profit' as ChallengeType, description: t('create.profitDesc') },
    { title: t('create.sessionsChallenge'), type: 'sessions' as ChallengeType, description: t('create.sessionsDesc') },
    { title: t('create.hoursChallenge'), type: 'hours' as ChallengeType, description: t('create.hoursDesc') },
  ];

  // Locale-aware target value formatting
  const formatTargetValue = (value: number, type: ChallengeType): string => {
    if (type === 'profit') {
      if (locale === 'ko') {
        if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억`;
        if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
        return value.toLocaleString();
      } else if (locale === 'ja') {
        if (value >= 1000000) return `¥${(value / 1000000).toFixed(0)}M`;
        return `¥${value.toLocaleString()}`;
      } else {
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value.toLocaleString()}`;
      }
    }
    if (type === 'hours') {
      return `${value}${tUnits('hours')}`;
    }
    if (type === 'sessions') {
      return `${value}${tUnits('sessions')}`;
    }
    return value.toString();
  };

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
      setError(t('errors.loadFailed'));
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
      alert(t('errors.createFailed'));
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteChallenge(id: string) {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await challengesApi.delete(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete challenge:', err);
      alert(t('errors.deleteFailed'));
    }
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const displayedChallenges = activeTab === 'active' ? activeChallenges : completedChallenges;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#F72585', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="app-page">
      {/* Header */}
      <div className="challenges-header">
        <div>
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          {t('newChallenge')}
        </button>
      </div>

      {/* Stats Banner - Full Width */}
      {stats && (
        <div className="challenges-stats-banner">
          <div className="challenges-stat-item">
            <div style={{ color: '#F72585', marginBottom: '8px' }}>
              <Flame className="challenges-stat-icon" />
            </div>
            <p className="challenges-stat-value">{stats.active}</p>
            <p className="challenges-stat-label">{t('stats.active')}</p>
          </div>
          <div className="challenges-stat-item">
            <div style={{ color: '#10B981', marginBottom: '8px' }}>
              <Trophy className="challenges-stat-icon" />
            </div>
            <p className="challenges-stat-value">{stats.completed}</p>
            <p className="challenges-stat-label">{t('stats.completed')}</p>
          </div>
          <div className="challenges-stat-item">
            <div style={{ color: '#D91C6B', marginBottom: '8px' }}>
              <Award className="challenges-stat-icon" />
            </div>
            <p className="challenges-stat-value">{stats.totalRewardsEarned.toLocaleString()}</p>
            <p className="challenges-stat-label">{t('stats.earnedPoints')}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="challenges-tabs">
        <button
          onClick={() => setActiveTab('active')}
          className={`filter-btn ${activeTab === 'active' ? 'active' : ''}`}
        >
          {t('tabs.active')} ({activeChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
          style={activeTab === 'completed' ? { background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981', color: '#10B981' } : {}}
        >
          {t('tabs.completed')} ({completedChallenges.length})
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
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            {activeTab === 'active' ? t('empty.active') : t('empty.completed')}
          </p>
          {activeTab === 'active' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
              style={{ margin: '0 auto' }}
            >
              {t('empty.startFirst')}
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
                        background: challenge.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(247, 37, 133, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {challenge.status === 'completed' ? (
                        <Check style={{ width: '24px', height: '24px', color: '#10B981' }} />
                      ) : (
                        <Icon style={{ width: '24px', height: '24px', color: '#F72585' }} />
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
                            background: 'rgba(247, 37, 133, 0.2)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#F72585',
                          }}
                        >
                          {tTypes(`challengeTypes.${challenge.type}`)}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '12px' }}>
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
                            <span style={{ fontSize: '12px', color: daysRemaining <= 3 ? '#EF4444' : '#A1A1AA' }}>
                              <Calendar style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                              {t('daysRemaining', { count: daysRemaining })}
                            </span>
                          )}
                          <span style={{ fontSize: '12px', color: '#D91C6B' }}>
                            <Award style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                            {t('points', { count: challenge.rewardPoints })}
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
                              color: '#A1A1AA',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            {t('giveUp')}
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{t('create.title')}</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#A1A1AA' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#A1A1AA', fontSize: '14px', marginBottom: '8px' }}>
                {t('create.quickPresets')}
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
                      background: newChallenge.type === preset.type ? 'rgba(247, 37, 133, 0.2)' : '#0A0A0B',
                      border: `1px solid ${newChallenge.type === preset.type ? '#F72585' : '#27272A'}`,
                      borderRadius: '6px',
                      color: newChallenge.type === preset.type ? '#F72585' : '#A1A1AA',
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
              <label style={{ display: 'block', color: '#A1A1AA', fontSize: '14px', marginBottom: '8px' }}>
                {t('create.name')}
              </label>
              <input
                type="text"
                value={newChallenge.title}
                onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                placeholder={t('create.namePlaceholder')}
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
              <label style={{ display: 'block', color: '#A1A1AA', fontSize: '14px', marginBottom: '8px' }}>
                {t('create.description')}
              </label>
              <input
                type="text"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                placeholder={t('create.descPlaceholder')}
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
              <label style={{ display: 'block', color: '#A1A1AA', fontSize: '14px', marginBottom: '8px' }}>
                {t('create.targetValue')} ({newChallenge.type === 'profit' ? tTypes('challengeTypes.profit') : newChallenge.type === 'hours' ? tTypes('challengeTypes.hours') : tTypes('challengeTypes.sessions')})
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
                        background: newChallenge.targetValue === target.value ? 'rgba(247, 37, 133, 0.2)' : '#0A0A0B',
                        border: `1px solid ${newChallenge.targetValue === target.value ? '#F72585' : '#27272A'}`,
                        borderRadius: '6px',
                        color: newChallenge.targetValue === target.value ? '#F72585' : '#A1A1AA',
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
                  {t('create.startDate')}
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
                  {t('create.endDate')}
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
              <label style={{ display: 'block', color: '#A1A1AA', fontSize: '14px', marginBottom: '8px' }}>
                {t('create.rewardPoints')}
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
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {tCommon('cancel')}
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
                    {t('create.creating')}
                  </>
                ) : (
                  t('create.createButton')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
