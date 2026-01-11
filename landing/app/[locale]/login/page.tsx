'use client';

import { useState, useEffect } from 'react';
import { BarChart3, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/src/i18n/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Login');

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/app');
    }
  }, [user, authLoading, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await signIn();
      if (user) {
        router.push('/app');
      } else {
        setError(t('error.failed'));
      }
    } catch (err) {
      setError(t('error.general'));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #27272A' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <BarChart3 style={{ width: '36px', height: '36px', color: '#6366F1' }} />
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'white' }}>Pokerly</span>
          </Link>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#D4D4D8',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            {t('back')}
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="section-title" style={{ marginBottom: '12px' }}>
              {t('title')}
            </h1>
            <p className="section-subtitle">
              {t('subtitle')}
            </p>
          </div>

          {/* Form card */}
          <div className="card">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                padding: '16px',
                background: loading ? '#e5e5e5' : 'white',
                color: '#1f1f1f',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 'var(--button-text)'
              }}
            >
              {loading ? (
                <Loader2 style={{ width: '22px', height: '22px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? t('loading') : t('googleButton')}
            </button>

            {error && (
              <p style={{ marginTop: '16px', color: '#EF4444', textAlign: 'center' }}>
                {error}
              </p>
            )}

          </div>

          {/* Terms - outside the card */}
          <p style={{ marginTop: '20px', fontSize: '13px', color: '#71717A', textAlign: 'center', lineHeight: 1.6, padding: '0 16px' }}>
            {t('terms.prefix')} <a href="#" style={{ color: '#6366F1', textDecoration: 'none' }}>{t('terms.tos')}</a> {t('terms.and')}{' '}
            <a href="#" style={{ color: '#6366F1', textDecoration: 'none' }}>{t('terms.privacy')}</a>{t('terms.suffix')}
          </p>
        </div>
      </main>
    </div>
  );
}
