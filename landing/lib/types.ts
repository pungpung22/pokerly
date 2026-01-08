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
  locale: string;
  theme: string;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
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
}

// Challenge types
export interface Challenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  reward: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
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
  category: string;
  content: string;
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
