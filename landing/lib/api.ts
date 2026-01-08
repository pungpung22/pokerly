import { auth } from './firebase';
import type {
  User,
  Session,
  CreateSessionDto,
  Challenge,
  CreateChallengeDto,
  ChallengeStats,
  Trophy,
  Notice,
  Feedback,
  DashboardStats,
  LevelInfo,
  AddXpResult,
  XpType
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthHeader(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeader();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// User API
export const userApi = {
  getMe: () => fetchWithAuth<{ user: User; stats: object }>('/users/me'),

  updateMe: (data: Partial<User>) =>
    fetchWithAuth<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  claimPoints: () =>
    fetchWithAuth<User>('/users/me/claim-points', {
      method: 'POST',
    }),

  getLevelInfo: () => fetchWithAuth<LevelInfo>('/users/me/level'),

  addXp: (type: XpType) =>
    fetchWithAuth<AddXpResult>('/users/me/xp', {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),
};

// Sessions API
export const sessionsApi = {
  getAll: (limit?: number) =>
    fetchWithAuth<Session[]>(`/sessions${limit ? `?limit=${limit}` : ''}`),

  getById: (id: string) =>
    fetchWithAuth<Session>(`/sessions/${id}`),

  create: (data: CreateSessionDto) =>
    fetchWithAuth<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateSessionDto>) =>
    fetchWithAuth<Session>(`/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchWithAuth<void>(`/sessions/${id}`, {
      method: 'DELETE',
    }),

  getStats: () =>
    fetchWithAuth<DashboardStats>('/sessions/stats'),

  getWeekly: () =>
    fetchWithAuth<{ day: string; profit: number; sessions: number }[]>('/sessions/weekly'),

  getMonthly: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    const query = params.toString();
    return fetchWithAuth<{ date: string; profit: number; sessions: number }[]>(
      `/sessions/monthly${query ? `?${query}` : ''}`
    );
  },

  getAnalytics: (period?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return fetchWithAuth<{
      byGameType: { type: string; profit: number; sessions: number; winRate: number }[];
      byStakes: { stakes: string; profit: number; sessions: number; bbPer100: number }[];
      byVenue: { venue: string; profit: number; sessions: number }[];
      dailyTrend: { date: string; profit: number; sessions: number }[];
      monthlyTrend: { month: string; profit: number; sessions: number }[];
      totals: { sessions: number; profit: number; hours: number };
    }>(`/sessions/analytics${query ? `?${query}` : ''}`);
  },
};

// Challenges API
export const challengesApi = {
  getAll: () => fetchWithAuth<Challenge[]>('/challenges'),

  getActive: () => fetchWithAuth<Challenge[]>('/challenges/active'),

  getById: (id: string) => fetchWithAuth<Challenge>(`/challenges/${id}`),

  getStats: () => fetchWithAuth<ChallengeStats>('/challenges/stats'),

  create: (data: CreateChallengeDto) =>
    fetchWithAuth<Challenge>('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateChallengeDto>) =>
    fetchWithAuth<Challenge>(`/challenges/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateProgress: (id: string, increment: number) =>
    fetchWithAuth<Challenge>(`/challenges/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ increment }),
    }),

  delete: (id: string) =>
    fetchWithAuth<void>(`/challenges/${id}`, {
      method: 'DELETE',
    }),

  checkExpired: () =>
    fetchWithAuth<number>('/challenges/check-expired', {
      method: 'POST',
    }),
};

// Trophies API
export const trophiesApi = {
  getAll: () => fetchWithAuth<Trophy[]>('/trophies'),
};

// Notices API
export const noticesApi = {
  getAll: () => fetchWithAuth<Notice[]>('/notices'),
};

// Feedback API
export const feedbackApi = {
  create: (data: { category: string; content: string }) =>
    fetchWithAuth<Feedback>('/feedbacks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyFeedbacks: () => fetchWithAuth<Feedback[]>('/feedbacks/me'),
};

// Uploads API
interface ScreenshotResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  status: 'success' | 'pending_ocr';
  message: string;
}

export const uploadsApi = {
  uploadScreenshot: async (file: File): Promise<ScreenshotResult> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated');
    }
    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/uploads/screenshot`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  uploadScreenshots: async (files: File[]): Promise<{ results: ScreenshotResult[]; totalProcessed: number }> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated');
    }
    const token = await user.getIdToken();

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/uploads/screenshots`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },
};
