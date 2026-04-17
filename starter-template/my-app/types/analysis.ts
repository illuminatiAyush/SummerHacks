export interface AnalysisResult {
  highest_spend_category: string;
  monthly_waste: number;
  raw_5_year_loss: number;
  future_invested_value: number;
  savings_score: number;
  emotional_message: string;
  spending_breakdown: Record<string, number>;
}

export interface AnalysisStatusResponse {
  payload_id: string;
  status: 'started' | 'processing' | 'completed' | 'error';
  result?: AnalysisResult;
}

export interface SubmitAnalysisPayload {
  goal: string;
  stipend: number;
  raw_input: string;
}
