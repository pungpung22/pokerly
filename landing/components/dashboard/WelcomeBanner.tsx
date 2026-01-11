'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface WelcomeBannerProps {
  userName: string;
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#121216] via-[#121216] to-[#F72585]/5 border border-[#27272A] p-6">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F72585]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 text-[#D4D4D8] hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative flex items-start gap-4">
        <div className="p-3 rounded-xl bg-[#F72585]/20">
          <Sparkles className="w-6 h-6 text-[#F72585]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Pokerly에 오신 것을 환영합니다!
          </h2>
          <p className="text-sm text-[#D4D4D8] max-w-xl">
            세션을 기록하고 분석하여 포커 실력을 향상시켜 보세요.
          </p>
        </div>
      </div>
    </div>
  );
}
