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
import { playerLevelLabels } from '@/lib/types';
import { userApi, uploadsApi } from '@/lib/api';

type TabType = 'screenshot' | 'manual';

interface UploadedFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: CreateSessionDto;
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('screenshot');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
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
      return 'PNG, JPG, JPEG, WEBP 파일만 업로드 가능합니다.';
    }
    if (file.size > maxSize) {
      return '파일 크기는 3MB 이하여야 합니다.';
    }
    return null;
  };

  // Handle file selection
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = 5 - uploadedFiles.length;

    if (fileArray.length > remainingSlots) {
      alert(`최대 5개까지 업로드 가능합니다. 현재 ${remainingSlots}개만 추가됩니다.`);
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
            return {
              ...f,
              status: result.results[resultIndex].status === 'pending_ocr' ? 'success' as const : 'success' as const,
            };
          }
          return f;
        })
      );

      // Award XP for screenshot upload
      await userApi.addXp('uploadScreenshot');

      alert('스크린샷이 업로드되었습니다. OCR 기능은 추후 업데이트될 예정입니다.');
    } catch (error) {
      console.error('Failed to upload screenshots:', error);
      // Mark files as error
      setUploadedFiles((prev) =>
        prev.map((f) => (f.status === 'uploading' ? { ...f, status: 'error' as const, error: '업로드 실패' } : f))
      );
      alert('스크린샷 업로드에 실패했습니다. 다시 시도해주세요.');
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
      await sessionsApi.create(formData);
      // Award XP for manual record
      await userApi.addXp('manualRecord');
      router.push('/app/sessions');
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('세션 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const profit = formData.cashOut - formData.buyIn;

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>업로드</h1>
        <p style={{ color: '#71717A' }}>스크린샷 또는 수동으로 세션을 기록하세요</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('screenshot')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            background: activeTab === 'screenshot' ? 'rgba(99, 102, 241, 0.2)' : '#141416',
            border: `1px solid ${activeTab === 'screenshot' ? '#6366F1' : '#27272A'}`,
            borderRadius: '12px',
            color: activeTab === 'screenshot' ? '#6366F1' : '#71717A',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: activeTab === 'screenshot' ? 600 : 400,
            transition: 'all 0.2s',
          }}
        >
          <Camera style={{ width: '18px', height: '18px' }} />
          스크린샷 업로드
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            background: activeTab === 'manual' ? 'rgba(99, 102, 241, 0.2)' : '#141416',
            border: `1px solid ${activeTab === 'manual' ? '#6366F1' : '#27272A'}`,
            borderRadius: '12px',
            color: activeTab === 'manual' ? '#6366F1' : '#71717A',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: activeTab === 'manual' ? 600 : 400,
            transition: 'all 0.2s',
          }}
        >
          <Edit3 style={{ width: '18px', height: '18px' }} />
          수동 기록
        </button>
      </div>

      {/* Screenshot Upload Tab */}
      {activeTab === 'screenshot' && (
        <div>
          {/* XP Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(99, 102, 241, 0.15)',
              borderRadius: '20px',
              marginBottom: '20px',
            }}
          >
            <span style={{ color: '#6366F1', fontSize: '13px', fontWeight: 500 }}>+100 XP</span>
            <span style={{ color: '#71717A', fontSize: '12px' }}>스크린샷 업로드 시</span>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '40px 24px',
              background: isDragging ? 'rgba(99, 102, 241, 0.1)' : '#141416',
              border: `2px dashed ${isDragging ? '#6366F1' : '#27272A'}`,
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              marginBottom: '20px',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Upload style={{ width: '28px', height: '28px', color: '#6366F1' }} />
            </div>
            <p style={{ color: 'white', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
              이미지를 드래그하거나 클릭하여 선택
            </p>
            <p style={{ color: '#71717A', fontSize: '13px' }}>
              PNG, JPG, JPEG, WEBP / 최대 3MB / 한 번에 최대 5개
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#71717A', fontSize: '14px' }}>
                  업로드된 파일 ({uploadedFiles.length}/5)
                </span>
                <button
                  onClick={() => {
                    uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
                    setUploadedFiles([]);
                  }}
                  style={{
                    color: '#EF4444',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  전체 삭제
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `1px solid ${
                        file.status === 'error'
                          ? '#EF4444'
                          : file.status === 'success'
                          ? '#10B981'
                          : '#27272A'
                      }`,
                    }}
                  >
                    <img
                      src={file.preview}
                      alt={`Preview ${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Status Overlay */}
                    {file.status !== 'pending' && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0, 0, 0, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {file.status === 'uploading' && (
                          <Loader2 style={{ width: '24px', height: '24px', color: '#6366F1', animation: 'spin 1s linear infinite' }} />
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
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X style={{ width: '14px', height: '14px', color: 'white' }} />
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
                padding: '16px',
                marginBottom: '24px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                  처리 중...
                </>
              ) : (
                <>
                  <Upload style={{ width: '18px', height: '18px' }} />
                  스크린샷 처리하기
                </>
              )}
            </button>
          )}

          {/* Guide Section */}
          <div className="card">
            <button
              onClick={() => setShowGuide(!showGuide)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HelpCircle style={{ width: '20px', height: '20px', color: '#6366F1' }} />
                <span style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>스크린샷 가이드</span>
              </div>
              {showGuide ? (
                <ChevronUp style={{ width: '20px', height: '20px', color: '#71717A' }} />
              ) : (
                <ChevronDown style={{ width: '20px', height: '20px', color: '#71717A' }} />
              )}
            </button>

            {showGuide && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #27272A' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                    올바른 스크린샷 예시
                  </h4>
                  <div
                    style={{
                      padding: '24px',
                      background: '#0A0A0B',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '200px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #475569',
                      }}
                    >
                      <Image style={{ width: '32px', height: '32px', color: '#64748B', marginBottom: '8px' }} />
                      <span style={{ color: '#94A3B8', fontSize: '12px' }}>결과 화면 캡처</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                    스크린샷 촬영 팁
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      '게임 종료 후 결과 화면을 캡처하세요',
                      '바이인, 캐시아웃 금액이 보이도록 촬영하세요',
                      '테이블 ID, 플레이 시간이 포함되면 좋습니다',
                      '화면이 잘리지 않도록 전체를 캡처하세요',
                    ].map((tip, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: '#A1A1AA', fontSize: '14px' }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <div>
          {/* XP Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(99, 102, 241, 0.15)',
              borderRadius: '20px',
              marginBottom: '20px',
            }}
          >
            <span style={{ color: '#6366F1', fontSize: '13px', fontWeight: 500 }}>+10 XP</span>
            <span style={{ color: '#71717A', fontSize: '12px' }}>수동 기록 시 (일 100 XP 제한)</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card" style={{ marginBottom: '24px' }}>
              {/* Date */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  날짜
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
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

              {/* Game Type */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                  게임 유형
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {(['cash', 'tournament'] as GameType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, gameType: type })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: formData.gameType === type ? 'rgba(99, 102, 241, 0.2)' : '#0A0A0B',
                        border: `1px solid ${formData.gameType === type ? '#6366F1' : '#27272A'}`,
                        borderRadius: '8px',
                        color: formData.gameType === type ? '#6366F1' : '#71717A',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: formData.gameType === type ? 500 : 400,
                      }}
                    >
                      {type === 'cash' ? '캐시게임' : '토너먼트'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                  <MapPin style={{ width: '16px', height: '16px' }} />
                  장소 / 테이블
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder={formData.gameType === 'cash' ? 'Table #14' : 'Sunday Million'}
                  required
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

              {/* Stakes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                  {formData.gameType === 'cash' ? '스테이크' : '바이인 레벨'}
                </label>
                <input
                  type="text"
                  value={formData.stakes}
                  onChange={(e) => setFormData({ ...formData, stakes: e.target.value })}
                  placeholder={formData.gameType === 'cash' ? 'NL200' : '500K'}
                  required
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

              {/* Duration */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                  <Clock style={{ width: '16px', height: '16px' }} />
                  플레이 시간 (분)
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                  min="1"
                  required
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

              {/* Buy-in & Cash-out */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                    <DollarSign style={{ width: '16px', height: '16px' }} />
                    바이인 (원)
                  </label>
                  <input
                    type="number"
                    value={formData.buyIn || ''}
                    onChange={(e) => setFormData({ ...formData, buyIn: parseInt(e.target.value) || 0 })}
                    placeholder="500000"
                    min="0"
                    required
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
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                    <DollarSign style={{ width: '16px', height: '16px' }} />
                    캐시아웃 (원)
                  </label>
                  <input
                    type="number"
                    value={formData.cashOut || ''}
                    onChange={(e) => setFormData({ ...formData, cashOut: parseInt(e.target.value) || 0 })}
                    placeholder="892000"
                    min="0"
                    required
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
              </div>

              {/* Profit Preview */}
              {(formData.buyIn > 0 || formData.cashOut > 0) && (
                <div style={{
                  padding: '16px',
                  background: profit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}>
                  <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '4px' }}>예상 수익</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: profit >= 0 ? '#10B981' : '#EF4444' }}>
                    {profit >= 0 ? '+' : ''}{profit.toLocaleString()}원
                  </p>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                  <FileText style={{ width: '16px', height: '16px' }} />
                  메모 (선택)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="특이사항이나 메모를 남겨보세요..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#0A0A0B',
                    border: '1px solid #27272A',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Advanced Options Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6366F1',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '8px 0',
                }}
              >
                {showAdvanced ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
                상세 정보 {showAdvanced ? '접기' : '펼치기'}
              </button>

              {/* Advanced Options */}
              {showAdvanced && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #27272A' }}>
                  {/* Start Time */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                      <Clock style={{ width: '16px', height: '16px' }} />
                      시작 시간 (선택)
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

                  {/* Table ID & Hands */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                        <Hash style={{ width: '16px', height: '16px' }} />
                        테이블 ID (선택)
                      </label>
                      <input
                        type="text"
                        value={formData.tableId || ''}
                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                        placeholder="T14"
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
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                        <Hash style={{ width: '16px', height: '16px' }} />
                        핸드 수 (선택)
                      </label>
                      <input
                        type="number"
                        value={formData.hands || ''}
                        onChange={(e) => setFormData({ ...formData, hands: parseInt(e.target.value) || 0 })}
                        placeholder="0"
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
                  </div>

                  {/* Level */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                      <Users style={{ width: '16px', height: '16px' }} />
                      테이블 레벨 (선택)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(Object.keys(playerLevelLabels) as PlayerLevel[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, level: formData.level === level ? undefined : level })}
                          style={{
                            padding: '8px 14px',
                            background: formData.level === level ? 'rgba(99, 102, 241, 0.2)' : '#0A0A0B',
                            border: `1px solid ${formData.level === level ? '#6366F1' : '#27272A'}`,
                            borderRadius: '6px',
                            color: formData.level === level ? '#6366F1' : '#71717A',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          {playerLevelLabels[level]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blinds */}
                  <div>
                    <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                      블라인드 (선택)
                    </label>
                    <input
                      type="text"
                      value={formData.blinds || ''}
                      onChange={(e) => setFormData({ ...formData, blinds: e.target.value })}
                      placeholder="1000/2000"
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
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '16px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                  저장 중...
                </>
              ) : (
                '세션 저장하기'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
