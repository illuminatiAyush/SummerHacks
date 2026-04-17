/**
 * ExpenseAutopsy API Endpoints Definition
 * Backend endpoints for statement analysis, challenge management, and leaderboard
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ============ USER ENDPOINTS ============

export interface UserOnboardPayload {
  name: string;
  email: string;
  wallet_address: string;
  stipend: number; // Monthly stipend in INR
  selected_goal: string; // e.g., "Bike", "Goa Trip", "Gaming Laptop"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  wallet_address: string;
  stipend: number;
  selected_goal: string;
  community_name: string;
  created_at: string;
}

export async function onboardUser(payload: UserOnboardPayload): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/user/onboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to onboard user");
  return res.json();
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

// ============ STATEMENT UPLOAD & PARSING ============

export interface UploadedStatement {
  id: string;
  user_id: string;
  raw_text: string;
  parsed_transactions: ParsedTransaction[];
  uploaded_at: string;
  file_type: "pdf" | "excel" | "screenshot" | "text" | "image";
}

export interface ParsedTransaction {
  id: string;
  merchant_name: string;
  amount: number;
  timestamp: string;
  category?: string;
  description?: string;
}

export async function uploadStatement(
  userId: string,
  file: File
): Promise<UploadedStatement> {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/statements/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload statement");
  return res.json();
}

export interface ParseStatementPayload {
  user_id: string;
  raw_text: string;
  file_type: "pdf" | "excel" | "screenshot" | "text" | "image";
}

export async function parseStatement(
  payload: ParseStatementPayload
): Promise<UploadedStatement> {
  const res = await fetch(`${API_BASE}/statements/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to parse statement");
  return res.json();
}

// ============ ANALYSIS ENDPOINTS ============

export interface CategoryAnalysis {
  category: string;
  total_spent: number;
  transaction_count: number;
  merchants: string[];
  percentage_of_total: number;
}

export interface CategorizedTransactions {
  statement_id: string;
  user_id: string;
  total_spent: number;
  categories: CategoryAnalysis[];
  highest_spend_category: string;
  highest_spend_amount: number;
}

export async function categorizeMerchants(
  userId: string,
  statementId: string,
  transactions: ParsedTransaction[]
): Promise<CategorizedTransactions> {
  const res = await fetch(`${API_BASE}/analysis/categorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      statement_id: statementId,
      transactions,
    }),
  });
  if (!res.ok) throw new Error("Failed to categorize transactions");
  return res.json();
}

export interface SavingsScoreResult {
  savings_score: number; // 0-100
  leakage_level: "low" | "moderate" | "high"; // 0-30=low, 31-60=moderate, 61-100=high
  monthly_waste: number;
  discretionary_percentage: number;
  analysis_text: string;
}

export async function calculateSavingsScore(
  userId: string,
  categories: CategoryAnalysis[],
  stipend: number
): Promise<SavingsScoreResult> {
  const res = await fetch(`${API_BASE}/analysis/savings-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      categories,
      stipend,
    }),
  });
  if (!res.ok) throw new Error("Failed to calculate savings score");
  return res.json();
}

export interface MoneyMirrorProjection {
  monthly_spend: number;
  raw_5_year_total: number;
  invested_5_year_value: number; // At 8% annual return
  opportunity_cost: number; // difference
  projection_data: Array<{
    month: number;
    cumulative_spend: number;
    invested_value: number;
  }>;
}

export async function calculateProjections(
  monthlySpend: number,
  category: string
): Promise<MoneyMirrorProjection> {
  const res = await fetch(`${API_BASE}/analysis/projections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      monthly_spend: monthlySpend,
      category,
      years: 5,
      annual_return: 0.08,
    }),
  });
  if (!res.ok) throw new Error("Failed to calculate projections");
  return res.json();
}

export interface EmotionalCoachingResult {
  roast: string; // Tough-love coaching message
  motivation: string; // Positive reinforcement
  goal_connection: string; // How this connects to their goal
  confidence_score: number; // 0-1
}

export async function generateEmotionalCoaching(
  userId: string,
  userGoal: string,
  highestSpendCategory: string,
  monthlyWaste: number,
  savingsScore: number
): Promise<EmotionalCoachingResult> {
  const res = await fetch(`${API_BASE}/analysis/coaching`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      goal: userGoal,
      highest_spend_category: highestSpendCategory,
      monthly_waste: monthlyWaste,
      savings_score: savingsScore,
    }),
  });
  if (!res.ok) throw new Error("Failed to generate coaching message");
  return res.json();
}

// ============ CHALLENGE ENDPOINTS ============

export interface Challenge {
  id: string;
  user_id: string;
  highest_spend_category: string;
  challenge_duration: number; // in days
  stake_amount: number; // in Sepolia ETH
  target_reduction_percentage: number; // default 30%
  status: "active" | "completed" | "failed" | "pending";
  created_at: string;
  ends_at: string;
  initial_monthly_spend: number;
  initial_statement_id: string;
  final_statement_id?: string;
}

export interface CreateChallengePayload {
  user_id: string;
  analysis_id: string;
  highest_spend_category: string;
  initial_monthly_spend: number;
  challenge_duration: number; // days
  stake_amount: number; // ETH
  target_reduction_percentage?: number; // defaults to 30
}

export async function createChallenge(
  payload: CreateChallengePayload
): Promise<Challenge> {
  const res = await fetch(`${API_BASE}/challenges/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create challenge");
  return res.json();
}

export interface ChallengeVerificationResult {
  challenge_id: string;
  status: "success" | "failure";
  initial_spend: number;
  final_spend: number;
  reduction_percentage: number;
  target_reduction_percentage: number;
  message: string;
  escrow_status: "released" | "locked" | "pending";
}

export async function verifyChallenge(
  challengeId: string,
  finalStatementId: string,
  finalMonthlySpend: number
): Promise<ChallengeVerificationResult> {
  const res = await fetch(`${API_BASE}/challenges/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      challenge_id: challengeId,
      final_statement_id: finalStatementId,
      final_monthly_spend: finalMonthlySpend,
    }),
  });
  if (!res.ok) throw new Error("Failed to verify challenge");
  return res.json();
}

// ============ ESCROW ENDPOINTS ============

export interface EscrowTransaction {
  id: string;
  challenge_id: string;
  user_id: string;
  amount: number; // ETH
  tx_hash: string;
  explorer_url: string;
  status: "pending" | "confirmed" | "released" | "forfeited";
  created_at: string;
  network: "sepolia";
}

export interface CreateEscrowPayload {
  challenge_id: string;
  user_id: string;
  amount: number; // ETH on Sepolia
  wallet_address: string;
}

export async function createEscrowTransaction(
  payload: CreateEscrowPayload
): Promise<EscrowTransaction> {
  const res = await fetch(`${API_BASE}/escrow/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create escrow transaction");
  return res.json();
}

export async function releaseEscrow(
  escrowId: string,
  challengeId: string
): Promise<EscrowTransaction> {
  const res = await fetch(`${API_BASE}/escrow/release`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      escrow_id: escrowId,
      challenge_id: challengeId,
    }),
  });
  if (!res.ok) throw new Error("Failed to release escrow");
  return res.json();
}

// ============ LEADERBOARD ENDPOINTS ============

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  community_name: string;
  savings_score: number;
  streak_days: number;
  total_saved: number;
  reduction_percentage: number;
  challenges_completed: number;
}

export async function getLeaderboard(
  communityName: string,
  limit: number = 50
): Promise<LeaderboardEntry[]> {
  const res = await fetch(
    `${API_BASE}/leaderboard/${encodeURIComponent(communityName)}?limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export interface UpdateLeaderboardPayload {
  user_id: string;
  community_name: string;
  savings_score: number;
  total_saved: number;
  reduction_percentage: number;
  challenge_id: string;
}

export async function updateLeaderboard(
  payload: UpdateLeaderboardPayload
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/leaderboard/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update leaderboard");
  return res.json();
}

// ============ HEALTH CHECK ============

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("API is not responding");
  return res.json();
}
