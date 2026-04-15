'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, onAuthStateChange } from '@/lib/auth';
import { getPermissionsByRole, RolePermissions } from '@/lib/permissions';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role?: string;
  permissions: RolePermissions;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  role: undefined,
  permissions: getPermissionsByRole(undefined),
});

function isUserAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  const role = user.user_metadata?.role?.toLowerCase();
  return role === 'admin' || role === 'super_admin';
}

function getUserRole(user: AuthUser | null): string | undefined {
  if (!user) return undefined;
  return user.user_metadata?.role?.toLowerCase();
}

function isSuperAdminUser(user: AuthUser | null): boolean {
  if (!user) return false;
  const role = user.user_metadata?.role?.toLowerCase();
  return role === 'super_admin';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const subscription = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const role = getUserRole(user);
  const permissions = getPermissionsByRole(role);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: isUserAdmin(user),
    isSuperAdmin: isSuperAdminUser(user),
    role,
    permissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
