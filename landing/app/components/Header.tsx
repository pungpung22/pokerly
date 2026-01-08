'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default function Header() {
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

        <Link href="/login" className="btn-primary" style={{ padding: '12px 24px' }}>
          시작하기
        </Link>
      </div>
    </header>
  );
}
