'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

export default function AppFooter() {
  const t = useTranslations('Landing');

  return (
    <footer style={{ background: '#0A0A0B', borderTop: '1px solid #27272A', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '16px var(--container-padding)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ color: '#71717A', fontSize: '12px' }}>
            {t('footer.copyright')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/terms" style={{ color: '#71717A', textDecoration: 'none', fontSize: '12px' }}>
              {t('footer.links.legal.terms')}
            </Link>
            <Link href="/privacy" style={{ color: '#71717A', textDecoration: 'none', fontSize: '12px' }}>
              {t('footer.links.legal.privacy')}
            </Link>
            <a href="mailto:pung0805@gmail.com" style={{ color: '#71717A', textDecoration: 'none', fontSize: '12px' }}>
              {t('footer.links.support.contact')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
