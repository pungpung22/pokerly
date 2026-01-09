'use client';

import { Link } from '@/src/i18n/navigation';
import { BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Landing');

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
          <Link href="/login" className="btn-primary" style={{ padding: '12px 24px' }}>
            {t('hero.cta')}
          </Link>
        </div>
      </div>
    </header>
  );
}
