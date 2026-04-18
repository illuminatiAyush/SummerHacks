import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  isDemoMode: boolean;
  walletAddress: string | null;
  setDemoMode: (isDemoMode: boolean) => void;
  setWalletAddress: (address: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      walletAddress: null,
      setDemoMode: (isDemoMode) => set({ isDemoMode }),
      setWalletAddress: (walletAddress) => set({ walletAddress }),
    }),
    {
      name: 'expense-autopsy-app-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
