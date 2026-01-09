'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  Loader2,
  Hash,
  Users,
  ChevronDown,
  ChevronUp,
  Upload,
  Image,
  X,
  Camera,
  Edit3,
  HelpCircle,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { GameType, CreateSessionDto, PlayerLevel } from '@/lib/types';
import { userApi, uploadsApi } from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';

interface UploadedFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: CreateSessionDto;
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const t = useTranslations('Upload');
  const tTypes = useTranslations('Types');
  const tUnits = useTranslations('Units');
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'complete' | 'failed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateSessionDto>({
    date: new Date().toISOString().split('T')[0],
    venue: '',
    gameType: 'cash',
    stakes: '',
    durationMinutes: 120,
    buyIn: 0,
    cashOut: 0,
    notes: '',
    startTime: '',
    tableId: '',
    hands: 0,
    level: undefined,
    blinds: '',
  });

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
            const apiStatus = result.results[resultIndex].status;
            return {
              ...f,
              status: apiStatus === 'success' || apiStatus === 'pending_ocr' ? 'success' as const : 'error' as const,
            };
          }
          return f;
        })
      );

      // Award XP for screenshot upload
      await userApi.addXp('uploadScreenshot');

      // OCR 결과가 있으면 폼에 자동 입력
      const successResult = result.results.find(
        (r) => r.extractedData
      );

      if (successResult?.extractedData) {
        const data = successResult.extractedData;
        setFormData((prev) => ({
          ...prev,
          date: data.date || prev.date,
          venue: data.venue || prev.venue,
          gameType: data.gameType || prev.gameType,
          stakes: data.stakes || prev.stakes,
          durationMinutes: data.playTime || prev.durationMinutes,
          buyIn: data.buyIn || prev.buyIn,
          cashOut: data.cashOut || prev.cashOut,
          tableId: data.tableId || prev.tableId,
          hands: data.hands || prev.hands,
        }));
        setOcrStatus('complete');
      } else {
        // OCR 실패 또는 데이터 없음
        const failedCount = result.results.filter(
          (r: { status: string }) => r.status === 'ocr_failed'
        ).length;
        if (failedCount > 0) {
          setOcrStatus('failed');
        } else {
          setOcrStatus('complete');
        }
      }
    } catch (error) {
      console.error('Failed to upload screenshots:', error);
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

  // Manual entry submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { sessionsApi, userApi } = await import('@/lib/api');
      // 빈 문자열을 undefined로 변환하여 API 전송
      const submitData = {
        ...formData,
        startTime: formData.startTime || undefined,
        tableId: formData.tableId || undefined,
        blinds: formData.blinds || undefined,
        notes: formData.notes || undefined,
        hands: formData.hands || undefined,
      };
      await sessionsApi.create(submitData);
      // Award XP for manual record
      await userApi.addXp('manualRecord');
      router.push('/app/sessions');
    } catch (error) {
      console.error('Failed to create session:', error);
      alert(t('errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const profit = formData.cashOut - formData.buyIn;

  return (
    <div className="app-page">
      {/* Header */}
      <div className="upload-header">
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">
          {t('subtitle')}
        </p>
      </div>

      {/* Two Column Layout - responsive */}
      <div className="upload-grid">
        {/* Left Column - Screenshot Upload */}
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <div className="upload-section-header">
              <h2 className="upload-section-title">
                <Camera style={{ width: '20px', height: '20px', color: '#F72585' }} />
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
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                style={{ display: 'none' }}
              />
              <div className="upload-drop-zone-icon">
                <Upload style={{ width: '24px', height: '24px', color: '#F72585' }} />
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
                <span className={`upload-ocr-status-text ${ocrStatus}`}>
                  {ocrStatus === 'processing' && t('ocrStatus.processing')}
                  {ocrStatus === 'complete' && t('ocrStatus.complete')}
                  {ocrStatus === 'failed' && t('ocrStatus.failed')}
                </span>
              </div>
            )}

            {/* Guide Section */}
            <div className="upload-guide-section">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="upload-guide-toggle"
              >
                <div className="upload-guide-title">
                  <HelpCircle style={{ width: '16px', height: '16px', color: '#F72585' }} />
                  <span className="upload-guide-title-text">{t('guide.title')}</span>
                </div>
                {showGuide ? (
                  <ChevronUp style={{ width: '16px', height: '16px', color: '#A1A1AA' }} />
                ) : (
                  <ChevronDown style={{ width: '16px', height: '16px', color: '#A1A1AA' }} />
                )}
              </button>

              {showGuide && (
                <div className="upload-guide-content">
                  <ul className="upload-guide-list">
                    {[
                      t('guide.tip1'),
                      t('guide.tip2'),
                      t('guide.tip3'),
                    ].map((tip, idx) => (
                      <li key={idx} className="upload-guide-item">
                        <CheckCircle style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                        <span className="upload-guide-item-text">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <div className="upload-section-header">
              <h2 className="upload-section-title">
                <Edit3 style={{ width: '20px', height: '20px', color: '#F72585' }} />
                {t('form.title')}
              </h2>
              <div className="upload-xp-badge">
                <span className="upload-xp-badge-text">{t('form.xpReward')}</span>
                <span className="upload-xp-badge-label">{t('form.manualRecord')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Date & Game Type Row */}
              <div className="upload-form-grid-2">
                <div>
                  <label className="upload-form-label">
                    <Calendar style={{ width: '14px', height: '14px' }} />
                    {t('form.date')}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="upload-form-input"
                  />
                </div>
                <div>
                  <label className="upload-form-label-block">
                    {t('form.gameType')}
                  </label>
                  <div className="upload-form-btn-group">
                    {(['cash', 'tournament'] as GameType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, gameType: type })}
                        className={`upload-form-btn ${formData.gameType === type ? 'active' : ''}`}
                      >
                        {tTypes(`gameTypes.${type}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Venue & Stakes Row */}
              <div className="upload-form-grid-2">
                <div>
                  <label className="upload-form-label">
                    <MapPin style={{ width: '14px', height: '14px' }} />
                    {t('form.venue')}
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder={formData.gameType === 'cash' ? t('form.venuePlaceholder.cash') : t('form.venuePlaceholder.tournament')}
                    required
                    className="upload-form-input"
                  />
                </div>
                <div>
                  <label className="upload-form-label-block">
                    {formData.gameType === 'cash' ? t('form.stakes') : t('form.buyinLevel')}
                  </label>
                  <input
                    type="text"
                    value={formData.stakes}
                    onChange={(e) => setFormData({ ...formData, stakes: e.target.value })}
                    placeholder={formData.gameType === 'cash' ? t('form.stakesPlaceholder') : t('form.buyinLevelPlaceholder')}
                    required
                    className="upload-form-input"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="upload-form-field">
                <label className="upload-form-label">
                  <Clock style={{ width: '14px', height: '14px' }} />
                  {t('form.duration')}
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                  min="1"
                  required
                  className="upload-form-input"
                />
              </div>

              {/* Buy-in & Cash-out */}
              <div className="upload-form-grid-2">
                <div>
                  <label className="upload-form-label">
                    <DollarSign style={{ width: '14px', height: '14px' }} />
                    {t('form.buyIn')}
                  </label>
                  <input
                    type="number"
                    value={formData.buyIn || ''}
                    onChange={(e) => setFormData({ ...formData, buyIn: parseInt(e.target.value) || 0 })}
                    placeholder={t('form.buyInPlaceholder')}
                    min="0"
                    required
                    className="upload-form-input"
                  />
                </div>
                <div>
                  <label className="upload-form-label">
                    <DollarSign style={{ width: '14px', height: '14px' }} />
                    {t('form.cashOut')}
                  </label>
                  <input
                    type="number"
                    value={formData.cashOut || ''}
                    onChange={(e) => setFormData({ ...formData, cashOut: parseInt(e.target.value) || 0 })}
                    placeholder={t('form.cashOutPlaceholder')}
                    min="0"
                    required
                    className="upload-form-input"
                  />
                </div>
              </div>

              {/* Profit Preview */}
              {(formData.buyIn > 0 || formData.cashOut > 0) && (
                <div className={`upload-profit-preview ${profit >= 0 ? 'positive' : 'negative'}`}>
                  <span className="upload-profit-label">{t('form.estimatedProfit')}</span>
                  <span className={`upload-profit-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                    {profit >= 0 ? '+' : ''}{profit.toLocaleString()}{locale === 'ko' ? tUnits('won') : locale === 'ja' ? '¥' : '$'}
                  </span>
                </div>
              )}

              {/* Notes */}
              <div className="upload-form-field">
                <label className="upload-form-label">
                  <FileText style={{ width: '14px', height: '14px' }} />
                  {t('form.notes')}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('form.notesPlaceholder')}
                  rows={2}
                  className="upload-form-textarea"
                />
              </div>

              {/* Advanced Options Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="upload-advanced-toggle"
              >
                {showAdvanced ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
                {showAdvanced ? t('form.advanced.collapse') : t('form.advanced.expand')}
              </button>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="upload-advanced-section">
                  {/* Start Time & Table ID */}
                  <div className="upload-form-grid-2">
                    <div>
                      <label className="upload-form-label">
                        <Clock style={{ width: '14px', height: '14px' }} />
                        {t('form.advanced.startTime')}
                      </label>
                      <input
                        type="time"
                        value={formData.startTime?.split('T')[1]?.slice(0, 5) || ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            const dateTimeStr = `${formData.date}T${e.target.value}:00`;
                            setFormData({ ...formData, startTime: dateTimeStr });
                          } else {
                            setFormData({ ...formData, startTime: '' });
                          }
                        }}
                        className="upload-form-input"
                      />
                    </div>
                    <div>
                      <label className="upload-form-label">
                        <Hash style={{ width: '14px', height: '14px' }} />
                        {t('form.advanced.tableId')}
                      </label>
                      <input
                        type="text"
                        value={formData.tableId || ''}
                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                        placeholder="T14"
                        className="upload-form-input"
                      />
                    </div>
                  </div>

                  {/* Hands & Blinds */}
                  <div className="upload-form-grid-2">
                    <div>
                      <label className="upload-form-label">
                        <Hash style={{ width: '14px', height: '14px' }} />
                        {t('form.advanced.hands')}
                      </label>
                      <input
                        type="number"
                        value={formData.hands || ''}
                        onChange={(e) => setFormData({ ...formData, hands: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="upload-form-input"
                      />
                    </div>
                    <div>
                      <label className="upload-form-label-block">
                        {t('form.advanced.blinds')}
                      </label>
                      <input
                        type="text"
                        value={formData.blinds || ''}
                        onChange={(e) => setFormData({ ...formData, blinds: e.target.value })}
                        placeholder="1000/2000"
                        className="upload-form-input"
                      />
                    </div>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="upload-form-label">
                      <Users style={{ width: '14px', height: '14px' }} />
                      {t('form.advanced.tableLevel')}
                    </label>
                    <div className="upload-level-btn-group">
                      {(['beginner', 'intermediate', 'advanced', 'pro'] as PlayerLevel[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, level: formData.level === level ? undefined : level })}
                          className={`upload-level-btn ${formData.level === level ? 'active' : ''}`}
                        >
                          {tTypes(`playerLevels.${level}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary upload-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    {t('form.saving')}
                  </>
                ) : (
                  t('form.submit')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
