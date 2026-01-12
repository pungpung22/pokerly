'use client';

import { TrendingUp, Info } from 'lucide-react';

interface BB100Data {
  blind: string;
  bb100: number;
  totalProfit: number;
  games: number;
  hands: number;
}

interface BB100TableProps {
  data: BB100Data[];
  locale?: string;
}

export function BB100Table({ data, locale = 'ko' }: BB100TableProps) {
  const labels = {
    ko: {
      title: '블라인드별 BB/100',
      blind: '블라인드',
      bb100: 'BB/100',
      profit: '총 수익',
      games: '세션',
      hands: '핸드',
      noData: '데이터가 없습니다',
      currency: '원',
      tooltip: 'BB/100은 100핸드당 빅블라인드 수익률입니다. 포커 실력을 측정하는 핵심 지표입니다.'
    },
    en: {
      title: 'BB/100 by Stakes',
      blind: 'Stakes',
      bb100: 'BB/100',
      profit: 'Total Profit',
      games: 'Sessions',
      hands: 'Hands',
      noData: 'No data available',
      currency: '',
      tooltip: 'BB/100 is the win rate per 100 hands in big blinds. It\'s the key metric for measuring poker skill.'
    },
    ja: {
      title: 'ブラインド別 BB/100',
      blind: 'ブラインド',
      bb100: 'BB/100',
      profit: '総収益',
      games: 'セッション',
      hands: 'ハンド',
      noData: 'データがありません',
      currency: '円',
      tooltip: 'BB/100は100ハンドあたりのビッグブラインド勝率です。ポーカースキルを測る重要な指標です。'
    }
  };

  const t = labels[locale as keyof typeof labels] || labels.ko;

  const formatProfit = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    if (locale === 'en') {
      return `${prefix}$${Math.abs(value).toLocaleString()}`;
    }
    return `${prefix}${value.toLocaleString()}${t.currency}`;
  };

  // Filter out entries with 0 hands
  const filteredData = data.filter(row => row.hands > 0);

  return (
    <div className="rounded-xl bg-[#121216] border border-[#27272A] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
          <h3 className="font-semibold text-white">{t.title}</h3>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-[#71717A] cursor-help" />
          <div className="absolute right-0 top-6 z-10 w-64 p-3 bg-[#18181B] border border-[#27272A] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-xs text-[#A1A1AA]">
            {t.tooltip}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#27272A]">
              <th className="px-5 py-3 text-left text-sm font-medium text-[#D4D4D8]">{t.blind}</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">{t.bb100}</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">{t.profit}</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">{t.games}</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">{t.hands}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#71717A]">
                  {t.noData}
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr key={i} className="border-b border-[#27272A]/50 hover:bg-[#1A1A20] transition-colors">
                  <td className="px-5 py-3 text-sm text-white font-medium">{row.blind}</td>
                  <td className={`px-5 py-3 text-sm text-right font-bold ${
                    row.bb100 >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}>
                    {row.bb100 >= 0 ? '+' : ''}{row.bb100.toFixed(2)}
                  </td>
                  <td className={`px-5 py-3 text-sm text-right font-medium ${
                    row.totalProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}>
                    {formatProfit(row.totalProfit)}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-[#D4D4D8]">{row.games}</td>
                  <td className="px-5 py-3 text-sm text-right text-[#D4D4D8]">{row.hands.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
