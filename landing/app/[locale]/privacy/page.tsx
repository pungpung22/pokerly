export const runtime = 'edge';

import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import { routing } from '@/src/i18n/routing';

const BASE_URL = 'https://pokerly.co.kr';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal' });

  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    alternateLanguages[loc] = `${BASE_URL}/${loc}/privacy`;
  });

  return {
    title: t('privacy.title'),
    description: locale === 'ko'
      ? 'Pokerly 개인정보처리방침입니다. 개인정보 수집, 이용, 보호에 관한 정책을 안내합니다.'
      : locale === 'ja'
      ? 'Pokerlyのプライバシーポリシーです。個人情報の収集、利用、保護に関するポリシーをご案内します。'
      : 'Privacy Policy for Pokerly. Learn about our data collection, usage, and protection practices.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/privacy`,
      languages: {
        ...alternateLanguages,
        'x-default': `${BASE_URL}/ko/privacy`,
      },
    },
    openGraph: {
      title: t('privacy.title'),
      url: `${BASE_URL}/${locale}/privacy`,
      type: 'website',
    },
  };
}

export default function PrivacyPage() {
  return (
    <>
      <PrivacyContent />
      <Footer />
    </>
  );
}

function PrivacyContent() {
  const t = useTranslations('Legal');

  return (
    <div className="legal-page">
      <div className="container" style={{ maxWidth: '800px', padding: '40px var(--container-padding)' }}>
        <Link href="/" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#A1A1AA', marginBottom: '24px', textDecoration: 'none' }}>
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
          {t('backToHome')}
        </Link>

        <h1 style={{ fontSize: 'var(--section-title)', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
          {t('privacy.title')}
        </h1>
        <p style={{ color: '#A1A1AA', marginBottom: '40px' }}>
          {t('privacy.lastUpdated')}
        </p>

        <div className="legal-content" style={{ color: '#D4D4D8', lineHeight: 1.8 }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.intro.title')}
            </h2>
            <p>{t('privacy.sections.intro.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.collect.title')}
            </h2>
            <p style={{ marginBottom: '12px' }}>{t('privacy.sections.collect.content')}</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{t('privacy.sections.collect.items.email')}</li>
              <li>{t('privacy.sections.collect.items.name')}</li>
              <li>{t('privacy.sections.collect.items.photo')}</li>
              <li>{t('privacy.sections.collect.items.gameData')}</li>
              <li>{t('privacy.sections.collect.items.screenshots')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.use.title')}
            </h2>
            <p style={{ marginBottom: '12px' }}>{t('privacy.sections.use.content')}</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{t('privacy.sections.use.items.service')}</li>
              <li>{t('privacy.sections.use.items.analytics')}</li>
              <li>{t('privacy.sections.use.items.improvement')}</li>
              <li>{t('privacy.sections.use.items.support')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.storage.title')}
            </h2>
            <p>{t('privacy.sections.storage.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.sharing.title')}
            </h2>
            <p>{t('privacy.sections.sharing.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.rights.title')}
            </h2>
            <p style={{ marginBottom: '12px' }}>{t('privacy.sections.rights.content')}</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{t('privacy.sections.rights.items.access')}</li>
              <li>{t('privacy.sections.rights.items.correction')}</li>
              <li>{t('privacy.sections.rights.items.deletion')}</li>
              <li>{t('privacy.sections.rights.items.export')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.cookies.title')}
            </h2>
            <p>{t('privacy.sections.cookies.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('privacy.sections.contact.title')}
            </h2>
            <p>{t('privacy.sections.contact.content')}</p>
            <p style={{ marginTop: '12px' }}>
              <strong>{t('privacy.sections.contact.company')}</strong><br />
              {t('privacy.sections.contact.email')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
