import type { Viewport, Metadata } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pokerly.co.kr'),
  title: {
    default: 'Pokerly - 스크린샷으로 포커 수익 자동 기록',
    template: '%s | Pokerly'
  },
  description: '게임 화면만 찍으면 AI가 자동으로 데이터를 추출합니다. 복잡한 입력 없이 당신의 수익률을 한눈에 확인하세요.',
  keywords: ['포커', '포커 기록', '포커 수익', '포커 통계', '홀덤', 'poker tracker', 'poker log', 'poker bankroll', 'poker analytics'],
  authors: [{ name: '풍풍스튜디' }],
  creator: '풍풍스튜디',
  publisher: '풍풍스튜디',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: ['en_US', 'ja_JP'],
    url: 'https://pokerly.co.kr',
    siteName: 'Pokerly',
    title: 'Pokerly - 스크린샷으로 포커 수익 자동 기록',
    description: '게임 화면만 찍으면 AI가 자동으로 데이터를 추출합니다. 복잡한 입력 없이 당신의 수익률을 한눈에 확인하세요.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokerly - 스크린샷으로 포커 수익 자동 기록',
    description: '게임 화면만 찍으면 AI가 자동으로 데이터를 추출합니다.',
  },
  verification: {
    google: '2RhNv4GUsffIqqYVIaJSaN8bgHdvTXXcUDNL4ye81qs',
  },
};

// Schema.org 구조화 데이터
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Pokerly',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  description: '스크린샷 한 장으로 포커 수익을 자동 기록하고 분석하는 스마트 트래커',
  url: 'https://pokerly.co.kr',
  author: {
    '@type': 'Organization',
    name: '풍풍스튜디',
    url: 'https://pokerly.co.kr',
  },
  publisher: {
    '@type': 'Organization',
    name: '풍풍스튜디',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
    description: '무료로 시작 가능',
  },
  featureList: [
    'AI OCR 스크린샷 분석',
    '포커 수익 자동 기록',
    '상세 통계 및 분석',
    '레벨 및 미션 시스템',
    'BB/100 및 ROI 계산',
  ],
  inLanguage: ['ko', 'en', 'ja'],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '200',
    bestRating: '5',
    worstRating: '1',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
