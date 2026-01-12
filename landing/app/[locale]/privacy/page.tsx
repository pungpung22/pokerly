export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal' });
  return {
    title: t('privacy.title'),
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
