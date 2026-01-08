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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <BarChart3 style={{ width: '32px', height: '32px', color: '#6366F1' }} />
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
        </Link>

        <Link
          href="/login"
          style={{
            padding: '10px 20px',
            background: '#6366F1',
            color: 'white',
            fontWeight: 500,
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          시작하기
        </Link>
      </div>
    </header>
  );
}
