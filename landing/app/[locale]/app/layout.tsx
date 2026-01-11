'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Link } from '@/src/i18n/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from 'next-intl';
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
  Trophy,
  Star,
  Bell,
  MoreHorizontal,
  MessageSquare,
  Megaphone,
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Navigation items with translation keys
const navItemsConfig = [
  { href: '/app', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/app/sessions', icon: History, labelKey: 'sessions' },
  { href: '/app/challenges', icon: Trophy, labelKey: 'challenges' },
  { href: '/app/level', icon: Star, labelKey: 'level' },
  { href: '/app/analytics', icon: TrendingUp, labelKey: 'analytics' },
  { href: '/app/upload', icon: Upload, labelKey: 'upload' },
  { href: '/app/notices', icon: Megaphone, labelKey: 'notices' },
  { href: '/app/feedback', icon: MessageSquare, labelKey: 'feedback' },
  { href: '/app/settings', icon: Settings, labelKey: 'settings' },
];

// Bottom tab items with translation keys
const bottomTabItemsConfig = [
  { href: '/app', icon: LayoutDashboard, labelKey: 'home' },
  { href: '/app/challenges', icon: Trophy, labelKey: 'challenges' },
  { href: '/app/upload', icon: Upload, labelKey: 'upload' },
  { href: '/app/analytics', icon: TrendingUp, labelKey: 'analytics' },
  { href: '/app/more', icon: MoreHorizontal, labelKey: 'more' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const tSettings = useTranslations('Settings');

  // Create translated nav items
  const navItems = navItemsConfig.map(item => ({
    ...item,
    label: t(item.labelKey)
  }));

  const bottomTabItems = bottomTabItemsConfig.map(item => ({
    ...item,
    label: t(item.labelKey)
  }));

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Close more menu when pathname changes
  useEffect(() => {
    setShowMoreMenu(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Check if current page is in "more" menu
  const isMoreActive = ['/app/sessions', '/app/level', '/app/notices', '/app/feedback', '/app/settings'].some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#F72585', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ background: '#0A0A0B', display: 'flex' }}>
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid #27272A' }}>
          <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <BarChart3 style={{ width: '32px', height: '32px', color: '#F72585' }} />
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
                      color: isActive ? 'white' : '#D4D4D8',
                      background: isActive ? 'rgba(247, 37, 133, 0.2)' : 'transparent',
                      fontWeight: isActive ? 500 : 400,
                      transition: 'all 0.2s',
                    }}
                  >
                    <item.icon style={{ width: '20px', height: '20px', color: isActive ? '#F72585' : '#D4D4D8' }} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div style={{ padding: '16px', borderTop: '1px solid #27272A' }}>
          <Link href="/app/level" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', textDecoration: 'none' }}>
            <div style={{ position: 'relative' }}>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F72585', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                </div>
              )}
              {/* Level Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F72585 0%, #FF4EA3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '2px solid #141416',
                }}
              >
                <Star style={{ width: '10px', height: '10px' }} />
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || tSettings('user')}
              </p>
              <p style={{ color: '#D4D4D8', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
          </Link>
          <div style={{ marginBottom: '12px' }}>
            <LanguageSwitcher direction="up" />
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
              color: '#D4D4D8',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            {tCommon('logout')}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <BarChart3 style={{ width: '28px', height: '28px', color: '#F72585' }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Notification Icon */}
          <Link
            href="/app/notices"
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: pathname === '/app/notices' ? 'rgba(247, 37, 133, 0.2)' : 'transparent',
              color: pathname === '/app/notices' ? '#F72585' : '#D4D4D8',
            }}
          >
            <Bell style={{ width: '22px', height: '22px' }} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
          </button>
        </div>
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
                        color: isActive ? 'white' : '#D4D4D8',
                        background: isActive ? 'rgba(247, 37, 133, 0.2)' : 'transparent',
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      <item.icon style={{ width: '20px', height: '20px', color: isActive ? '#F72585' : '#D4D4D8' }} />
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
                color: '#D4D4D8',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <LogOut style={{ width: '18px', height: '18px' }} />
              {tCommon('logout')}
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="app-main" style={{ flex: 1 }}>
        {children}
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="mobile-bottom-nav">
        {bottomTabItems.map((item) => {
          const isActive = item.href === '/app/more'
            ? isMoreActive || showMoreMenu
            : pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));

          if (item.href === '/app/more') {
            return (
              <button
                key={item.href}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '8px 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? '#F72585' : '#D4D4D8',
                }}
              >
                <item.icon style={{ width: '22px', height: '22px' }} />
                <span style={{ fontSize: '11px', fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px 0',
                textDecoration: 'none',
                color: isActive ? '#F72585' : '#D4D4D8',
              }}
            >
              <item.icon style={{ width: '22px', height: '22px' }} />
              <span style={{ fontSize: '11px', fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* More Menu Popup */}
      {showMoreMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
            }}
            onClick={() => setShowMoreMenu(false)}
          />
          <div
            className="more-menu-popup"
            style={{
              position: 'fixed',
              bottom: '70px',
              left: '16px',
              right: '16px',
              background: '#1C1C1E',
              borderRadius: '16px',
              padding: '8px',
              zIndex: 60,
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            {[
              { href: '/app/sessions', icon: History, labelKey: 'sessions' },
              { href: '/app/level', icon: Star, labelKey: 'level' },
              { href: '/app/notices', icon: Megaphone, labelKey: 'notices' },
              { href: '/app/feedback', icon: MessageSquare, labelKey: 'feedback' },
              { href: '/app/settings', icon: Settings, labelKey: 'settings' },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMoreMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: isActive ? 'white' : '#D4D4D8',
                    background: isActive ? 'rgba(247, 37, 133, 0.2)' : 'transparent',
                  }}
                >
                  <item.icon style={{ width: '22px', height: '22px', color: isActive ? '#F72585' : '#D4D4D8' }} />
                  <span style={{ fontSize: '15px', fontWeight: isActive ? 500 : 400 }}>{t(item.labelKey)}</span>
                </Link>
              );
            })}
            <div style={{ borderTop: '1px solid #27272A', margin: '8px 0' }} />
            <button
              onClick={() => {
                setShowMoreMenu(false);
                handleSignOut();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#EF4444',
              }}
            >
              <LogOut style={{ width: '22px', height: '22px' }} />
              <span style={{ fontSize: '15px' }}>{tCommon('logout')}</span>
            </button>
          </div>
        </>
      )}

      <style jsx global>{`
        /* PC First - 기본값이 PC (1024px 이상) */
        .desktop-sidebar {
          width: 260px;
          background: #141416;
          border-right: 1px solid #27272A;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
        }
        .mobile-header {
          display: none;
        }
        .mobile-bottom-nav {
          display: none;
        }
        .more-menu-popup {
          display: none;
        }
        .app-main {
          margin-left: 260px;
          padding-top: 0;
          padding-bottom: 0;
        }

        /* 태블릿/모바일 (1024px 미만) */
        @media (max-width: 1023px) {
          .desktop-sidebar {
            display: none;
          }
          .mobile-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: #141416;
            border-bottom: 1px solid #27272A;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 50;
          }
          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: #141416;
            border-top: 1px solid #27272A;
            display: flex;
            align-items: center;
            z-index: 50;
            padding-bottom: env(safe-area-inset-bottom, 0);
          }
          .more-menu-popup {
            display: block;
          }
          .app-main {
            margin-left: 0;
            padding-top: 60px;
            padding-bottom: 70px;
          }
        }
      `}</style>
    </div>
  );
}
