'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  LayoutDashboard,
  History,
  TrendingUp,
  Upload,
  Settings,
  LogOut,
  Loader2,
  Menu,
  X,
  Trophy
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/app', icon: LayoutDashboard, label: '대시보드' },
  { href: '/app/sessions', icon: History, label: '세션 기록' },
  { href: '/app/challenges', icon: Trophy, label: '챌린지' },
  { href: '/app/analytics', icon: TrendingUp, label: '분석' },
  { href: '/app/upload', icon: Upload, label: '업로드' },
  { href: '/app/settings', icon: Settings, label: '설정' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', display: 'flex' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: '260px',
          background: '#141416',
          borderRight: '1px solid #27272A',
          display: 'none',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
        }}
        className="desktop-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #27272A' }}>
          <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <BarChart3 style={{ width: '32px', height: '32px', color: '#6366F1' }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive ? 'white' : '#71717A',
                      background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      fontWeight: isActive ? 500 : 400,
                      transition: 'all 0.2s',
                    }}
                  >
                    <item.icon style={{ width: '20px', height: '20px', color: isActive ? '#6366F1' : '#71717A' }} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div style={{ padding: '16px', borderTop: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
            )}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || '사용자'}
              </p>
              <p style={{ color: '#71717A', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: '#71717A',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: '#141416',
          borderBottom: '1px solid #27272A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 50,
        }}
        className="mobile-header"
      >
        <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <BarChart3 style={{ width: '28px', height: '28px', color: '#6366F1' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: '60px',
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 40,
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            style={{
              background: '#141416',
              borderBottom: '1px solid #27272A',
              padding: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: isActive ? 'white' : '#71717A',
                        background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      <item.icon style={{ width: '20px', height: '20px', color: isActive ? '#6366F1' : '#71717A' }} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                marginTop: '16px',
                padding: '14px 16px',
                background: 'transparent',
                border: '1px solid #27272A',
                borderRadius: '8px',
                color: '#71717A',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <LogOut style={{ width: '18px', height: '18px' }} />
              로그아웃
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="app-main" style={{ flex: 1, minHeight: '100vh' }}>
        {children}
      </main>

      <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-sidebar {
            display: flex !important;
          }
          .mobile-header {
            display: none !important;
          }
          .app-main {
            margin-left: 260px;
            padding-top: 0;
          }
        }
        @media (max-width: 767px) {
          .app-main {
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  );
}
