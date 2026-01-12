'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { aiApi } from '@/lib/api';

interface AICoachReportProps {
  locale?: string;
}

export function AICoachReport({ locale = 'ko' }: AICoachReportProps) {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const labels = {
    ko: {
      title: 'AI 코치 리포트',
      subtitle: '당신의 데이터를 분석한 맞춤형 조언',
      generate: 'AI 분석 시작',
      regenerate: '다시 분석',
      generating: '분석 중...',
      generatedAt: '생성 시간',
      error: '리포트 생성 실패. 다시 시도해주세요.',
      noData: '세션 데이터가 필요합니다. 먼저 세션을 기록해주세요.',
    },
    en: {
      title: 'AI Coach Report',
      subtitle: 'Personalized insights based on your data',
      generate: 'Generate AI Analysis',
      regenerate: 'Regenerate',
      generating: 'Analyzing...',
      generatedAt: 'Generated at',
      error: 'Failed to generate report. Please try again.',
      noData: 'Session data required. Please record sessions first.',
    },
    ja: {
      title: 'AIコーチレポート',
      subtitle: 'あなたのデータに基づいたパーソナライズされた分析',
      generate: 'AI分析を開始',
      regenerate: '再分析',
      generating: '分析中...',
      generatedAt: '生成時間',
      error: 'レポート生成に失敗しました。もう一度お試しください。',
      noData: 'セッションデータが必要です。まずセッションを記録してください。',
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.ko;

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiApi.getReport(locale);
      setReport(response.report);
      setGeneratedAt(response.generatedAt);
    } catch (err) {
      console.error('Failed to generate AI report:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const formatReport = (text: string) => {
    // Split by line breaks and render as paragraphs
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;

      // Check for bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-[#14B8A6] mt-1">•</span>
            <span>{line.trim().replace(/^[•\-\*]\s*/, '')}</span>
          </div>
        );
      }

      // Check for numbered items
      if (/^\d+[\.\)]\s/.test(line.trim())) {
        return (
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-[#14B8A6] font-medium">{line.match(/^\d+[\.\)]/)?.[0]}</span>
            <span>{line.replace(/^\d+[\.\)]\s*/, '')}</span>
          </div>
        );
      }

      return <p key={i} className="my-2">{line}</p>;
    });
  };

  return (
    <div className="rounded-xl bg-[#121216] border border-[#27272A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{t.title}</h3>
            <p className="text-xs text-[#71717A]">{t.subtitle}</p>
          </div>
        </div>

        {generatedAt && (
          <span className="text-xs text-[#71717A]">
            {t.generatedAt}: {new Date(generatedAt).toLocaleString(locale === 'en' ? 'en-US' : locale === 'ja' ? 'ja-JP' : 'ko-KR')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {!report && !loading && !error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1A20] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#14B8A6]" />
            </div>
            <p className="text-[#A1A1AA] mb-4">
              {locale === 'ko' && 'AI가 당신의 포커 데이터를 분석하고'}
              {locale === 'en' && 'AI will analyze your poker data and'}
              {locale === 'ja' && 'AIがあなたのポーカーデータを分析し'}
              <br />
              {locale === 'ko' && '개인화된 코칭 리포트를 제공합니다.'}
              {locale === 'en' && 'provide personalized coaching insights.'}
              {locale === 'ja' && 'パーソナライズされたコーチングを提供します。'}
            </p>
            <button
              onClick={generateReport}
              className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              {t.generate}
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1A20] flex items-center justify-center animate-pulse">
              <RefreshCw className="w-8 h-8 text-[#14B8A6] animate-spin" />
            </div>
            <p className="text-[#A1A1AA]">{t.generating}</p>
            <p className="text-xs text-[#52525B] mt-2">
              {locale === 'ko' && '데이터를 분석하고 있습니다...'}
              {locale === 'en' && 'Analyzing your data...'}
              {locale === 'ja' && 'データを分析しています...'}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1A20] flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-[#EF4444]" />
            </div>
            <p className="text-[#EF4444] mb-4">{error}</p>
            <button
              onClick={generateReport}
              className="px-6 py-3 bg-[#27272A] text-white font-medium rounded-lg hover:bg-[#3F3F46] transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              {t.regenerate}
            </button>
          </div>
        )}

        {report && !loading && (
          <div>
            <div className="prose prose-invert prose-sm max-w-none text-[#D4D4D8] leading-relaxed">
              {formatReport(report)}
            </div>

            <div className="mt-6 pt-4 border-t border-[#27272A] flex justify-end">
              <button
                onClick={generateReport}
                className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t.regenerate}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
