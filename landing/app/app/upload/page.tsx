'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, DollarSign, FileText, Loader2 } from 'lucide-react';
import type { GameType, CreateSessionDto } from '@/lib/types';

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateSessionDto>({
    date: new Date().toISOString().split('T')[0],
    venue: '',
    gameType: 'cash',
    stakes: '',
    durationMinutes: 120,
    buyIn: 0,
    cashOut: 0,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { sessionsApi } = await import('@/lib/api');
      await sessionsApi.create(formData);
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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>새 세션 기록</h1>
        <p style={{ color: '#71717A' }}>포커 세션 정보를 입력하세요</p>
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
          <div>
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
  );
}
