'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'highlight' | 'profit' | 'loss';
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatsCardProps) {
  const variants = {
    default: 'bg-[#121216] border-[#27272A]',
    highlight: 'bg-gradient-to-br from-[#F72585]/10 to-[#D91C6B]/5 border-[#F72585]/20',
    profit: 'bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/5 border-[#22C55E]/20',
    loss: 'bg-gradient-to-br from-[#EF4444]/10 to-[#EF4444]/5 border-[#EF4444]/20',
  };

  const valueColors = {
    default: 'text-white',
    highlight: 'text-[#F72585]',
    profit: 'text-[#22C55E]',
    loss: 'text-[#EF4444]',
  };

  const iconBg = {
    default: 'bg-[#1A1A20] text-[#D4D4D8]',
    highlight: 'bg-[#F72585]/20 text-[#F72585]',
    profit: 'bg-[#22C55E]/20 text-[#22C55E]',
    loss: 'bg-[#EF4444]/20 text-[#EF4444]',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:border-[#F72585]/30 hover:shadow-lg hover:shadow-[#F72585]/5',
        variants[variant],
        className
      )}
    >
      {/* 배경 글로우 효과 */}
      {variant === 'highlight' && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F72585]/10 rounded-full blur-3xl" />
      )}

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[#D4D4D8]">{title}</p>
          <p className={cn('text-3xl font-bold tracking-tight', valueColors[variant])}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-[#D4D4D8]">{subtitle}</p>}
        </div>
        <div className={cn('p-2.5 rounded-xl', iconBg[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
