import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { SubmitAnalysisPayload } from '@/types/analysis';

export function useSubmitAnalysis() {
  const { setStatus, setPayloadId, setErrorMessage } = useAnalysisStore();

  const submit = async (payload: SubmitAnalysisPayload) => {
    setStatus('uploading');
    setErrorMessage(null);

    try {
      const res = await fetch('/analysis/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Submission failed');
      }

      const data = await res.json();
      setPayloadId(data.payload_id);
      setStatus('running');
      return data.payload_id;
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
      throw error;
    }
  };

  return { submit };
}
