'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Bell, Moon, Globe, Mail, Shield, LogOut, ChevronRight, ExternalLink, DollarSign, Hash, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

type Currency = 'KRW' | 'USD' | 'JPY';

const currencyLabels: Record<Currency, string> = {
  KRW: '원 (KRW)',
  USD: '달러 (USD)',
  JPY: '엔 (JPY)',
};

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('ko');

  // 표시 설정
  const [useKoreanUnit, setUseKoreanUnit] = useState(false);
  const [roundToTenThousand, setRoundToTenThousand] = useState(false);
  const [currency, setCurrency] = useState<Currency>('KRW');

  // 회원 탈퇴
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // localStorage에서 설정 로드
  useEffect(() => {
    const savedSettings = localStorage.getItem('pokerly_display_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setUseKoreanUnit(settings.useKoreanUnit ?? false);
        setRoundToTenThousand(settings.roundToTenThousand ?? false);
        setCurrency(settings.currency ?? 'KRW');
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // 설정 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('pokerly_display_settings', JSON.stringify({
      useKoreanUnit,
      roundToTenThousand,
      currency,
    }));
  }, [useKoreanUnit, roundToTenThousand, currency]);

  const handleSignOut = async () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      await signOut();
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== '회원탈퇴') {
      alert('"회원탈퇴"를 정확히 입력해주세요.');
      return;
    }

    setDeleting(true);
    try {
      // TODO: 백엔드 API 호출하여 계정 삭제
      // await userApi.deleteAccount();

      // 로컬 데이터 삭제
      localStorage.removeItem('pokerly_display_settings');
      localStorage.removeItem('pokerly_welcome_banner_dismissed');

      await signOut();
      alert('계정이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('계정 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>설정</h1>
        <p style={{ color: '#71717A' }}>계정 및 앱 설정을 관리하세요</p>
      </div>

      {/* Profile Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User style={{ width: '18px', height: '18px', color: '#6366F1' }} />
          프로필
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#0A0A0B', borderRadius: '12px' }}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{ width: '64px', height: '64px', borderRadius: '50%' }}
            />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>
              {user?.displayName || '사용자'}
            </p>
            <p style={{ color: '#71717A', fontSize: '14px' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>앱 설정</h2>

        {/* Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>알림</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>푸시 알림 받기</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: notifications ? '#6366F1' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: notifications ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Dark Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Moon style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>다크 모드</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>어두운 테마 사용</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: darkMode ? '#6366F1' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: darkMode ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>언어</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>앱 표시 언어</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '8px 12px',
              background: '#0A0A0B',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign style={{ width: '18px', height: '18px', color: '#6366F1' }} />
          표시 설정
        </h2>

        {/* Korean Unit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Hash style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>한글 단위 표기</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>금액을 "1억 1200만" 형식으로 표시</p>
            </div>
          </div>
          <button
            onClick={() => setUseKoreanUnit(!useKoreanUnit)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: useKoreanUnit ? '#6366F1' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: useKoreanUnit ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Round to Ten Thousand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Hash style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>만 단위 반올림</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>금액을 만의 자리까지 표시</p>
            </div>
          </div>
          <button
            onClick={() => setRoundToTenThousand(!roundToTenThousand)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: roundToTenThousand ? '#6366F1' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: roundToTenThousand ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Currency */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <DollarSign style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>통화</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>금액 표시 단위</p>
            </div>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            style={{
              padding: '8px 12px',
              background: '#0A0A0B',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {(Object.keys(currencyLabels) as Currency[]).map((c) => (
              <option key={c} value={c}>{currencyLabels[c]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Support */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>지원</h2>

        <a
          href="mailto:pung0805@gmail.com"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>문의하기</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>pung0805@gmail.com</p>
            </div>
          </div>
          <ExternalLink style={{ width: '18px', height: '18px', color: '#71717A' }} />
        </a>

        <a
          href="#"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <p style={{ color: 'white', fontWeight: 500 }}>개인정보처리방침</p>
          </div>
          <ChevronRight style={{ width: '18px', height: '18px', color: '#71717A' }} />
        </a>

        <a
          href="#"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield style={{ width: '20px', height: '20px', color: '#71717A' }} />
            <p style={{ color: 'white', fontWeight: 500 }}>서비스 이용약관</p>
          </div>
          <ChevronRight style={{ width: '18px', height: '18px', color: '#71717A' }} />
        </a>
      </div>

      {/* Account Management */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User style={{ width: '18px', height: '18px', color: '#6366F1' }} />
          계정 관리
        </h2>

        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Trash2 style={{ width: '20px', height: '20px', color: '#EF4444' }} />
            <div>
              <p style={{ color: '#EF4444', fontWeight: 500 }}>회원 탈퇴</p>
              <p style={{ color: '#71717A', fontSize: '13px' }}>계정 및 모든 데이터를 삭제합니다</p>
            </div>
          </div>
          <ChevronRight style={{ width: '18px', height: '18px', color: '#71717A' }} />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleSignOut}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          padding: '16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          borderRadius: '12px',
          color: '#EF4444',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        <LogOut style={{ width: '20px', height: '20px' }} />
        로그아웃
      </button>

      {/* App Version */}
      <p style={{ textAlign: 'center', color: '#71717A', fontSize: '13px', marginTop: '24px' }}>
        Pokerly v1.0.0 · 풍풍스튜디
      </p>

      {/* Delete Account Modal */}
      {showDeleteModal && (
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
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '400px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle style={{ width: '24px', height: '24px', color: '#EF4444' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>회원 탈퇴</h3>
                <p style={{ color: '#71717A', fontSize: '14px' }}>이 작업은 되돌릴 수 없습니다</p>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#EF4444', fontSize: '14px', lineHeight: 1.5 }}>
                회원 탈퇴 시 다음 데이터가 영구적으로 삭제됩니다:
              </p>
              <ul style={{ color: '#EF4444', fontSize: '14px', marginTop: '8px', paddingLeft: '20px' }}>
                <li>모든 세션 기록</li>
                <li>챌린지 및 업적</li>
                <li>계정 정보</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#71717A', fontSize: '14px', marginBottom: '8px' }}>
                확인을 위해 <span style={{ color: '#EF4444', fontWeight: 'bold' }}>"회원탈퇴"</span>를 입력하세요
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="회원탈퇴"
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
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
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== '회원탈퇴'}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: deleteConfirmText === '회원탈퇴' ? '#EF4444' : '#27272A',
                  border: 'none',
                  borderRadius: '8px',
                  color: deleteConfirmText === '회원탈퇴' ? 'white' : '#71717A',
                  cursor: deleteConfirmText === '회원탈퇴' ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    삭제 중...
                  </>
                ) : (
                  '탈퇴하기'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
