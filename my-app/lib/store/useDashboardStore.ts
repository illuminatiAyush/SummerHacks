import { create } from 'zustand';

export interface DashboardState {
  savingsScore: number;
  monthlyWaste: number;
  fiveYearLoss: number;
  potentialValue: number;
  
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
  savingsScore: 72,
  monthlyWaste: 4500,
  fiveYearLoss: 270000,
  potentialValue: 330000,
  
  challenge: {
    title: "Reduce Food Delivery",
    progress: 60,
    daysLeft: 18,
    stake: 0.05,
  },

  setMetrics: (metrics) => set((state) => ({ ...state, ...metrics })),
  setChallenge: (challenge) => set({ challenge }),
}));
