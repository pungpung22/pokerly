'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  Heart,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Feedback } from '@/lib/types';
import { feedbackApi } from '@/lib/api';

const categoryIcons = {
  bug: { icon: Bug, color: '#EF4444' },
  feature: { icon: Lightbulb, color: '#F72585' },
  question: { icon: HelpCircle, color: '#3B82F6' },
  other: { icon: Heart, color: '#8B5CF6' },
};

const statusColors: Record<string, string> = {
  pending: '#F72585',
  reviewing: '#3B82F6',
  resolved: '#10B981',
  closed: '#A1A1AA',
};

export default function FeedbackPage() {
  const t = useTranslations('Feedback');
  const locale = useLocale();
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [showMyFeedbacks, setShowMyFeedbacks] = useState(false);

  const categories = [
    { value: 'bug', label: t('categories.bug'), ...categoryIcons.bug },
    { value: 'feature', label: t('categories.feature'), ...categoryIcons.feature },
    { value: 'question', label: t('categories.question'), ...categoryIcons.question },
    { value: 'other', label: t('categories.other'), ...categoryIcons.other },
  ];

  const getStatusLabel = (status: string) => {
    const statusKey = status === 'reviewing' ? 'inProgress' : status;
    return t(`status.${statusKey}`);
  };

  useEffect(() => {
    loadMyFeedbacks();
  }, []);

  const loadMyFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      const data = await feedbackApi.getMyFeedbacks();
      setMyFeedbacks(data);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !content.trim()) return;

    setLoading(true);
    try {
      await feedbackApi.create({ category, content: content.trim() });
      setSuccess(true);
      setCategory('');
      setContent('');
      loadMyFeedbacks();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' };
    return date.toLocaleDateString(localeMap[locale] || 'ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find((c) => c.value === categoryValue) || categories[3];
  };

  return (
    <div className="app-page">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(247, 37, 133, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare style={{ width: '24px', height: '24px', color: '#F72585' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{t('title')}</h1>
            <p style={{ color: '#A1A1AA', fontSize: '14px' }}>{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div
          style={{
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />
          <span style={{ color: '#10B981' }}>{t('success')}</span>
        </div>
      )}

      {/* Feedback Form */}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '24px' }}>
          {/* Category Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#A1A1AA', fontSize: '14px', marginBottom: '12px' }}>
              {t('form.categoryLabel')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px',
                    background: category === cat.value ? `${cat.color}15` : '#0A0A0B',
                    border: `1px solid ${category === cat.value ? cat.color : '#27272A'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <cat.icon
                    style={{
                      width: '20px',
                      height: '20px',
                      color: category === cat.value ? cat.color : '#A1A1AA',
                    }}
                  />
                  <span
                    style={{
                      color: category === cat.value ? cat.color : '#A1A1AA',
                      fontSize: '14px',
                      fontWeight: category === cat.value ? 500 : 400,
                    }}
                  >
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#A1A1AA', fontSize: '14px', marginBottom: '8px' }}>
              {t('form.contentLabel')}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('form.contentPlaceholder')}
              rows={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0A0A0B',
                border: '1px solid #27272A',
                borderRadius: '10px',
                color: 'white',
                fontSize: '15px',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
            <p style={{ color: '#52525B', fontSize: '12px', marginTop: '8px' }}>
              {t('form.charCount', { count: content.length })}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !category || !content.trim()}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '16px',
            opacity: loading || !category || !content.trim() ? 0.5 : 1,
            cursor: loading || !category || !content.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <>
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
              {t('form.submitting')}
            </>
          ) : (
            <>
              <Send style={{ width: '18px', height: '18px' }} />
              {t('form.submit')}
            </>
          )}
        </button>
      </form>

      {/* My Feedbacks */}
      <div style={{ marginTop: '32px' }}>
        <button
          onClick={() => setShowMyFeedbacks(!showMyFeedbacks)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '16px',
            background: '#141416',
            border: '1px solid #27272A',
            borderRadius: '12px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock style={{ width: '18px', height: '18px', color: '#A1A1AA' }} />
            <span style={{ fontSize: '15px' }}>{t('myFeedbacks')}</span>
            {myFeedbacks.length > 0 && (
              <span
                style={{
                  padding: '2px 8px',
                  background: 'rgba(247, 37, 133, 0.2)',
                  borderRadius: '10px',
                  color: '#F72585',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {myFeedbacks.length}
              </span>
            )}
          </div>
          {showMyFeedbacks ? (
            <ChevronUp style={{ width: '18px', height: '18px', color: '#A1A1AA' }} />
          ) : (
            <ChevronDown style={{ width: '18px', height: '18px', color: '#A1A1AA' }} />
          )}
        </button>

        {showMyFeedbacks && (
          <div style={{ marginTop: '12px' }}>
            {loadingFeedbacks ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Loader2 style={{ width: '24px', height: '24px', color: '#F72585', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : myFeedbacks.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  background: '#141416',
                  borderRadius: '12px',
                  border: '1px solid #27272A',
                }}
              >
                <p style={{ color: '#A1A1AA' }}>{t('noFeedbacks')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myFeedbacks.map((feedback) => {
                  const catInfo = getCategoryInfo(feedback.category);
                  const statusColor = statusColors[feedback.status] || statusColors.pending;
                  return (
                    <div
                      key={feedback.id}
                      style={{
                        padding: '16px',
                        background: '#141416',
                        borderRadius: '12px',
                        border: '1px solid #27272A',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <catInfo.icon style={{ width: '16px', height: '16px', color: catInfo.color }} />
                          <span style={{ color: catInfo.color, fontSize: '13px', fontWeight: 500 }}>
                            {catInfo.label}
                          </span>
                        </div>
                        <span
                          style={{
                            padding: '4px 10px',
                            background: `${statusColor}20`,
                            borderRadius: '6px',
                            color: statusColor,
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          {getStatusLabel(feedback.status)}
                        </span>
                      </div>
                      <p
                        style={{
                          color: '#A1A1AA',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {feedback.content}
                      </p>
                      <p style={{ color: '#52525B', fontSize: '12px', marginTop: '10px' }}>
                        {formatDate(feedback.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
