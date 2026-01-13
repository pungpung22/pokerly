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
    alternateLanguages[loc] = `${BASE_URL}/${loc}/terms`;
  });

  return {
    title: t('terms.title'),
    description: locale === 'ko'
      ? 'Pokerly 서비스 이용약관입니다. 서비스 이용 전 반드시 확인해주세요.'
      : locale === 'ja'
      ? 'Pokerlyサービスの利用規約です。サービス利用前に必ずご確認ください。'
      : 'Terms of Service for Pokerly. Please review before using our service.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/terms`,
      languages: {
        ...alternateLanguages,
        'x-default': `${BASE_URL}/ko/terms`,
      },
    },
    openGraph: {
      title: t('terms.title'),
      url: `${BASE_URL}/${locale}/terms`,
      type: 'website',
    },
  };
}

export default function TermsPage() {
  return (
    <>
      <TermsContent />
      <Footer />
    </>
  );
}

function TermsContent() {
  const t = useTranslations('Legal');

  return (
    <div className="legal-page">
      <div className="container" style={{ maxWidth: '800px', padding: '40px var(--container-padding)' }}>
        <Link href="/" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#A1A1AA', marginBottom: '24px', textDecoration: 'none' }}>
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
          {t('backToHome')}
        </Link>

        <h1 style={{ fontSize: 'var(--section-title)', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
          {t('terms.title')}
        </h1>
        <p style={{ color: '#A1A1AA', marginBottom: '40px' }}>
          {t('terms.lastUpdated')}
        </p>

        <div className="legal-content" style={{ color: '#D4D4D8', lineHeight: 1.8 }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.agreement.title')}
            </h2>
            <p>{t('terms.sections.agreement.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.service.title')}
            </h2>
            <p style={{ marginBottom: '12px' }}>{t('terms.sections.service.content')}</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{t('terms.sections.service.items.record')}</li>
              <li>{t('terms.sections.service.items.analytics')}</li>
              <li>{t('terms.sections.service.items.ocr')}</li>
              <li>{t('terms.sections.service.items.challenges')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.account.title')}
            </h2>
            <p style={{ marginBottom: '12px' }}>{t('terms.sections.account.content')}</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{t('terms.sections.account.items.accurate')}</li>
              <li>{t('terms.sections.account.items.secure')}</li>
              <li>{t('terms.sections.account.items.responsible')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.usage.title')}
            </h2>
            <p style={{ marginBottom: '12px' }}>{t('terms.sections.usage.content')}</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{t('terms.sections.usage.items.illegal')}</li>
              <li>{t('terms.sections.usage.items.harmful')}</li>
              <li>{t('terms.sections.usage.items.interfere')}</li>
              <li>{t('terms.sections.usage.items.reverse')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.content.title')}
            </h2>
            <p>{t('terms.sections.content.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.ip.title')}
            </h2>
            <p>{t('terms.sections.ip.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.disclaimer.title')}
            </h2>
            <p>{t('terms.sections.disclaimer.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.limitation.title')}
            </h2>
            <p>{t('terms.sections.limitation.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.termination.title')}
            </h2>
            <p>{t('terms.sections.termination.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.changes.title')}
            </h2>
            <p>{t('terms.sections.changes.content')}</p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
              {t('terms.sections.contact.title')}
            </h2>
            <p>{t('terms.sections.contact.content')}</p>
            <p style={{ marginTop: '12px' }}>
              <strong>{t('terms.sections.contact.company')}</strong><br />
              {t('terms.sections.contact.email')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
