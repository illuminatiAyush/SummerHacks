'use client';

import React, { createContext, useContext, useState } from 'react';

export interface AnalysisState {
  statement_id?: string;
  parsed_transactions?: any[];
  categories?: any[];
  highest_spend_category?: string;
  highest_spend_amount?: number;
  savings_score?: number;
  monthly_waste?: number;
  projections?: any;
  coaching?: any;
  challenge_id?: string;
  escrow_tx?: string;
}

interface AppContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  analysis: AnalysisState;
  setAnalysis: (state: AnalysisState) => void;
  resetAnalysis: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({});

  const resetAnalysis = () => setAnalysis({});

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        analysis,
        setAnalysis,
        resetAnalysis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
