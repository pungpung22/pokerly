'use client';

import { SectionCard } from './SectionCard';
import { Trophy } from 'lucide-react';

export function ActiveChallenges() {
  return (
    <SectionCard
      title="진행 중인 챌린지"
      icon={Trophy}
      href="/app/challenges"
      emptyMessage="진행 중인 챌린지가 없습니다"
      actionText="챌린지 참여하기"
      actionHref="/app/challenges"
    />
  );
}
