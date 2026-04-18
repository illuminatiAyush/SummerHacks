import { create } from 'zustand';

export interface DashboardState {
  savingsScore: number;
  monthlyWaste: number;
  fiveYearLoss: number;
  potentialValue: number;
  
  // AI insight fields
  insight: string;
  goodHabits: string[];
  triggerGenome: string;
  mirrorPrediction: string;
  trendDetection: string;
  highestSpendCategory: string;
  beforeAfterProjection: {
    waste_before: number;
    waste_after: number;
    saved_monthly: number;
    future_saved_5_years: number;
  } | null;
  spendingBreakdown: Record<string, number>;

  challenge: {
    title: string;
    progress: number;
    daysLeft: number;
    stake: number;
  } | null;

  setMetrics: (metrics: Partial<Omit<DashboardState, 'setMetrics' | 'setChallenge'>>) => void;
  setChallenge: (challenge: DashboardState['challenge']) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  savingsScore: 0,
  monthlyWaste: 0,
  fiveYearLoss: 0,
  potentialValue: 0,

  insight: "",
  goodHabits: [],
  triggerGenome: "",
  mirrorPrediction: "",
  trendDetection: "",
  highestSpendCategory: "",
  beforeAfterProjection: null,
  spendingBreakdown: {},
  
  challenge: null,

  setMetrics: (metrics) => set((state) => ({ ...state, ...metrics })),
  setChallenge: (challenge) => set({ challenge }),
}));
