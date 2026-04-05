import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    role?: string;
  };
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata,
          }
        : null,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      error: err instanceof Error ? err : new Error('Authentication failed'),
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    return {
      error: err instanceof Error ? err : new Error('Sign out failed'),
    };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (err) {
    return {
      session: null,
      error: err instanceof Error ? err : new Error('Failed to get session'),
    };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        user_metadata: session.user.user_metadata,
      });
    } else {
      callback(null);
    }
  });

  return {
    unsubscribe: () => {
      data?.subscription?.unsubscribe();
    },
  };
}
