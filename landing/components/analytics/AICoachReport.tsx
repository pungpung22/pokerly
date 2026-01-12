'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Brain, Zap, Target, AlertCircle, ChevronRight } from 'lucide-react';
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
      subtitle: 'GPT-4 기반 맞춤형 분석',
      generate: 'AI 분석 시작',
      regenerate: '다시 분석',
      generating: '분석 중...',
      generatedAt: '생성 시간',
      error: '리포트 생성 실패. 다시 시도해주세요.',
      noData: '세션 데이터가 필요합니다. 먼저 세션을 기록해주세요.',
      feature1: '플레이 패턴 분석',
      feature2: '약점 진단',
      feature3: '맞춤 전략 제안',
      cta: '무료로 분석받기',
    },
    en: {
      title: 'AI Coach Report',
      subtitle: 'GPT-4 Powered Analysis',
      generate: 'Start AI Analysis',
      regenerate: 'Regenerate',
      generating: 'Analyzing...',
      generatedAt: 'Generated at',
      error: 'Failed to generate report. Please try again.',
      noData: 'Session data required. Please record sessions first.',
      feature1: 'Play Pattern Analysis',
      feature2: 'Weakness Diagnosis',
      feature3: 'Custom Strategy Tips',
      cta: 'Get Free Analysis',
    },
    ja: {
      title: 'AIコーチレポート',
      subtitle: 'GPT-4ベースの分析',
      generate: 'AI分析を開始',
      regenerate: '再分析',
      generating: '分析中...',
      generatedAt: '生成時間',
      error: 'レポート生成に失敗しました。もう一度お試しください。',
      noData: 'セッションデータが必要です。まずセッションを記録してください。',
      feature1: 'プレイパターン分析',
      feature2: '弱点診断',
      feature3: 'カスタム戦略提案',
      cta: '無料で分析',
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
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;

      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <div key={i} className="ai-report-bullet">
            <span className="ai-report-bullet-icon">•</span>
            <span>{line.trim().replace(/^[•\-\*]\s*/, '')}</span>
          </div>
        );
      }

      if (/^\d+[\.\)]\s/.test(line.trim())) {
        return (
          <div key={i} className="ai-report-numbered">
            <span className="ai-report-number">{line.match(/^\d+[\.\)]/)?.[0]}</span>
            <span>{line.replace(/^\d+[\.\)]\s*/, '')}</span>
          </div>
        );
      }

      return <p key={i} className="ai-report-paragraph">{line}</p>;
    });
  };

  return (
    <div className="ai-coach-card">
      {/* Gradient Background Effect */}
      <div className="ai-coach-glow" />

      {/* Header */}
      <div className="ai-coach-header">
        <div className="ai-coach-header-left">
          <div className="ai-coach-icon-wrapper">
            <Sparkles className="ai-coach-icon" />
            <div className="ai-coach-icon-ring" />
          </div>
          <div>
            <div className="ai-coach-title-row">
              <h3 className="ai-coach-title">{t.title}</h3>
              <span className="ai-coach-badge">NEW</span>
            </div>
            <p className="ai-coach-subtitle">{t.subtitle}</p>
          </div>
        </div>

        {generatedAt && (
          <span className="ai-coach-timestamp">
            {t.generatedAt}: {new Date(generatedAt).toLocaleString(locale === 'en' ? 'en-US' : locale === 'ja' ? 'ja-JP' : 'ko-KR')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="ai-coach-content">
        {!report && !loading && !error && (
          <div className="ai-coach-empty">
            {/* Feature Pills */}
            <div className="ai-coach-features">
              <div className="ai-coach-feature">
                <Brain style={{ width: 14, height: 14 }} />
                <span>{t.feature1}</span>
              </div>
              <div className="ai-coach-feature">
                <Target style={{ width: 14, height: 14 }} />
                <span>{t.feature2}</span>
              </div>
              <div className="ai-coach-feature">
                <Zap style={{ width: 14, height: 14 }} />
                <span>{t.feature3}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button onClick={generateReport} className="ai-coach-cta">
              <Sparkles style={{ width: 18, height: 18 }} />
              <span>{t.cta}</span>
              <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        )}

        {loading && (
          <div className="ai-coach-loading">
            <div className="ai-coach-loading-icon">
              <RefreshCw className="ai-coach-spinner" />
            </div>
            <p className="ai-coach-loading-text">{t.generating}</p>
            <div className="ai-coach-loading-dots">
              <span className="ai-coach-dot" />
              <span className="ai-coach-dot" />
              <span className="ai-coach-dot" />
            </div>
          </div>
        )}

        {error && (
          <div className="ai-coach-error">
            <div className="ai-coach-error-icon">
              <AlertCircle style={{ width: 32, height: 32, color: '#EF4444' }} />
            </div>
            <p className="ai-coach-error-text">{error}</p>
            <button onClick={generateReport} className="ai-coach-retry">
              <RefreshCw style={{ width: 16, height: 16 }} />
              {t.regenerate}
            </button>
          </div>
        )}

        {report && !loading && (
          <div className="ai-coach-report">
            <div className="ai-coach-report-content">
              {formatReport(report)}
            </div>

            <div className="ai-coach-report-footer">
              <button onClick={generateReport} className="ai-coach-regenerate">
                <RefreshCw style={{ width: 14, height: 14 }} />
                {t.regenerate}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .ai-coach-card {
          position: relative;
          border-radius: 16px;
          background: linear-gradient(145deg, #1A1A20 0%, #121216 100%);
          border: 1px solid rgba(20, 184, 166, 0.3);
          overflow: hidden;
        }

        .ai-coach-glow {
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .ai-coach-header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(39, 39, 42, 0.8);
          background: rgba(20, 184, 166, 0.03);
        }

        .ai-coach-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ai-coach-icon-wrapper {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(20, 184, 166, 0.4);
        }

        .ai-coach-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .ai-coach-icon-ring {
          position: absolute;
          inset: -4px;
          border-radius: 18px;
          border: 2px solid rgba(20, 184, 166, 0.3);
          animation: pulse-ring 2s ease-out infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        .ai-coach-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-coach-title {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .ai-coach-badge {
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 700;
          color: #14B8A6;
          background: rgba(20, 184, 166, 0.15);
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .ai-coach-subtitle {
          font-size: 13px;
          color: #71717A;
          margin: 4px 0 0 0;
        }

        .ai-coach-timestamp {
          font-size: 11px;
          color: #52525B;
        }

        .ai-coach-content {
          position: relative;
          padding: 24px;
        }

        .ai-coach-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 16px 0;
        }

        .ai-coach-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .ai-coach-feature {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(20, 184, 166, 0.08);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 20px;
          font-size: 13px;
          color: #A1A1AA;
        }

        .ai-coach-feature svg {
          color: #14B8A6;
        }

        .ai-coach-cta {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(20, 184, 166, 0.35);
        }

        .ai-coach-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(20, 184, 166, 0.45);
        }

        .ai-coach-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px 0;
        }

        .ai-coach-loading-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(20, 184, 166, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-coach-spinner {
          width: 28px;
          height: 28px;
          color: #14B8A6;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ai-coach-loading-text {
          font-size: 15px;
          color: #A1A1AA;
          margin: 0;
        }

        .ai-coach-loading-dots {
          display: flex;
          gap: 6px;
        }

        .ai-coach-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #14B8A6;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .ai-coach-dot:nth-child(1) { animation-delay: -0.32s; }
        .ai-coach-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .ai-coach-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px 0;
        }

        .ai-coach-error-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-coach-error-text {
          font-size: 14px;
          color: #EF4444;
          margin: 0;
        }

        .ai-coach-retry {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 14px;
          color: white;
          background: #27272A;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .ai-coach-retry:hover {
          background: #3F3F46;
        }

        .ai-coach-report {
          display: flex;
          flex-direction: column;
        }

        .ai-coach-report-content {
          font-size: 14px;
          line-height: 1.7;
          color: #D4D4D8;
        }

        .ai-coach-report-footer {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #27272A;
          display: flex;
          justify-content: flex-end;
        }

        .ai-coach-regenerate {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 13px;
          color: #71717A;
          background: transparent;
          border: 1px solid #27272A;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-coach-regenerate:hover {
          color: white;
          border-color: #3F3F46;
        }
      `}</style>

      <style jsx global>{`
        .ai-report-bullet {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 8px 0;
        }

        .ai-report-bullet-icon {
          color: #14B8A6;
          font-weight: bold;
          margin-top: 2px;
        }

        .ai-report-numbered {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 8px 0;
        }

        .ai-report-number {
          color: #14B8A6;
          font-weight: 600;
          min-width: 20px;
        }

        .ai-report-paragraph {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}
