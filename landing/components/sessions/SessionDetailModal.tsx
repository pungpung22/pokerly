'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Tag,
  Plus,
  Trash2,
  Save,
  ExternalLink,
} from 'lucide-react';
import { sessionsApi } from '@/lib/api';
import type { Session } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onUpdate?: (session: Session) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999/api';

// Predefined tag suggestions
const TAG_SUGGESTIONS = [
  'tilted', 'focused', 'tired', 'hot run', 'cold deck',
  'good play', 'bad beat', 'big pot', 'short session',
  'long session', 'tournament', 'cash game', 'soft table'
];

export default function SessionDetailModal({
  isOpen,
  onClose,
  session,
  onUpdate,
}: SessionDetailModalProps) {
  const t = useTranslations('Sessions');
  const tCommon = useTranslations('Common');
  const tUnits = useTranslations('Units');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (session) {
      setNotes(session.notes || '');
      setTags(session.tags || []);
      setImageError(false);
    }
  }, [session]);

  if (!session) return null;

  const profit = Number(session.cashOut) - Number(session.buyIn);
  const isProfit = profit >= 0;

  const handleSave = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const updatedSession = await sessionsApi.update(session.id, {
        notes: notes || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      onUpdate?.(updatedSession);
      setEditingNotes(false);
    } catch (err) {
      console.error('Failed to update session:', err);
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}${tUnits('hours')} ${mins}${tUnits('minutes')}`;
    }
    return `${mins}${tUnits('minutes')}`;
  };

  // Screenshot URL handling
  const getScreenshotUrl = () => {
    if (!session.screenshotUrl) return null;
    // If it's a relative path, prepend the API base URL
    if (session.screenshotUrl.startsWith('/')) {
      return `${API_BASE_URL.replace('/api', '')}${session.screenshotUrl}`;
    }
    return session.screenshotUrl;
  };

  const screenshotUrl = getScreenshotUrl();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#141416',
              borderRadius: '16px',
              border: '1px solid #27272A',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '85vh',
              overflow: 'hidden',
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #27272A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                  {t('detail.title')}
                </h2>
                <p style={{ fontSize: '14px', color: '#A1A1AA' }}>
                  {formatDate(session.date)}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#71717A',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Profit Banner */}
              <div
                style={{
                  background: isProfit ? 'rgba(0, 212, 170, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${isProfit ? 'rgba(0, 212, 170, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '14px', color: '#A1A1AA', marginBottom: '4px' }}>
                  {t('detail.profit')}
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: isProfit ? '#00D4AA' : '#EF4444',
                }}>
                  {isProfit ? '+' : ''}{profit.toLocaleString()}{tUnits('won')}
                </p>
              </div>

              {/* Session Info Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <div className="session-detail-item">
                  <MapPin style={{ width: '16px', height: '16px', color: '#F72585' }} />
                  <div>
                    <span className="label">{t('detail.venue')}</span>
                    <span className="value">{session.venue}</span>
                  </div>
                </div>
                <div className="session-detail-item">
                  <DollarSign style={{ width: '16px', height: '16px', color: '#F72585' }} />
                  <div>
                    <span className="label">{t('detail.stakes')}</span>
                    <span className="value">{session.stakes}</span>
                  </div>
                </div>
                <div className="session-detail-item">
                  <Clock style={{ width: '16px', height: '16px', color: '#F72585' }} />
                  <div>
                    <span className="label">{t('detail.duration')}</span>
                    <span className="value">{formatDuration(session.durationMinutes)}</span>
                  </div>
                </div>
                <div className="session-detail-item">
                  <Calendar style={{ width: '16px', height: '16px', color: '#F72585' }} />
                  <div>
                    <span className="label">{t('detail.hands')}</span>
                    <span className="value">{session.hands || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Screenshot Section */}
              {screenshotUrl && !imageError && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <ImageIcon style={{ width: '16px', height: '16px', color: '#F72585' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#D4D4D8' }}>
                      {t('detail.screenshot')}
                    </span>
                    <a
                      href={screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: '#A1A1AA',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink style={{ width: '12px', height: '12px' }} />
                      {t('detail.viewFull')}
                    </a>
                  </div>
                  <div
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #27272A',
                      background: '#0A0A0B',
                    }}
                  >
                    <img
                      src={screenshotUrl}
                      alt="Session screenshot"
                      onError={() => setImageError(true)}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '200px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FileText style={{ width: '16px', height: '16px', color: '#F72585' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#D4D4D8' }}>
                    {t('detail.notes')}
                  </span>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        color: '#A1A1AA',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {tCommon('edit')}
                    </button>
                  )}
                </div>
                {editingNotes ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('detail.notesPlaceholder')}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      background: '#0A0A0B',
                      border: '1px solid #27272A',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: '12px',
                      background: '#0A0A0B',
                      border: '1px solid #27272A',
                      borderRadius: '8px',
                      color: notes ? '#D4D4D8' : '#71717A',
                      fontSize: '14px',
                      minHeight: '60px',
                    }}
                  >
                    {notes || t('detail.noNotes')}
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Tag style={{ width: '16px', height: '16px', color: '#F72585' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#D4D4D8' }}>
                    {t('detail.tags')}
                  </span>
                </div>

                {/* Current Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(247, 37, 133, 0.15)',
                        border: '1px solid rgba(247, 37, 133, 0.3)',
                        borderRadius: '20px',
                        fontSize: '13px',
                        color: '#F72585',
                      }}
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: 'inherit',
                          opacity: 0.7,
                        }}
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span style={{ fontSize: '14px', color: '#71717A' }}>
                      {t('detail.noTags')}
                    </span>
                  )}
                </div>

                {/* Add Tag Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag(newTag)}
                    placeholder={t('detail.addTagPlaceholder')}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: '#0A0A0B',
                      border: '1px solid #27272A',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                  <button
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim()}
                    style={{
                      padding: '10px 16px',
                      background: newTag.trim() ? '#F72585' : '#27272A',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: newTag.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Plus style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>

                {/* Tag Suggestions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {TAG_SUGGESTIONS.filter(s => !tags.includes(s)).slice(0, 6).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => addTag(suggestion)}
                      style={{
                        padding: '4px 10px',
                        background: 'transparent',
                        border: '1px solid #27272A',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#71717A',
                        cursor: 'pointer',
                      }}
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #27272A',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: '#D4D4D8',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {tCommon('close')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #F72585 0%, #7B2FF7 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Save style={{ width: '16px', height: '16px' }} />
                {saving ? t('detail.saving') : tCommon('save')}
              </button>
            </div>

            <style jsx global>{`
              .session-detail-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 12px;
                background: #0A0A0B;
                border: 1px solid #27272A;
                border-radius: 8px;
              }
              .session-detail-item div {
                display: flex;
                flex-direction: column;
              }
              .session-detail-item .label {
                font-size: 12px;
                color: #71717A;
                margin-bottom: 2px;
              }
              .session-detail-item .value {
                font-size: 14px;
                color: white;
                font-weight: 500;
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
