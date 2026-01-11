'use client';

import { TrendingUp } from 'lucide-react';

interface BB100Data {
  blind: string;
  bb100: number;
  totalProfit: number;
  games: number;
  hands: number;
}

interface BB100TableProps {
  data: BB100Data[];
}

export function BB100Table({ data }: BB100TableProps) {
  return (
    <div className="rounded-xl bg-[#121216] border border-[#27272A] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#F72585]" />
          <h3 className="font-semibold text-white">블라인드별 BB/100</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-[#F72585]/10 text-[#F72585]">Premium</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#27272A]">
              <th className="px-5 py-3 text-left text-sm font-medium text-[#D4D4D8]">블라인드</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">BB/100</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">총 수익</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">게임 수</th>
              <th className="px-5 py-3 text-right text-sm font-medium text-[#D4D4D8]">핸드 수</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#D4D4D8]">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="border-b border-[#27272A]/50 hover:bg-[#1A1A20] transition-colors">
                  <td className="px-5 py-3 text-sm text-white">{row.blind}</td>
                  <td className={`px-5 py-3 text-sm text-right font-medium ${
                    row.bb100 >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}>
                    {row.bb100 >= 0 ? '+' : ''}{row.bb100.toFixed(1)}bb/100
                  </td>
                  <td className={`px-5 py-3 text-sm text-right ${
                    row.totalProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}>
                    {row.totalProfit >= 0 ? '+' : ''}{row.totalProfit.toLocaleString()}원
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-[#D4D4D8]">{row.games}게임</td>
                  <td className="px-5 py-3 text-sm text-right text-[#D4D4D8]">{row.hands}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
