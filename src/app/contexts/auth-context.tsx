import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  accessToken: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  updateUserMetadata: (metadata: Record<string, any>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`, // Redirect to home page after auth
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error(`Error signing in with ${provider}:`, error);
        
        // Provide helpful error messages
        if (error.message.includes('provider') || error.message.includes('not enabled')) {
          throw new Error(
            `${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not configured yet. ` +
            `Please enable ${provider} OAuth in your Supabase dashboard.`
          );
        }
        
        throw new Error(`Failed to sign in with ${provider}. ${error.message}`);
      }

      console.log('OAuth redirect initiated successfully', data);
    } catch (error: any) {
      console.error(`Sign in with ${provider} failed:`, error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserMetadata = (metadata: Record<string, any>) => {
    if (user) {
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          ...metadata,
        },
      });
    }
  };

  const accessToken = session?.access_token ?? null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      accessToken,
      signInWithGoogle, 
      signInWithProvider,
      signOut,
      updateUserMetadata,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values for hot reload compatibility
    // This prevents crashes during development when components re-render
    return {
      user: null,
      session: null,
      loading: false,
      accessToken: null,
      signInWithGoogle: async () => {
        throw new Error('Auth not initialized');
      },
      signInWithProvider: async () => {
        throw new Error('Auth not initialized');
      },
      signOut: async () => {
        throw new Error('Auth not initialized');
      },
      updateUserMetadata: () => {
        console.warn('Auth not initialized');
      },
    };
  }
  return context;
}