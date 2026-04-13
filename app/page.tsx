'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && isAdmin) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-text">Redirecting...</div>
    </div>
  );
}
