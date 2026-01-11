'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/src/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
] as const;

interface LanguageSwitcherProps {
  direction?: 'up' | 'down';
}

export default function LanguageSwitcher({ direction = 'down' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'ko' | 'en' | 'ja' });
    setIsOpen(false);
  };

  const dropdownStyle = direction === 'up'
    ? { bottom: '100%', marginBottom: '4px' }
    : { top: '100%', marginTop: '4px' };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          background: '#141416',
          border: '1px solid #27272A',
          borderRadius: '10px',
          color: '#FAFAFA',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        <Globe style={{ width: '20px', height: '20px', color: '#D4D4D8' }} />
        <span style={{ fontSize: '18px' }}>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        <ChevronDown
          style={{
            width: '18px',
            height: '18px',
            color: '#D4D4D8',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            ...dropdownStyle,
            background: '#1C1C1E',
            border: '1px solid #27272A',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 9999,
            minWidth: '180px',
            boxShadow: direction === 'up' ? '0 -4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px 18px',
                background: lang.code === locale ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: 'none',
                color: lang.code === locale ? '#6366F1' : '#FAFAFA',
                cursor: 'pointer',
                fontSize: '16px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '18px' }}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
