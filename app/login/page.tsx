'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import Button from '@/components/Button';

function isUserAdmin(userMetadata: any): boolean {
  const role = userMetadata?.role?.toLowerCase();
  return role === 'admin' || role === 'super_admin';
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/dashboard');
    }
  }, [user, loading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { user: authUser, error: authError } = await signInWithEmail(email, password);

    if (authError) {
      setError(authError.message || 'Invalid credentials');
      setIsLoading(false);
    } else if (authUser) {
      // Check if user is admin or super_admin
      if (!isUserAdmin(authUser.user_metadata)) {
        setError('Access denied. Only admin and super admin users are allowed.');
        setIsLoading(false);
      } else {
        // Auth succeeded, redirect will happen via useEffect
        router.push('/dashboard');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-bebas text-4xl tracking-widest text-accent mb-2">ASTRAL GYM</h1>
            <p className="text-muted text-sm">Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-display text-text mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-surface2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                placeholder="admin@astral-gym.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-display text-text mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-surface2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-accent2/10 border border-accent2/20 rounded-lg text-accent2 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-2.5"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted text-xs mt-6">
            Staff & Admin Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
