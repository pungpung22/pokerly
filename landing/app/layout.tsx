import type { Viewport, Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_TRACKING_ID = "G-DLGZ6MTLGD";

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
  keywords: ['포커', '포커 기록', '포커 수익', '포커 통계', '홀덤', 'poker tracker', 'poker log'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.min.css"
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
