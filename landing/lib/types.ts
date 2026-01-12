// User types
export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  provider: 'google' | 'apple' | 'email';
  level: number;
  totalPoints: number;
  pendingPoints: number;
  monthlyPoints: number;
  currentXp: number;
  todayXp: number;
  todayManualXp: number;
  locale: string;
  theme: string;
  notificationsEnabled: boolean;
  rankingOptIn: boolean;
  rankingOptInDate: string | null;
  rankingNickname: string | null;
  createdAt: string;
  updatedAt: string;
}

// Level types
export type XpType = 'dailyLogin' | 'uploadScreenshot' | 'manualRecord' | 'viewAnalytics';

export const levelNames: Record<number, string> = {
  1: '관찰자',
  2: '입문자',
  3: '플레이어',
  4: '레귤러',
  5: '샤크',
  6: '마스터',
  7: '그랜드마스터',
  8: '레전드',
};

export interface XpRules {
  dailyLogin: number;
  uploadScreenshot: number;
  manualRecord: number;
  viewAnalytics: number;
  manualRecordDailyLimit: number;
}

export interface LevelInfo {
  level: number;
  levelName: string;
  currentXp: number;
  requiredXp: number;
  progress: number;
  todayXp: number;
  totalXp: number;
  xpRules: XpRules;
  todayManualXp: number;
  canEarnLoginXp: boolean;
  canEarnAnalyticsXp: boolean;
}

export interface AddXpResult {
  user: User;
  xpAwarded: number;
  leveledUp: boolean;
  message?: string;
}

// Session types
export type GameType = 'cash' | 'tournament';
export type PlayerLevel = 'fish' | 'beginner' | 'intermediate' | 'advanced' | 'pro' | 'master';

export const playerLevelLabels: Record<PlayerLevel, string> = {
  fish: '피쉬',
  beginner: '초보',
  intermediate: '중수',
  advanced: '고수',
  pro: '프로',
  master: '마스터',
};

export interface Session {
  id: string;
  userId: string;
  date: string;
  venue: string;
  gameType: GameType;
  stakes: string;
  durationMinutes: number;
  buyIn: number;
  cashOut: number;
  notes: string | null;
  screenshotUrl: string | null;
  startTime: string | null;
  tableId: string | null;
  hands: number;
  level: PlayerLevel | null;
  blinds: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  profit?: number;
}

export interface CreateSessionDto {
  date: string;
  venue: string;
  gameType: GameType;
  stakes: string;
  durationMinutes: number;
  buyIn: number;
  cashOut: number;
  notes?: string;
  screenshotUrl?: string;
  startTime?: string;
  tableId?: string;
  hands?: number;
  level?: PlayerLevel;
  blinds?: string;
  tags?: string[];
  imageHash?: string;
  rawText?: string;
}

// Challenge types
export type ChallengeType = 'sessions' | 'profit' | 'hours' | 'streak' | 'venue';
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

export const challengeTypeLabels: Record<ChallengeType, string> = {
  sessions: '세션 수',
  profit: '수익',
  hours: '플레이 시간',
  streak: '연속 기록',
  venue: '장소',
};

export const challengeStatusLabels: Record<ChallengeStatus, string> = {
  active: '진행 중',
  completed: '완료',
  failed: '실패',
  expired: '만료',
};

export interface Challenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: ChallengeType;
  targetValue: number;
  currentValue: number;
  rewardPoints: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallengeDto {
  title: string;
  description: string;
  type: ChallengeType;
  targetValue: number;
  rewardPoints: number;
  startDate: string;
  endDate: string;
}

export interface ChallengeStats {
  total: number;
  active: number;
  completed: number;
  failed: number;
  expired: number;
  completionRate: number;
  totalRewardsEarned: number;
}

// Trophy types
export interface Trophy {
  id: string;
  userId: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: string;
  createdAt: string;
}

// Notice types
export interface Notice {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
}

// Feedback types
export interface Feedback {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  replyEmail?: string;
  status: string;
  createdAt: string;
}

// Stats types
export interface DashboardStats {
  totalProfit: number;
  totalSessions: number;
  totalHours: number;
  totalHands: number;
  todayProfit: number;
  weekProfit: number;
  monthProfit: number;
  winRate: number;
  avgSessionProfit?: number;
  currentStreak?: number;
  bestSession?: number;
  worstSession?: number;
  thisMonthProfit?: number;
  thisMonthSessions?: number;
}

export interface MonthlyStats {
  month: string;
  profit: number;
  sessions: number;
}

// Ranking types
export type RankingCategory = 'winRate' | 'profit' | 'sessions' | 'level' | 'missions';

export interface RankingEntry {
  rank: number;
  nickname: string;
  value: number;
  userId: string;
  level: number;
}

export interface RankingsResponse {
  rankings: RankingEntry[];
  totalParticipants: number;
}

export interface MyRankingCategory {
  rank: number;
  value: number;
  total: number;
}

export interface MyRankingResponse {
  optedIn: boolean;
  nickname?: string;
  rankings?: {
    winRate: MyRankingCategory | null;
    profit: MyRankingCategory;
    sessions: MyRankingCategory;
    level: MyRankingCategory;
    missions: MyRankingCategory;
  };
}
