import { create } from 'zustand';
import { AnalysisResult } from '@/types/analysis';

interface AnalysisStore {
  uploadedFile: File | null;
  selectedGoal: string;
  stipend: number;
  payloadId: string | null;
  status: 'idle' | 'uploading' | 'running' | 'completed' | 'error';
  errorMessage: string | null;
  analysisResult: AnalysisResult | null;

  setUploadedFile: (file: File | null) => void;
  setSelectedGoal: (goal: string) => void;
  setStipend: (stipend: number) => void;
  setPayloadId: (payloadId: string | null) => void;
  setStatus: (status: AnalysisStore['status']) => void;
  setErrorMessage: (message: string | null) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  resetAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  uploadedFile: null,
  selectedGoal: '',
  stipend: 0,
  payloadId: null,
  status: 'idle',
  errorMessage: null,
  analysisResult: null,

  setUploadedFile: (file) => set({ uploadedFile: file }),
  setSelectedGoal: (goal) => set({ selectedGoal: goal }),
  setStipend: (stipend) => set({ stipend }),
  setPayloadId: (payloadId) => set({ payloadId }),
  setStatus: (status) => set({ status }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  resetAnalysis: () => set({
    uploadedFile: null,
    payloadId: null,
    status: 'idle',
    errorMessage: null,
    analysisResult: null
  }),
}));
