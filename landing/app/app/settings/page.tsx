'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Bell, Moon, Globe, Mail, Shield, LogOut, ChevronRight, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('ko');

  const handleSignOut = async () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      await signOut();
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
    </div>
  );
}
