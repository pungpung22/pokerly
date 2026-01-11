'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Bell, Moon, Globe, Mail, Shield, LogOut, ChevronRight, ExternalLink, DollarSign, Hash, AlertTriangle, Trash2, Loader2, Trophy, Check, Heart, Coffee } from 'lucide-react';
import { userApi } from '../../../../lib/api';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

type Currency = 'KRW' | 'USD' | 'JPY';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const t = useTranslations('Settings');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Currency labels with translations
  const currencyLabels: Record<Currency, string> = {
    KRW: t('display.currency.krw'),
    USD: t('display.currency.usd'),
    JPY: t('display.currency.jpy'),
  };

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  // 표시 설정
  const [useKoreanUnit, setUseKoreanUnit] = useState(false);
  const [roundToTenThousand, setRoundToTenThousand] = useState(false);
  const [currency, setCurrency] = useState<Currency>('KRW');

  // 랭킹 참여
  const [rankingOptIn, setRankingOptIn] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [rankingNickname, setRankingNickname] = useState('');
  const [savingRanking, setSavingRanking] = useState(false);

  // 회원 탈퇴
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // localStorage에서 설정 로드
  useEffect(() => {
    const savedSettings = localStorage.getItem('pokerly_display_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setUseKoreanUnit(settings.useKoreanUnit ?? false);
        setRoundToTenThousand(settings.roundToTenThousand ?? false);
        setCurrency(settings.currency ?? 'KRW');
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // 설정 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('pokerly_display_settings', JSON.stringify({
      useKoreanUnit,
      roundToTenThousand,
      currency,
    }));
  }, [useKoreanUnit, roundToTenThousand, currency]);

  // 랭킹 참여 상태 로드
  useEffect(() => {
    const loadRankingStatus = async () => {
      try {
        const response = await userApi.getMyRanking();
        setRankingOptIn(response.optedIn);
        if (response.nickname) {
          setRankingNickname(response.nickname);
        }
      } catch (error) {
        console.error('Failed to load ranking status:', error);
      }
    };
    loadRankingStatus();
  }, []);

  const handleRankingToggle = () => {
    if (rankingOptIn) {
      // 랭킹 참여 해제
      handleRankingOptOut();
    } else {
      // 랭킹 참여 동의 모달 표시
      setShowRankingModal(true);
    }
  };

  const handleRankingOptIn = async () => {
    if (!rankingNickname.trim()) {
      alert(t('ranking.nicknameRequired'));
      return;
    }

    setSavingRanking(true);
    try {
      await userApi.updateRankingOptIn(true, rankingNickname.trim());
      setRankingOptIn(true);
      setShowRankingModal(false);
    } catch (error) {
      console.error('Failed to opt in to ranking:', error);
      alert(t('ranking.optInError'));
    } finally {
      setSavingRanking(false);
    }
  };

  const handleRankingOptOut = async () => {
    if (!confirm(t('ranking.optOutConfirm'))) {
      return;
    }

    setSavingRanking(true);
    try {
      await userApi.updateRankingOptIn(false);
      setRankingOptIn(false);
    } catch (error) {
      console.error('Failed to opt out of ranking:', error);
      alert(t('ranking.optOutError'));
    } finally {
      setSavingRanking(false);
    }
  };

  const confirmText = t('account.deleteAccount.confirmText');

  const handleSignOut = async () => {
    if (confirm(t('logoutConfirm'))) {
      await signOut();
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== confirmText) {
      alert(t('account.deleteAccount.confirmError', { text: confirmText }));
      return;
    }

    setDeleting(true);
    try {
      // TODO: 백엔드 API 호출하여 계정 삭제
      // await userApi.deleteAccount();

      // 로컬 데이터 삭제
      localStorage.removeItem('pokerly_display_settings');
      localStorage.removeItem('pokerly_welcome_banner_dismissed');

      await signOut();
      alert(t('account.deleteAccount.success'));
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert(t('account.deleteAccount.error'));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="app-page">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{t('title')}</h1>
        <p style={{ color: '#D4D4D8' }}>{t('subtitle')}</p>
      </div>

      {/* Profile Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User style={{ width: '18px', height: '18px', color: '#F72585' }} />
          {t('profile')}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#0A0A0B', borderRadius: '12px' }}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{ width: '64px', height: '64px', borderRadius: '50%' }}
            />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F72585', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontSize: '24px', fontWeight: 'bold' }}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>
              {user?.displayName || t('user')}
            </p>
            <p style={{ color: '#D4D4D8', fontSize: '14px' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>{t('appSettings')}</h2>

        {/* Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('notifications.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('notifications.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: notifications ? '#F72585' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: notifications ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Dark Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Moon style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('darkMode.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('darkMode.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: darkMode ? '#F72585' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: darkMode ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('language.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('language.subtitle')}</p>
            </div>
          </div>
          <select
            value={locale}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              padding: '8px 12px',
              background: '#0A0A0B',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="ko">{t('language.ko')}</option>
            <option value="en">{t('language.en')}</option>
            <option value="ja">{t('language.ja')}</option>
          </select>
        </div>

        {/* Ranking Opt-in */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Trophy style={{ width: '20px', height: '20px', color: rankingOptIn ? '#FFD700' : '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('ranking.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('ranking.subtitle')}</p>
              {rankingOptIn && rankingNickname && (
                <p style={{ color: '#F72585', fontSize: '12px', marginTop: '4px' }}>
                  {t('ranking.currentNickname')}: {rankingNickname}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleRankingToggle}
            disabled={savingRanking}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: rankingOptIn ? '#F72585' : '#27272A',
              border: 'none',
              cursor: savingRanking ? 'not-allowed' : 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
              opacity: savingRanking ? 0.7 : 1,
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: rankingOptIn ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign style={{ width: '18px', height: '18px', color: '#F72585' }} />
          {t('display.title')}
        </h2>

        {/* Korean Unit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Hash style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('display.koreanUnit.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('display.koreanUnit.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setUseKoreanUnit(!useKoreanUnit)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: useKoreanUnit ? '#F72585' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: useKoreanUnit ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Round to Ten Thousand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Hash style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('display.roundToTenThousand.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('display.roundToTenThousand.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setRoundToTenThousand(!roundToTenThousand)}
            style={{
              width: '48px',
              height: '28px',
              borderRadius: '14px',
              background: roundToTenThousand ? '#F72585' : '#27272A',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: roundToTenThousand ? '23px' : '3px',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Currency */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <DollarSign style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('display.currency.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('display.currency.subtitle')}</p>
            </div>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            style={{
              padding: '8px 12px',
              background: '#0A0A0B',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {(Object.keys(currencyLabels) as Currency[]).map((c) => (
              <option key={c} value={c}>{currencyLabels[c]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Support */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>{t('support.title')}</h2>

        <a
          href="mailto:pung0805@gmail.com"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 500 }}>{t('support.contact')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>pung0805@gmail.com</p>
            </div>
          </div>
          <ExternalLink style={{ width: '18px', height: '18px', color: '#D4D4D8' }} />
        </a>

        <a
          href="#"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #27272A', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <p style={{ color: 'white', fontWeight: 500 }}>{t('support.privacy')}</p>
          </div>
          <ChevronRight style={{ width: '18px', height: '18px', color: '#D4D4D8' }} />
        </a>

        <a
          href="#"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
            <p style={{ color: 'white', fontWeight: 500 }}>{t('support.terms')}</p>
          </div>
          <ChevronRight style={{ width: '18px', height: '18px', color: '#D4D4D8' }} />
        </a>
      </div>

      {/* Developer Support */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart style={{ width: '18px', height: '18px', color: '#F72585' }} />
          {t('donate.title')}
        </h2>

        <p style={{ color: '#D4D4D8', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>
          {t('donate.description')}
        </p>

        <a
          href="https://qr.kakaopay.com/Ej70xCmbm"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #FEE500, #FFCD00)',
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Coffee style={{ width: '18px', height: '18px' }} />
          {t('donate.kakaopay')}
        </a>

        <p style={{ color: '#71717A', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
          {t('donate.mobileOnly')}
        </p>
      </div>

      {/* Account Management */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User style={{ width: '18px', height: '18px', color: '#F72585' }} />
          {t('account.title')}
        </h2>

        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Trash2 style={{ width: '20px', height: '20px', color: '#EF4444' }} />
            <div>
              <p style={{ color: '#EF4444', fontWeight: 500 }}>{t('account.deleteAccount.title')}</p>
              <p style={{ color: '#D4D4D8', fontSize: '13px' }}>{t('account.deleteAccount.subtitle')}</p>
            </div>
          </div>
          <ChevronRight style={{ width: '18px', height: '18px', color: '#D4D4D8' }} />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleSignOut}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          padding: '16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          borderRadius: '12px',
          color: '#EF4444',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        <LogOut style={{ width: '20px', height: '20px' }} />
        {tCommon('logout')}
      </button>

      {/* App Version */}
      <p style={{ textAlign: 'center', color: '#D4D4D8', fontSize: '13px', marginTop: '24px' }}>
        {t('version')}
      </p>

      {/* Ranking Opt-in Modal */}
      {showRankingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
          onClick={() => setShowRankingModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '450px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{t('ranking.modalTitle')}</h3>
                <p style={{ color: '#D4D4D8', fontSize: '14px' }}>{t('ranking.modalSubtitle')}</p>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#0A0A0B', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield style={{ width: '16px', height: '16px', color: '#F72585' }} />
                {t('ranking.privacyTitle')}
              </h4>
              <ul style={{ color: '#D4D4D8', fontSize: '14px', lineHeight: 1.8, paddingLeft: '20px' }}>
                <li>{t('ranking.privacy1')}</li>
                <li>{t('ranking.privacy2')}</li>
                <li>{t('ranking.privacy3')}</li>
                <li>{t('ranking.privacy4')}</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'white', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                {t('ranking.nicknameLabel')}
              </label>
              <input
                type="text"
                value={rankingNickname}
                onChange={(e) => setRankingNickname(e.target.value)}
                placeholder={t('ranking.nicknamePlaceholder')}
                maxLength={12}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0A0A0B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
              <p style={{ color: '#D4D4D8', fontSize: '12px', marginTop: '8px' }}>
                {t('ranking.nicknameHint')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowRankingModal(false);
                  setRankingNickname('');
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'transparent',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: '#D4D4D8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleRankingOptIn}
                disabled={savingRanking || !rankingNickname.trim()}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: rankingNickname.trim() ? 'linear-gradient(135deg, #F72585, #B5179E)' : '#27272A',
                  border: 'none',
                  borderRadius: '8px',
                  color: rankingNickname.trim() ? 'white' : '#D4D4D8',
                  cursor: rankingNickname.trim() && !savingRanking ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {savingRanking ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    {t('ranking.saving')}
                  </>
                ) : (
                  <>
                    <Check style={{ width: '16px', height: '16px' }} />
                    {t('ranking.agree')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '400px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle style={{ width: '24px', height: '24px', color: '#EF4444' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{t('account.deleteAccount.title')}</h3>
                <p style={{ color: '#D4D4D8', fontSize: '14px' }}>{t('account.deleteAccount.warning')}</p>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#EF4444', fontSize: '14px', lineHeight: 1.5 }}>
                {t('account.deleteAccount.dataDeleted')}
              </p>
              <ul style={{ color: '#EF4444', fontSize: '14px', marginTop: '8px', paddingLeft: '20px' }}>
                <li>{t('account.deleteAccount.sessionRecords')}</li>
                <li>{t('account.deleteAccount.challengesAchievements')}</li>
                <li>{t('account.deleteAccount.accountInfo')}</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#D4D4D8', fontSize: '14px', marginBottom: '8px' }}>
                {t('account.deleteAccount.confirmPrompt', { text: '' })}
                <span style={{ color: '#EF4444', fontWeight: 'bold' }}>"{confirmText}"</span>
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={confirmText}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0A0A0B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'transparent',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: '#D4D4D8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== confirmText}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: deleteConfirmText === confirmText ? '#EF4444' : '#27272A',
                  border: 'none',
                  borderRadius: '8px',
                  color: deleteConfirmText === confirmText ? 'white' : '#D4D4D8',
                  cursor: deleteConfirmText === confirmText ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    {t('account.deleteAccount.deleting')}
                  </>
                ) : (
                  t('account.deleteAccount.deleteButton')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
