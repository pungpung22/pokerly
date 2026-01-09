'use client';

import { SectionCard } from './SectionCard';
import { Clock } from 'lucide-react';

export function RecentSessions() {
  return (
    <SectionCard
      title="최근 세션"
      icon={Clock}
      href="/app/sessions"
      emptyMessage="아직 기록된 세션이 없습니다"
      actionText="+ 첫 세션 기록하기"
      actionHref="/app/upload"
    />
  );
}
