'use client';

import { Spade } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Landing');

  const links = {
    product: [
      { label: t('footer.links.product.features'), href: '#features' },
      { label: t('footer.links.product.pricing'), href: '#pricing' },
      { label: t('footer.links.product.testimonials'), href: '#testimonials' },
    ],
    support: [
      { label: t('footer.links.support.help'), href: '#' },
      { label: t('footer.links.support.contact'), href: 'mailto:pung0805@gmail.com' },
      { label: t('footer.links.support.faq'), href: '#' },
    ],
    legal: [
      { label: t('footer.links.legal.terms'), href: '#' },
      { label: t('footer.links.legal.privacy'), href: '#' },
    ],
  };

  return (
    <footer style={{ background: '#0A0A0B', borderTop: '1px solid #27272A' }}>
      <div className="container" style={{ padding: '48px var(--container-padding)' }}>
        {/* Top section - responsive grid */}
        <div className="grid-4" style={{ marginBottom: '48px' }}>
          {/* Logo & description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(to bottom right, #6366F1, #22D3EE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Spade style={{ width: '22px', height: '22px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
            </div>
            <p style={{ lineHeight: 1.6, color: '#D4D4D8' }}>
              {t('footer.description')}
            </p>
          </div>

          {/* Links - Product */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>{t('footer.sections.product')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ color: '#D4D4D8', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Support */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>{t('footer.sections.support')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ color: '#D4D4D8', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Legal */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>{t('footer.sections.legal')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ color: '#D4D4D8', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ paddingTop: '32px', borderTop: '1px solid #27272A', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ color: '#D4D4D8' }}>
            {t('footer.copyright')}
          </p>
          <p style={{ color: '#D4D4D8' }}>
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
