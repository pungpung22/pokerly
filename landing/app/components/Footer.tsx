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
    { label: '문의하기', href: 'mailto:pung0805@gmail.com' },
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
            <p style={{ lineHeight: 1.6, color: '#71717A' }}>
              스크린샷 한 장으로 포커 수익을 자동 기록하고 분석하는 스마트 트래커
            </p>
          </div>

          {/* Links - Product */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>제품</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ color: '#71717A', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Support */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>지원</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ color: '#71717A', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Legal */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '16px' }}>법적 고지</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} style={{ color: '#71717A', textDecoration: 'none' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{ paddingTop: '32px', borderTop: '1px solid #27272A', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ color: '#71717A' }}>
            © 2026 풍풍스튜디. All rights reserved.
          </p>
          <p style={{ color: '#71717A' }}>
            Made with passion for poker players
          </p>
        </div>
      </div>
    </footer>
  );
}
