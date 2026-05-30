import { createClient, SupabaseClient } from '@supabase/supabase-js';

type EnvMap = Record<string, string | undefined>;

const env = ((import.meta as unknown as { env?: EnvMap }).env || {}) as EnvMap;

export const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
export const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';

let browserClient: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'x-application-name': 'flexapanel',
        },
      },
    });
  }

  return browserClient;
}