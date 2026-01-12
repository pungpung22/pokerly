'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link, useRouter } from '@/src/i18n/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import {
  BarChart3,
  Home,
  CalendarDays,
  LineChart,
  Camera,
  SlidersHorizontal,
  LogOut,
  Loader2,
  Menu,
  X,
  Target,
  Crown,
  Bell,
  MoreHorizontal,
  Send,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  History,
  Star,
  Megaphone,
  MessageSquare,
  Settings,
  Heart,
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { sessionsApi, userApi } from '@/lib/api';
import type { DashboardStats, LevelInfo } from '@/lib/types';
import AppFooter from '../components/AppFooter';

// Navigation items with translation keys
const navItemsConfig = [
  { href: '/app', icon: Home, labelKey: 'dashboard' },
  { href: '/app/sessions', icon: CalendarDays, labelKey: 'sessions' },
  { href: '/app/missions', icon: Target, labelKey: 'missions' },
  { href: '/app/level', icon: Crown, labelKey: 'level' },
  { href: '/app/analytics', icon: LineChart, labelKey: 'analytics' },
  { href: '/app/upload', icon: Camera, labelKey: 'upload' },
  { href: '/app/notices', icon: Newspaper, labelKey: 'notices' },
  { href: '/app/feedback', icon: Send, labelKey: 'feedback' },
  { href: '/app/donate', icon: Heart, labelKey: 'donate' },
  { href: '/app/settings', icon: SlidersHorizontal, labelKey: 'settings' },
];

// Bottom tab items with translation keys
const bottomTabItemsConfig = [
  { href: '/app', icon: Home, labelKey: 'home' },
  { href: '/app/missions', icon: Target, labelKey: 'missions' },
  { href: '/app/upload', icon: Camera, labelKey: 'upload' },
  { href: '/app/analytics', icon: LineChart, labelKey: 'analytics' },
  { href: '/app/more', icon: MoreHorizontal, labelKey: 'more' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const rawPathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [todayProfit, setTodayProfit] = useState<number>(0);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const tSettings = useTranslations('Settings');
  const tUnits = useTranslations('Units');
  const locale = useLocale();

  // Locale-aware currency formatting for sidebar
  const formatSidebarCurrency = (value: number, abbreviated = false): string => {
    const sign = value >= 0 ? '+' : '-';
    const absValue = Math.abs(value);

    if (abbreviated && absValue >= 10000) {
      // Abbreviated format for collapsed sidebar
      if (locale === 'ko') {
        return `${sign}${(absValue / 10000).toFixed(0)}만`;
      } else if (locale === 'ja') {
        return `${sign}¥${(absValue / 10000).toFixed(0)}万`;
      } else {
        // English uses K for thousands
        return `${sign}$${(absValue / 1000).toFixed(0)}K`;
      }
    }

    // Full format
    if (locale === 'en') {
      return `${sign}$${absValue.toLocaleString()}`;
    } else if (locale === 'ja') {
      return `${sign}¥${absValue.toLocaleString()}`;
    }
    return `${sign}${absValue.toLocaleString()}${tUnits('won')}`;
  };

  // Remove locale prefix from pathname for matching (e.g., /ko/app -> /app)
  const pathname = rawPathname.replace(/^\/(ko|en|ja)/, '');

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

  // Fetch today's profit and level info
  useEffect(() => {
    async function fetchSidebarData() {
      if (!user) return;
      try {
        const [stats, level] = await Promise.all([
          sessionsApi.getStats(),
          userApi.getLevelInfo(),
        ]);
        setTodayProfit(stats.todayProfit || 0);
        setLevelInfo(level);
      } catch (err) {
        console.error('Failed to fetch sidebar data:', err);
      }
    }
    fetchSidebarData();
  }, [user]);

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
        <Loader2 style={{ width: '32px', height: '32px', color: '#14B8A6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ background: '#0A0A0B', display: 'flex' }}>
      {/* Desktop Sidebar */}
      <aside className={`desktop-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo & Toggle */}
        <div style={{ padding: sidebarCollapsed ? '24px 16px' : '24px', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <BarChart3 style={{ width: '32px', height: '32px', color: '#14B8A6' }} />
              {!sidebarCollapsed && <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>}
            </Link>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="sidebar-toggle-btn"
              title={sidebarCollapsed ? '펼치기' : '접기'}
            >
              {sidebarCollapsed ? <ChevronRight style={{ width: '18px', height: '18px' }} /> : <ChevronLeft style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>
        </div>

        {/* Today's Profit Mini Card */}
        <div style={{ padding: sidebarCollapsed ? '12px 8px' : '12px 16px' }}>
          <div className="today-profit-card">
            {sidebarCollapsed ? (
              <div style={{ textAlign: 'center' }}>
                <TrendingUp style={{ width: '18px', height: '18px', color: todayProfit >= 0 ? '#00D4AA' : '#EF4444' }} />
                <p style={{ fontSize: '12px', fontWeight: 600, color: todayProfit >= 0 ? '#00D4AA' : '#EF4444', marginTop: '4px' }}>
                  {formatSidebarCurrency(todayProfit, true)}
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <TrendingUp style={{ width: '14px', height: '14px', color: '#A1A1AA' }} />
                  <span style={{ fontSize: '12px', color: '#A1A1AA' }}>{t('todayProfit')}</span>
                </div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: todayProfit >= 0 ? '#00D4AA' : '#EF4444' }}>
                  {formatSidebarCurrency(todayProfit)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: sidebarCollapsed ? '16px 8px' : '16px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      gap: '12px',
                      padding: sidebarCollapsed ? '12px' : '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive ? 'white' : '#A1A1AA',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(20, 184, 166, 0.3) 0%, rgba(20, 184, 166, 0.1) 100%)'
                        : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive ? '3px solid #14B8A6' : '3px solid transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(20, 184, 166, 0.2)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <item.icon style={{
                      width: '20px',
                      height: '20px',
                      color: isActive ? '#14B8A6' : '#A1A1AA',
                      filter: isActive ? 'drop-shadow(0 0 4px rgba(20, 184, 166, 0.5))' : 'none',
                    }} />
                    {!sidebarCollapsed && item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div style={{ padding: sidebarCollapsed ? '16px 8px' : '16px', borderTop: '1px solid #27272A' }}>
          <Link href="/app/level" style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', marginBottom: '12px', textDecoration: 'none' }}>
            <div style={{ position: 'relative' }}>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
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
                  background: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '2px solid #141416',
                }}
              >
                {levelInfo?.level || <Crown style={{ width: '10px', height: '10px' }} />}
              </div>
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || tSettings('user')}
                </p>
                <p style={{ color: '#D4D4D8', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
            )}
          </Link>

          {/* XP Gauge Bar */}
          {levelInfo && !sidebarCollapsed && (
            <div className="sidebar-xp-gauge">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap style={{ width: '12px', height: '12px', color: '#14B8A6' }} />
                  <span style={{ fontSize: '11px', color: '#A1A1AA' }}>Lv.{levelInfo.level}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#71717A' }}>{levelInfo.currentXp}/{levelInfo.requiredXp} XP</span>
              </div>
              <div className="xp-gauge-bar">
                <div
                  className="xp-gauge-fill"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* XP Gauge for collapsed mode */}
          {levelInfo && sidebarCollapsed && (
            <div style={{ marginBottom: '12px' }}>
              <div className="xp-gauge-bar" style={{ height: '4px' }}>
                <div
                  className="xp-gauge-fill"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          )}

          {!sidebarCollapsed && (
            <div style={{ marginBottom: '12px' }}>
              <LanguageSwitcher direction="up" />
            </div>
          )}
          <button
            onClick={handleSignOut}
            title={sidebarCollapsed ? tCommon('logout') : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '8px',
              width: '100%',
              padding: sidebarCollapsed ? '10px' : '10px 16px',
              background: 'transparent',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: '#D4D4D8',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            {!sidebarCollapsed && tCommon('logout')}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <BarChart3 style={{ width: '28px', height: '28px', color: '#14B8A6' }} />
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
              background: pathname === '/app/notices' ? 'rgba(20, 184, 166, 0.2)' : 'transparent',
              color: pathname === '/app/notices' ? '#14B8A6' : '#D4D4D8',
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
                        background: isActive ? 'rgba(20, 184, 166, 0.2)' : 'transparent',
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      <item.icon style={{ width: '20px', height: '20px', color: isActive ? '#14B8A6' : '#D4D4D8' }} />
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
      <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <AppFooter />
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
                  color: isActive ? '#14B8A6' : '#D4D4D8',
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
                color: isActive ? '#14B8A6' : '#D4D4D8',
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
              { href: '/app/donate', icon: Heart, labelKey: 'donate' },
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
                    background: isActive ? 'rgba(20, 184, 166, 0.2)' : 'transparent',
                  }}
                >
                  <item.icon style={{ width: '22px', height: '22px', color: isActive ? '#14B8A6' : '#D4D4D8' }} />
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
          transition: width 0.2s ease;
          z-index: 50;
        }
        .desktop-sidebar.collapsed {
          width: 72px;
        }
        .sidebar-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: transparent;
          border: 1px solid #27272A;
          color: #A1A1AA;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sidebar-toggle-btn:hover {
          background: rgba(20, 184, 166, 0.1);
          border-color: #14B8A6;
          color: #14B8A6;
        }
        .today-profit-card {
          background: rgba(0, 212, 170, 0.08);
          border: 1px solid rgba(0, 212, 170, 0.2);
          border-radius: 10px;
          padding: 12px;
        }
        .sidebar-xp-gauge {
          margin-bottom: 12px;
        }
        .xp-gauge-bar {
          height: 6px;
          background: #27272A;
          border-radius: 3px;
          overflow: hidden;
        }
        .xp-gauge-fill {
          height: 100%;
          background: linear-gradient(90deg, #14B8A6 0%, #7B2FF7 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
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
          transition: margin-left 0.2s ease;
        }
        .desktop-sidebar.collapsed ~ .app-main {
          margin-left: 72px;
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
