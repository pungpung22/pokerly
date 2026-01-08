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
import type { Feedback } from '@/lib/types';
import { feedbackApi } from '@/lib/api';

const categories = [
  { value: 'bug', label: '버그 신고', icon: Bug, color: '#EF4444' },
  { value: 'feature', label: '기능 제안', icon: Lightbulb, color: '#F59E0B' },
  { value: 'question', label: '문의사항', icon: HelpCircle, color: '#3B82F6' },
  { value: 'other', label: '기타', icon: Heart, color: '#8B5CF6' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '검토 중', color: '#F59E0B' },
  reviewing: { label: '처리 중', color: '#3B82F6' },
  resolved: { label: '완료', color: '#10B981' },
  closed: { label: '종료', color: '#71717A' },
};

export default function FeedbackPage() {
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [showMyFeedbacks, setShowMyFeedbacks] = useState(false);

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
      alert('피드백 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find((c) => c.value === categoryValue) || categories[3];
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare style={{ width: '24px', height: '24px', color: '#6366F1' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>피드백</h1>
            <p style={{ color: '#71717A', fontSize: '14px' }}>의견을 보내주세요</p>
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
          <span style={{ color: '#10B981' }}>피드백이 전송되었습니다. 감사합니다!</span>
        </div>
      )}

      {/* Feedback Form */}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '24px' }}>
          {/* Category Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '12px' }}>
              카테고리를 선택하세요
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
                      color: category === cat.value ? cat.color : '#71717A',
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
            <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
              내용을 입력하세요
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="버그 상황, 기능 제안, 문의사항 등을 자세히 적어주세요..."
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
              {content.length} / 1000자
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
              전송 중...
            </>
          ) : (
            <>
              <Send style={{ width: '18px', height: '18px' }} />
              피드백 보내기
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
            <Clock style={{ width: '18px', height: '18px', color: '#71717A' }} />
            <span style={{ fontSize: '15px' }}>내가 보낸 피드백</span>
            {myFeedbacks.length > 0 && (
              <span
                style={{
                  padding: '2px 8px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  borderRadius: '10px',
                  color: '#6366F1',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {myFeedbacks.length}
              </span>
            )}
          </div>
          {showMyFeedbacks ? (
            <ChevronUp style={{ width: '18px', height: '18px', color: '#71717A' }} />
          ) : (
            <ChevronDown style={{ width: '18px', height: '18px', color: '#71717A' }} />
          )}
        </button>

        {showMyFeedbacks && (
          <div style={{ marginTop: '12px' }}>
            {loadingFeedbacks ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Loader2 style={{ width: '24px', height: '24px', color: '#6366F1', animation: 'spin 1s linear infinite' }} />
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
                <p style={{ color: '#71717A' }}>아직 보낸 피드백이 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myFeedbacks.map((feedback) => {
                  const catInfo = getCategoryInfo(feedback.category);
                  const statusInfo = statusLabels[feedback.status] || statusLabels.pending;
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
                            background: `${statusInfo.color}20`,
                            borderRadius: '6px',
                            color: statusInfo.color,
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          {statusInfo.label}
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
