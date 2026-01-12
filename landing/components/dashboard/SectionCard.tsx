'use client';

import { LucideIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  emptyMessage: string;
  actionText: string;
  actionHref: string;
  children?: React.ReactNode;
}

export function SectionCard({
  title,
  icon: Icon,
  href,
  emptyMessage,
  actionText,
  actionHref,
  children,
}: SectionCardProps) {
  const isEmpty = !children;

  return (
    <div className="rounded-xl bg-[#121216] border border-[#27272A] overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-[#14B8A6]" />
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <Link
          href={href}
          className="text-sm text-[#D4D4D8] hover:text-[#14B8A6] transition-colors flex items-center gap-1"
        >
          전체 보기
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 컨텐츠 */}
      <div className="p-5">
        {isEmpty ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-[#D4D4D8]">{emptyMessage}</p>
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] font-medium rounded-lg transition-colors border border-[#14B8A6]/20"
            >
              {actionText}
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
