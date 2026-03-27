'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login/user');
      return;
    }

    if (requireAdmin && user.role !== 'ADMIN') {
      router.push('/dashboard/user');
      return;
    }

    setIsAuthorized(true);
  }, [user, token, router, requireAdmin]);

  if (!isAuthorized) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>;
  }

  return <>{children}</>;
}
