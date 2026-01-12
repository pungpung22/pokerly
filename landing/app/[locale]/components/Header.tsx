'use client';

import { Link } from '@/src/i18n/navigation';
import { BarChart3, LayoutDashboard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const t = useTranslations('Landing');
  const { user, loading } = useAuth();

  return (
    <header
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #27272A'
      }}
    >
      <div
        className="header-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <BarChart3 style={{ width: '36px', height: '36px', color: '#6366F1' }} />
          <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LanguageSwitcher />
          {loading ? (
            <div style={{ width: '120px', height: '44px' }} />
          ) : user ? (
            <Link href="/app" className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard style={{ width: '18px', height: '18px' }} />
              {t('header.dashboard') || '대시보드'}
            </Link>
          ) : (
            <Link href="/app/login" className="btn-primary" style={{ padding: '12px 24px' }}>
              {t('hero.cta')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
