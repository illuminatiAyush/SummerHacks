export interface AnalysisResult {
  highest_spend_category: string;
  monthly_waste: number;
  raw_5_year_loss: number;
  future_invested_value: number;
  savings_score: number;
  emotional_message: string;
  spending_breakdown: Record<string, number>;
  blockchain_tx?: string;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  wallet_address: string;
  monthly_income: number;
  financial_goal: string;
}

export interface Challenge {
  id: string;
  user_id: string;
  category: string;
  duration_days: number;
  stake_amount: number;
  target_reduction: number;
  status: string;
  tx_hash: string;
  progress: number;
}

export interface Trigger {
  id: string;
  user_id: string;
  pattern: string;
  predicted_time: string;
  notification_sent: boolean;
}
