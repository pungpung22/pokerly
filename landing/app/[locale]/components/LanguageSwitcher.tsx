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

export default function LanguageSwitcher() {
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

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: '#141416',
          border: '1px solid #27272A',
          borderRadius: '8px',
          color: '#FAFAFA',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        <Globe style={{ width: '16px', height: '16px', color: '#A1A1AA' }} />
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        <ChevronDown
          style={{
            width: '16px',
            height: '16px',
            color: '#A1A1AA',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            background: '#141416',
            border: '1px solid #27272A',
            borderRadius: '8px',
            overflow: 'hidden',
            zIndex: 50,
            minWidth: '150px',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 12px',
                background: lang.code === locale ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: 'none',
                color: lang.code === locale ? '#6366F1' : '#FAFAFA',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
