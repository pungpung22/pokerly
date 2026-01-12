'use client';

import { useState, useEffect } from 'react';
import { Megaphone, ChevronRight, Loader2, AlertCircle, Calendar, Star } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Notice } from '@/lib/types';
import { noticesApi } from '@/lib/api';

export default function NoticesPage() {
  const t = useTranslations('Notices');
  const locale = useLocale();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const data = await noticesApi.getAll();
      setNotices(data);
    } catch (err) {
      console.error('Failed to load notices:', err);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' };
    return date.toLocaleDateString(localeMap[locale] || 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

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
              background: 'rgba(20, 184, 166, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Megaphone style={{ width: '24px', height: '24px', color: '#14B8A6' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{t('title')}</h1>
            <p style={{ color: '#D4D4D8', fontSize: '14px' }}>{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <AlertCircle style={{ width: '20px', height: '20px', color: '#EF4444' }} />
          <span style={{ color: '#EF4444' }}>{error}</span>
        </div>
      )}

      {/* Notices List */}
      {notices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Megaphone style={{ width: '48px', height: '48px', color: '#3F3F46', margin: '0 auto 16px' }} />
          <p style={{ color: '#D4D4D8', fontSize: '16px' }}>{t('empty')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: notice.isImportant ? '1px solid rgba(20, 184, 166, 0.3)' : undefined,
              }}
              onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {notice.isImportant && (
                  <div
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(20, 184, 166, 0.2)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <Star style={{ width: '12px', height: '12px', color: '#14B8A6' }} />
                    <span style={{ color: '#14B8A6', fontSize: '12px', fontWeight: 500 }}>{t('important')}</span>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                    {notice.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D4D4D8', fontSize: '13px' }}>
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    {formatDate(notice.createdAt)}
                  </div>
                </div>
                <ChevronRight
                  style={{
                    width: '20px',
                    height: '20px',
                    color: '#D4D4D8',
                    transform: expandedId === notice.id ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Expanded Content */}
              {expandedId === notice.id && (
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #27272A',
                  }}
                >
                  <p style={{ color: '#D4D4D8', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {notice.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
