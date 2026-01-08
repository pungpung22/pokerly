'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, LogOut, User } from 'lucide-react';
import { auth, logOut } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#71717A' }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B' }}>
      {/* Header */}
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #27272A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <BarChart3 style={{ width: '32px', height: '32px', color: '#6366F1' }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
              ) : (
                <User style={{ width: '32px', height: '32px', color: '#71717A' }} />
              )}
              <span style={{ color: 'white', fontSize: '14px' }}>{user?.displayName || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #27272A',
                borderRadius: '8px',
                color: '#71717A',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
          안녕하세요, {user?.displayName?.split(' ')[0] || '플레이어'}님!
        </h1>
        <p style={{ color: '#71717A', marginBottom: '48px' }}>
          Pokerly에 오신 것을 환영합니다.
        </p>

        {/* Empty state */}
        <div style={{
          background: '#141416',
          border: '1px solid #27272A',
          borderRadius: '16px',
          padding: '64px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <BarChart3 style={{ width: '32px', height: '32px', color: '#6366F1' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            아직 기록이 없습니다
          </h2>
          <p style={{ color: '#71717A', marginBottom: '24px' }}>
            첫 번째 포커 세션을 기록해보세요!
          </p>
          <p style={{ color: '#71717A', fontSize: '14px' }}>
            모바일 앱을 다운로드하여 스크린샷으로 쉽게 기록하세요.
          </p>
        </div>
      </main>
    </div>
  );
}
