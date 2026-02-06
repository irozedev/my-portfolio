import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Safe storage initialization - works in SSR and browser
const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  // Fallback for SSR - in-memory storage
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};

// Create a singleton Supabase client with unique storage key
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'roze-live-auth-token', // Updated storage key for new domain
    storage: getStorage(),
    flowType: 'pkce', // Use PKCE flow for better security
  },
});
