
import { createClient, Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';

// IMPORTANT:
// The Supabase URL and ANON KEY are directly embedded here as per user provision.
// In a production application, these should be stored in environment variables
// and accessed via process.env.REACT_APP_SUPABASE_URL and process.env.REACT_APP_SUPABASE_ANON_KEY
// (or similar, depending on your build system).
const supabaseUrl = 'https://lxlpwdmfdnrevyapnlmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bHB3ZG1mZG5yZXZ5YXBubG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzI2NjMsImV4cCI6MjA2NTgwODY2M30.sPpPiadiScCC3OKY4c2-dhlCTRczETk_UL_RZpeQw4g';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. Please check your configuration.'
  );
  // You might want to throw an error here or handle it gracefully
  // For this example, we'll proceed, but Supabase functionality will be broken.
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

let currentSession: Session | null = null;

supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
  currentSession = session;
});


// Helper function to get current user's ID or null (synchronously)
export const getCurrentUserId = (): string | null => {
  // This will return the user ID from the most recent session object
  // received by the onAuthStateChange listener.
  // It might be null if no user is logged in, or if the listener hasn't fired yet
  // with a session (e.g., on initial app load before async operations complete).
  // This addresses the "Synchronous check, might not be fully up-to-date initially" nature.
  return currentSession?.user?.id || null;
};
