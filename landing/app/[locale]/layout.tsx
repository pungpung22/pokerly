import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import FirebaseProvider from "../providers/FirebaseProvider";
import { AuthProvider } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const BASE_URL = 'https://pokerly.co.kr';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const localeToOgLocale: Record<string, string> = {
    ko: 'ko_KR',
    en: 'en_US',
    ja: 'ja_JP',
  };

  // as-needed 모드: 기본 언어(ko)는 루트 사용, 나머지는 /en, /ja
  const getLocalePath = (loc: string) => loc === 'ko' ? '' : `/${loc}`;

  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    alternateLanguages[loc] = `${BASE_URL}${getLocalePath(loc)}`;
  });

  const currentPath = getLocalePath(locale);

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        ...alternateLanguages,
        'x-default': BASE_URL,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}${currentPath}`,
      siteName: 'Pokerly',
      locale: localeToOgLocale[locale] || 'ko_KR',
      alternateLocale: Object.values(localeToOgLocale).filter(l => l !== localeToOgLocale[locale]),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t("title"),
      description: t("description"),
    },
    verification: {
      google: '2RhNv4GUsffIqqYVIaJSaN8bgHdvTXXcUDNL4ye81qs',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <FirebaseProvider>
        <AuthProvider>{children}</AuthProvider>
      </FirebaseProvider>
    </NextIntlClientProvider>
  );
}
