import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env variables missing");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Profiles ──
export async function createProfile(data: {
  id?: string;
  name: string;
  email: string;
  wallet_address: string;
  monthly_income: number;
  financial_goal: string;
}) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return profile;
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// ── Expenses ──
export async function saveExpenses(userId: string, expenses: Array<{
  amount: number;
  category: string;
  description: string;
  opportunity_cost_5yr: number;
  source: string;
  payload_id: string;
}>) {
  const rows = expenses.map(e => ({ ...e, user_id: userId }));
  const { data, error } = await supabase
    .from('expenses')
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
}

export async function getExpenses(userId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ── Challenges ──
export async function createChallenge(data: {
  user_id: string;
  category: string;
  duration_days: number;
  stake_amount: number;
  target_reduction: number;
  tx_hash?: string;
}) {
  const { data: challenge, error } = await supabase
    .from('challenges')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return challenge;
}

export async function getActiveChallenge(userId: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateChallengeProgress(challengeId: string, progress: number) {
  const { data, error } = await supabase
    .from('challenges')
    .update({ progress })
    .eq('id', challengeId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Triggers ──
export async function saveTriggers(userId: string, triggers: Array<{
  pattern: string;
  predicted_time: string;
}>) {
  const rows = triggers.map(t => ({ ...t, user_id: userId }));
  const { data, error } = await supabase
    .from('triggers')
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
}

export async function getTriggers(userId: string) {
  const { data, error } = await supabase
    .from('triggers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
