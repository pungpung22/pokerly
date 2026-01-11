'use client';

import { Heart, Coffee, ExternalLink, Smartphone } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function DonatePage() {
  const t = useTranslations('Donate');
  const locale = useLocale();

  return (
    <div className="app-page">
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F72585, #B5179E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Heart style={{ width: '40px', height: '40px', color: 'white' }} />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#D4D4D8', lineHeight: 1.6 }}>
          {t('subtitle')}
        </p>
      </div>

      {/* Message Card */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <p style={{ color: '#D4D4D8', fontSize: '15px', lineHeight: 1.8 }}>
          {t('message')}
        </p>
      </div>

      {/* Donation Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* KakaoPay */}
        <a
          href="https://qr.kakaopay.com/Ej70xCmbm"
          target="_blank"
          rel="noopener noreferrer"
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            textDecoration: 'none',
            border: '2px solid #FEE500',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FEE500, #FFCD00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Coffee style={{ width: '28px', height: '28px', color: '#000' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
              {t('kakaopay.title')}
            </p>
            <p style={{ color: '#A1A1AA', fontSize: '13px' }}>
              {t('kakaopay.description')}
            </p>
          </div>
          <ExternalLink style={{ width: '20px', height: '20px', color: '#FEE500' }} />
        </a>

        {/* Buy Me a Coffee - Coming Soon */}
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            opacity: 0.6,
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFDD00, #FF813F)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Coffee style={{ width: '28px', height: '28px', color: '#000' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
              Buy Me a Coffee
            </p>
            <p style={{ color: '#A1A1AA', fontSize: '13px' }}>
              {t('buymeacoffee.comingSoon')}
            </p>
          </div>
          <span style={{
            padding: '4px 10px',
            background: '#27272A',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#A1A1AA',
          }}>
            {t('comingSoon')}
          </span>
        </div>
      </div>

      {/* Mobile Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '24px',
        padding: '12px',
        background: 'rgba(247, 37, 133, 0.1)',
        borderRadius: '8px',
      }}>
        <Smartphone style={{ width: '16px', height: '16px', color: '#F72585' }} />
        <p style={{ color: '#F72585', fontSize: '13px' }}>
          {t('mobileNotice')}
        </p>
      </div>

      {/* Thank You */}
      <p style={{ textAlign: 'center', color: '#71717A', fontSize: '14px', marginTop: '32px' }}>
        {t('thankYou')}
      </p>
    </div>
  );
}
