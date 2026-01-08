'use client';

import { Spade } from 'lucide-react';

const links = {
  product: [
    { label: '기능', href: '#features' },
    { label: '요금제', href: '#pricing' },
    { label: '사용 후기', href: '#testimonials' },
  ],
  support: [
    { label: '도움말', href: '#' },
    { label: '문의하기', href: 'mailto:support@pokerly.kr' },
    { label: 'FAQ', href: '#' },
  ],
  legal: [
    { label: '이용약관', href: '#' },
    { label: '개인정보처리방침', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0B', borderTop: '1px solid #27272A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Top section - 4 column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '48px' }}>
          {/* Logo & description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(to bottom right, #6366F1, #22D3EE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Spade style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#71717A' }}>
              스크린샷 한 장으로 포커 수익을 자동 기록하고 분석하는 스마트 트래커
            </p>
          </div>

          {/* Links - Product */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>제품</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ fontSize: '14px', color: '#71717A', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Support */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>지원</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ fontSize: '14px', color: '#71717A', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Legal */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>법적 고지</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ fontSize: '14px', color: '#71717A', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ paddingTop: '32px', borderTop: '1px solid #27272A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', color: '#71717A' }}>
            © 2026 Pokerly. All rights reserved.
          </p>
          <p style={{ fontSize: '14px', color: '#71717A' }}>
            Made with passion for poker players
          </p>
        </div>
      </div>
    </footer>
  );
}
