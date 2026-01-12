'use client';

import { Spade } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

export default function Footer() {
  const t = useTranslations('Landing');

  const links = {
    product: [
      { label: t('footer.links.product.features'), href: '/#how-it-works' },
      { label: t('footer.links.product.testimonials'), href: '/#testimonials' },
    ],
    support: [
      { label: t('footer.links.support.help'), href: '/#how-it-works' },
      { label: t('footer.links.support.contact'), href: 'mailto:pung0805@gmail.com' },
      { label: t('footer.links.support.faq'), href: '/#how-it-works' },
    ],
  };

  return (
    <footer style={{ background: '#0A0A0B', borderTop: '1px solid #27272A' }}>
      <div className="container" style={{ padding: '16px var(--container-padding)' }}>
        {/* Single row layout */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '5px',
                background: 'linear-gradient(to bottom right, #6366F1, #22D3EE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Spade style={{ width: '14px', height: '14px', color: 'white' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {links.product.map((link) => (
              <a key={link.label} href={link.href} style={{ color: '#71717A', textDecoration: 'none', fontSize: '12px' }}>
                {link.label}
              </a>
            ))}
            {links.support.map((link) => (
              <a key={link.label} href={link.href} style={{ color: '#71717A', textDecoration: 'none', fontSize: '12px' }}>
                {link.label}
              </a>
            ))}
            <Link href="/terms" style={{ color: '#71717A', textDecoration: 'none', fontSize: '12px' }}>
              {t('footer.links.legal.terms')}
            </Link>
            <Link href="/privacy" style={{ color: '#71717A', textDecoration: 'none', fontSize: '12px' }}>
              {t('footer.links.legal.privacy')}
            </Link>
          </div>

          {/* Copyright */}
          <p style={{ color: '#52525B', fontSize: '11px' }}>
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
