import { useQuery } from '@tanstack/react-query';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { AnalysisStatusResponse } from '@/types/analysis';
import { useEffect } from 'react';

export function usePollAnalysis() {
  const { payloadId, setStatus, setAnalysisResult, setErrorMessage } = useAnalysisStore();

  const { data, error, isLoading } = useQuery<AnalysisStatusResponse>({
    queryKey: ['analysis', payloadId],
    queryFn: async () => {
      const res = await fetch(`/analysis/api/status/${payloadId}`);
      if (!res.ok) throw new Error('Failed to fetch status');
      return res.json();
    },
    enabled: !!payloadId,
    refetchInterval: (query) => {
      const data = query.state.data as AnalysisStatusResponse | undefined;
      if (data?.status === 'completed' || data?.status === 'error') {
        return false;
      }
      return 2000;
    },
  });

  useEffect(() => {
    if (data) {
      if (data.status === 'completed' && data.result) {
        setAnalysisResult(data.result);
        setStatus('completed');
      } else if (data.status === 'error') {
        setStatus('error');
        setErrorMessage('An error occurred during AI analysis');
      } else if (data.status === 'started' || data.status === 'processing') {
        setStatus('running');
      }
    }
    
    if (error) {
      setStatus('error');
      setErrorMessage((error as Error).message);
    }
  }, [data, error, setStatus, setAnalysisResult, setErrorMessage]);

  return { data, isLoading, error };
}
