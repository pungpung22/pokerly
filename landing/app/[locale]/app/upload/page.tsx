'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Upload,
  X,
  Camera,
  Edit3,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { CreateSessionDto } from '@/lib/types';
import { userApi, uploadsApi } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface UploadedFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'duplicate';
  result?: CreateSessionDto;
  error?: string;
  duplicateSessionId?: string;
}

interface ExtractedRecord {
  gameType: 'cash' | 'tournament';
  date: string;
  venue: string;
  stakes?: string;
  startTime?: string;
  hands?: number;
  profit?: number;
  buyIn?: number;
  cashOut?: number;
  durationMinutes?: number;
}

export default function UploadPage() {
  const router = useRouter();
  const t = useTranslations('Upload');
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'complete' | 'failed' | 'duplicate'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [showAnalyzingModal, setShowAnalyzingModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [extractedRecords, setExtractedRecords] = useState<ExtractedRecord[]>([]);

  // File validation
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (!allowedTypes.includes(file.type)) {
      return t('errors.fileType');
    }
    if (file.size > maxSize) {
      return t('errors.fileSize');
    }
    return null;
  };

  // Handle file selection
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = 5 - uploadedFiles.length;

    if (fileArray.length > remainingSlots) {
      alert(t('errors.maxFiles'));
    }

    const newFiles = fileArray.slice(0, remainingSlots).map((file) => {
      const error = validateFile(file);
      return {
        file,
        preview: URL.createObjectURL(file),
        status: error ? 'error' : 'pending',
        error,
      } as UploadedFile;
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, [uploadedFiles.length]);

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  // Remove file
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Process screenshots with backend API
  const processScreenshots = async () => {
    if (uploadedFiles.length === 0) return;

    setLoading(true);
    setOcrStatus('processing');
    setShowAnalyzingModal(true); // 분석 중 모달 표시
    const pendingFiles = uploadedFiles.filter((f) => f.status === 'pending');

    // Update status to uploading
    setUploadedFiles((prev) =>
      prev.map((f) => (f.status === 'pending' ? { ...f, status: 'uploading' as const } : f))
    );

    try {
      // Upload files to backend
      const filesToUpload = pendingFiles.map((f) => f.file);
      const result = await uploadsApi.uploadScreenshots(filesToUpload);

      // Update status based on results
      setUploadedFiles((prev) =>
        prev.map((f) => {
          const resultIndex = pendingFiles.findIndex((pf) => pf.file === f.file);
          if (resultIndex >= 0 && result.results[resultIndex]) {
            const apiResult = result.results[resultIndex];
            const apiStatus = apiResult.status;
            if (apiStatus === 'duplicate') {
              return {
                ...f,
                status: 'duplicate' as const,
                error: apiResult.message,
                duplicateSessionId: apiResult.duplicateSessionId,
              };
            }
            return {
              ...f,
              status: apiStatus === 'success' || apiStatus === 'pending_ocr' || apiStatus === 'ocr_complete' ? 'success' as const : 'error' as const,
            };
          }
          return f;
        })
      );

      // Award XP for screenshot upload
      await userApi.addXp('uploadScreenshot');

      // 추출된 기록들 저장
      const extractedList: ExtractedRecord[] = result.results
        .filter((r: any) => r.extractedData && r.status !== 'duplicate')
        .map((r: any) => ({
          gameType: r.extractedData.gameType || 'cash',
          date: r.extractedData.date || new Date().toISOString().split('T')[0],
          venue: r.extractedData.venue || '',
          stakes: r.extractedData.stakes,
          startTime: r.extractedData.startTime,
          hands: r.extractedData.hands,
          profit: r.extractedData.profit,
          buyIn: r.extractedData.buyIn,
          cashOut: r.extractedData.cashOut,
          durationMinutes: r.extractedData.playTime,
        }));

      setExtractedRecords(extractedList);
      setShowAnalyzingModal(false); // 분석 중 모달 닫기

      if (extractedList.length > 0) {
        // OCR 성공 - 결과 모달 표시
        setShowResultsModal(true);
        setOcrStatus('complete');
      } else {
        // OCR 실패, 중복, 또는 데이터 없음
        const duplicateCount = result.results.filter(
          (r: { status: string }) => r.status === 'duplicate'
        ).length;
        const failedCount = result.results.filter(
          (r: { status: string }) => r.status === 'ocr_failed'
        ).length;
        if (duplicateCount > 0) {
          setOcrStatus('duplicate');
        } else if (failedCount > 0) {
          setOcrStatus('failed');
        } else {
          setOcrStatus('complete');
        }
      }
    } catch (error) {
      console.error('Failed to upload screenshots:', error);
      setShowAnalyzingModal(false);
      // Mark files as error
      setUploadedFiles((prev) =>
        prev.map((f) => (f.status === 'uploading' ? { ...f, status: 'error' as const, error: t('errors.uploadFailed') } : f))
      );
      setOcrStatus('failed');
      alert(t('errors.uploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      {/* Header */}
      <div className="upload-header">
        <h1 className="sessions-header-title">{t('title')}</h1>
        <p className="sessions-header-subtitle">
          {t('subtitle')}
        </p>
      </div>

      {/* Single Column Layout */}
      <div className="upload-container">
        <div className="card" style={{ padding: '28px', maxWidth: '720px', margin: '0 auto' }}>
          <div className="upload-section-header">
            <h2 className="upload-section-title">
              <Camera style={{ width: '24px', height: '24px', color: '#F72585' }} />
              {t('screenshotUpload')}
            </h2>
            <div className="upload-xp-badge">
              <span className="upload-xp-badge-text">{t('xpReward')}</span>
            </div>
          </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`upload-drop-zone ${isDragging ? 'dragging' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleFiles(e.target.files);
                  }
                  // 같은 파일 다시 선택 가능하도록 초기화
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
              <div className="upload-drop-zone-icon">
                <Upload style={{ width: '32px', height: '32px', color: '#F72585' }} />
              </div>
              <p className="upload-drop-zone-title">
                {t('dropzone.title')}
              </p>
              <p className="upload-drop-zone-subtitle">
                {t('dropzone.subtitle')}
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div className="upload-file-list-header">
                  <span className="upload-file-count">
                    {t('uploadedFiles', { current: uploadedFiles.length })}
                  </span>
                  <button
                    onClick={() => {
                      uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
                      setUploadedFiles([]);
                      setOcrStatus('idle');
                    }}
                    className="upload-clear-btn"
                  >
                    {t('clearAll')}
                  </button>
                </div>
                <div className="upload-file-grid">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`upload-file-item ${
                        file.status === 'error'
                          ? 'error'
                          : file.status === 'success'
                          ? 'success'
                          : file.status === 'duplicate'
                          ? 'duplicate'
                          : ''
                      }`}
                    >
                      <img
                        src={file.preview}
                        alt={`Preview ${index}`}
                      />
                      {/* Status Overlay */}
                      {file.status !== 'pending' && (
                        <div className="upload-file-overlay">
                          {file.status === 'uploading' && (
                            <Loader2 style={{ width: '24px', height: '24px', color: '#F72585', animation: 'spin 1s linear infinite' }} />
                          )}
                          {file.status === 'success' && (
                            <CheckCircle style={{ width: '24px', height: '24px', color: '#10B981' }} />
                          )}
                          {file.status === 'error' && (
                            <AlertCircle style={{ width: '24px', height: '24px', color: '#EF4444' }} />
                          )}
                          {file.status === 'duplicate' && (
                            <AlertCircle style={{ width: '24px', height: '24px', color: '#F59E0B' }} />
                          )}
                        </div>
                      )}
                      {/* Remove Button */}
                      {file.status !== 'uploading' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="upload-file-remove"
                        >
                          <X style={{ width: '12px', height: '12px', color: 'white' }} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Button */}
            {uploadedFiles.some((f) => f.status === 'pending') && (
              <button
                onClick={processScreenshots}
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    {t('processBtn.processing')}
                  </>
                ) : (
                  <>
                    <Upload style={{ width: '18px', height: '18px' }} />
                    {t('processBtn.analyze')}
                  </>
                )}
              </button>
            )}

            {/* OCR Status */}
            {ocrStatus !== 'idle' && (
              <div className={`upload-ocr-status ${ocrStatus}`}>
                {ocrStatus === 'processing' && <Loader2 style={{ width: '16px', height: '16px', color: '#F72585', animation: 'spin 1s linear infinite' }} />}
                {ocrStatus === 'complete' && <CheckCircle style={{ width: '16px', height: '16px', color: '#10B981' }} />}
                {ocrStatus === 'failed' && <AlertCircle style={{ width: '16px', height: '16px', color: '#EF4444' }} />}
                {ocrStatus === 'duplicate' && <AlertCircle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />}
                <span className={`upload-ocr-status-text ${ocrStatus}`}>
                  {ocrStatus === 'processing' && t('ocrStatus.processing')}
                  {ocrStatus === 'complete' && t('ocrStatus.complete')}
                  {ocrStatus === 'failed' && t('ocrStatus.failed')}
                  {ocrStatus === 'duplicate' && t('ocrStatus.duplicate')}
                </span>
              </div>
            )}

            {/* Divider with OR */}
            <div className="upload-divider">
              <span className="upload-divider-text">{t('or') || 'OR'}</span>
            </div>

            {/* Manual Entry Button */}
            <button
              onClick={() => {
                // 빈 레코드로 모달 열기
                setExtractedRecords([{
                  gameType: 'cash',
                  date: new Date().toISOString().split('T')[0],
                  venue: '',
                  stakes: '',
                  startTime: '',
                  hands: 0,
                  profit: 0,
                  buyIn: 0,
                  cashOut: 0,
                  durationMinutes: 120,
                }]);
                setShowResultsModal(true);
              }}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                gap: '8px',
              }}
            >
              <Edit3 style={{ width: '18px', height: '18px' }} />
              {t('manualEntry') || '수동으로 기록 입력'}
            </button>

            {/* Inline Guide - Compact */}
            <div className="upload-guide-inline">
              <div className="upload-guide-row">
                <span className="upload-guide-label">{t('guide.fileFormat.title')}</span>
                <div className="upload-guide-tags">
                  {(t.raw('guide.fileFormat.formats') as string[]).map((format, idx) => (
                    <span key={idx} className="upload-guide-tag">{format}</span>
                  ))}
                  <span className="upload-guide-tag secondary">{t('guide.fileFormat.maxSize')}</span>
                  <span className="upload-guide-tag secondary">{t('guide.fileFormat.maxFiles')}</span>
                </div>
              </div>
              <div className="upload-guide-row">
                <span className="upload-guide-label">{t('guide.platforms.title')}</span>
                <div className="upload-guide-tags">
                  {(t.raw('guide.platforms.list') as string[]).map((platform, idx) => (
                    <span key={idx} className="upload-guide-tag">{platform}</span>
                  ))}
                </div>
              </div>
              <div className="upload-guide-row">
                <span className="upload-guide-label green">{t('guide.bestPractices.title')}</span>
                <div className="upload-guide-items">
                  {(t.raw('guide.bestPractices.good') as string[]).map((item, idx) => (
                    <span key={idx} className="upload-guide-item-inline">
                      <CheckCircle style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} />{item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* 분석 중 모달 (광고 공간 포함) */}
      {showAnalyzingModal && (
        <div className="modal-overlay">
          <div className="modal-content analyzing-modal">
            <div className="analyzing-header">
              <Loader2 className="analyzing-spinner" style={{ color: '#F72585' }} />
              <h2 className="analyzing-title">{t('modal.analyzing.title')}</h2>
              <p className="analyzing-subtitle">{t('modal.analyzing.subtitle')}</p>
            </div>

            {/* 광고 공간 - 나중에 네이티브 광고 삽입 */}
            <div className="ad-placeholder">
              <span className="ad-placeholder-text">AD</span>
              <span className="ad-placeholder-subtext">광고 영역</span>
            </div>

            <div className="analyzing-progress">
              <div className="analyzing-progress-bar">
                <div className="analyzing-progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OCR 추출 완료 모달 - 깔끔한 디자인 */}
      {showResultsModal && (
        <div className="modal-overlay">
          <div className="modal-content results-modal-v2">
            {/* 헤더 */}
            <div className="results-modal-header">
              <div className="results-modal-title-row">
                <CheckCircle style={{ width: '32px', height: '32px', color: 'white' }} />
                <h2>{t('modal.results.title', { count: extractedRecords.length })}</h2>
              </div>
              <button
                className="results-modal-close"
                onClick={() => setShowResultsModal(false)}
              >
                <X style={{ width: '24px', height: '24px', color: 'white' }} />
              </button>
            </div>

            {/* 경고 배너 */}
            <div className="results-modal-banner">
              <AlertCircle style={{ width: '22px', height: '22px', color: '#FBBF24' }} />
              <span>{t('modal.results.warning')}</span>
            </div>

            {/* 스크롤 가능한 바디 */}
            <div className="results-modal-body">
              {/* 수정 가능한 폼 */}
              {extractedRecords.map((record, idx) => (
              <div key={idx} className="results-form-card">
                {/* 게임 타입 선택 */}
                <div className="results-form-row">
                  <div className="results-form-type-group">
                    <button
                      type="button"
                      className={`results-form-type-btn ${record.gameType === 'cash' ? 'active cash' : ''}`}
                      onClick={() => {
                        const updated = [...extractedRecords];
                        updated[idx] = { ...updated[idx], gameType: 'cash' };
                        setExtractedRecords(updated);
                      }}
                    >
                      💰 캐시게임
                    </button>
                    <button
                      type="button"
                      className={`results-form-type-btn ${record.gameType === 'tournament' ? 'active tournament' : ''}`}
                      onClick={() => {
                        const updated = [...extractedRecords];
                        updated[idx] = { ...updated[idx], gameType: 'tournament' };
                        setExtractedRecords(updated);
                      }}
                    >
                      🏆 토너먼트
                    </button>
                  </div>
                </div>

                {/* 2x2 그리드 - 기본 정보 */}
                <div className="results-form-grid-2">
                  <div className="results-form-field">
                    <label><span className="label-icon">📅</span> 날짜</label>
                    <input
                      type="date"
                      value={record.date}
                      onChange={(e) => {
                        const updated = [...extractedRecords];
                        updated[idx] = { ...updated[idx], date: e.target.value };
                        setExtractedRecords(updated);
                      }}
                    />
                  </div>
                  <div className="results-form-field">
                    <label><span className="label-icon">⏰</span> 시작 시간</label>
                    <input
                      type="time"
                      value={record.startTime?.split('T')[1]?.slice(0, 5) || ''}
                      onChange={(e) => {
                        const updated = [...extractedRecords];
                        const timeStr = e.target.value ? `${record.date}T${e.target.value}:00` : '';
                        updated[idx] = { ...updated[idx], startTime: timeStr };
                        setExtractedRecords(updated);
                      }}
                    />
                  </div>
                </div>

                <div className="results-form-grid-2">
                  <div className="results-form-field">
                    <label><span className="label-icon">🎮</span> 게임명/테이블</label>
                    <input
                      type="text"
                      value={record.venue}
                      placeholder="홀덤 피쉬"
                      onChange={(e) => {
                        const updated = [...extractedRecords];
                        updated[idx] = { ...updated[idx], venue: e.target.value };
                        setExtractedRecords(updated);
                      }}
                    />
                  </div>
                  <div className="results-form-field">
                    <label><span className="label-icon">💵</span> 스테이크</label>
                    <input
                      type="text"
                      value={record.stakes || ''}
                      placeholder="1000/2000"
                      onChange={(e) => {
                        const updated = [...extractedRecords];
                        updated[idx] = { ...updated[idx], stakes: e.target.value };
                        setExtractedRecords(updated);
                      }}
                    />
                  </div>
                </div>

                {/* 핸드 수 & 플레이 시간 */}
                <div className="results-form-grid-2">
                  <div className="results-form-field">
                    <label><span className="label-icon">🃏</span> 핸드 수</label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={record.hands || ''}
                        placeholder="0"
                        onChange={(e) => {
                          const updated = [...extractedRecords];
                          updated[idx] = { ...updated[idx], hands: parseInt(e.target.value) || 0 };
                          setExtractedRecords(updated);
                        }}
                      />
                      <span className="input-unit">회</span>
                    </div>
                  </div>
                  <div className="results-form-field">
                    <label><span className="label-icon">⏱️</span> 플레이 시간</label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={record.durationMinutes || ''}
                        placeholder="120"
                        onChange={(e) => {
                          const updated = [...extractedRecords];
                          updated[idx] = { ...updated[idx], durationMinutes: parseInt(e.target.value) || 0 };
                          setExtractedRecords(updated);
                        }}
                      />
                      <span className="input-unit">분</span>
                    </div>
                  </div>
                </div>

                {/* 금액 섹션 */}
                <div className="results-form-money-section">
                  {/* 바이인/캐시아웃 직접 입력 안내 */}
                  <div className="money-input-notice">
                    <span className="notice-icon">✍️</span>
                    <span>바이인/캐시아웃은 스크린샷에서 추출되지 않습니다. 직접 입력해주세요.</span>
                  </div>
                  <div className="results-form-grid-2">
                    <div className="results-form-field">
                      <label><span className="label-icon">💰</span> 바이인</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={record.buyIn ? record.buyIn.toLocaleString() : ''}
                        placeholder="직접 입력"
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, '');
                          const updated = [...extractedRecords];
                          updated[idx] = { ...updated[idx], buyIn: parseInt(value) || 0 };
                          setExtractedRecords(updated);
                        }}
                      />
                    </div>
                    <div className="results-form-field">
                      <label><span className="label-icon">💸</span> 캐시아웃</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={record.cashOut ? record.cashOut.toLocaleString() : ''}
                        placeholder="직접 입력"
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, '');
                          const updated = [...extractedRecords];
                          updated[idx] = { ...updated[idx], cashOut: parseInt(value) || 0 };
                          setExtractedRecords(updated);
                        }}
                      />
                    </div>
                  </div>

                  {/* 수익/손실 입력 */}
                  <div className="results-form-field profit-field">
                    <label>
                      <span className="label-icon">{(record.profit || 0) >= 0 ? '💎' : '💸'}</span>
                      {(record.profit || 0) >= 0 ? '수익' : '손실'} (클릭으로 +/- 전환)
                    </label>
                    <div className="profit-input-wrapper">
                      <button
                        type="button"
                        className={`profit-sign-btn ${(record.profit || 0) >= 0 ? 'positive' : 'negative'}`}
                        onClick={() => {
                          const updated = [...extractedRecords];
                          updated[idx] = { ...updated[idx], profit: -(record.profit || 0) };
                          setExtractedRecords(updated);
                        }}
                      >
                        {(record.profit || 0) >= 0 ? '+' : '−'}
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`profit-input ${(record.profit || 0) >= 0 ? 'positive' : 'negative'}`}
                        value={record.profit !== undefined ? Math.abs(record.profit).toLocaleString() : ''}
                        placeholder="250,000"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[,]/g, '');
                          const numValue = parseInt(value) || 0;
                          const updated = [...extractedRecords];
                          // 기존 부호 유지
                          const sign = (record.profit || 0) >= 0 ? 1 : -1;
                          updated[idx] = { ...updated[idx], profit: numValue * sign };
                          setExtractedRecords(updated);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* 액션 버튼 */}
            <div className="results-modal-actions">
              <button
                className="results-modal-btn primary"
                onClick={async () => {
                  if (extractedRecords.length === 0) return;

                  setLoading(true);
                  try {
                    const { sessionsApi, userApi } = await import('@/lib/api');

                    // 모든 레코드를 개별 세션으로 저장
                    for (const record of extractedRecords) {
                      // 백엔드는 profit = cashOut - buyIn 으로 계산함
                      // profit이 직접 입력된 경우, buyIn/cashOut을 역계산
                      let buyIn = record.buyIn ?? 0;
                      let cashOut = record.cashOut ?? 0;
                      const profit = record.profit ?? 0;

                      // profit이 입력되었고 buyIn/cashOut이 둘 다 0이면
                      if (profit !== 0 && buyIn === 0 && cashOut === 0) {
                        if (profit >= 0) {
                          // 수익: buyIn=0, cashOut=profit
                          cashOut = profit;
                        } else {
                          // 손실: buyIn=|profit|, cashOut=0
                          buyIn = Math.abs(profit);
                          cashOut = 0;
                        }
                      } else if (profit !== 0 && cashOut === 0) {
                        // buyIn은 있고 cashOut만 0인 경우
                        cashOut = buyIn + profit;
                      }

                      const sessionData = {
                        date: record.date || new Date().toISOString().split('T')[0],
                        venue: record.venue || '',
                        gameType: record.gameType || 'cash',
                        stakes: record.stakes || '',
                        buyIn: buyIn,
                        cashOut: cashOut,
                        hands: record.hands,
                        durationMinutes: record.durationMinutes || 120,
                        startTime: record.startTime || undefined,
                      };
                      await sessionsApi.create(sessionData);
                    }

                    // XP 지급
                    await userApi.addXp('manualRecord');

                    alert(`${extractedRecords.length}개의 세션이 저장되었습니다!`);
                    setShowResultsModal(false);
                    setExtractedRecords([]);
                    router.push('/app/sessions');
                  } catch (error: any) {
                    console.error('Failed to save sessions:', error);
                    // 409 Conflict = 중복 세션
                    if (error?.response?.status === 409 || error?.status === 409) {
                      alert('이미 등록된 세션입니다. 동일한 날짜, 장소, 게임타입, 스테이크의 세션이 존재합니다.');
                    } else {
                      alert('세션 저장에 실패했습니다.');
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '22px', height: '22px', color: 'white', animation: 'spin 1s linear infinite' }} />
                    저장 중...
                  </>
                ) : (
                  <>
                    <CheckCircle style={{ width: '22px', height: '22px', color: 'white' }} />
                    {extractedRecords.length}개 세션 모두 저장
                  </>
                )}
              </button>
              <button
                className="results-modal-btn secondary"
                onClick={() => {
                  setShowResultsModal(false);
                  setExtractedRecords([]);
                }}
                disabled={loading}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
