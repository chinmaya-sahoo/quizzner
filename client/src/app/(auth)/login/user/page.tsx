'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function UserLogin() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.user.role !== 'USER') {
        throw new Error('Please use the Admin login page.');
      }
      login(res.data.user, res.data.token);
      router.push('/dashboard/user');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } }; message?: string };
      setError(axiosErr.response?.data?.error || axiosErr.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to your user account</p>
        </div>
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input {...register('email')} className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="you@example.com" />
              {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" {...register('password')} className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="••••••••" />
              {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="flex flex-col space-y-4 mt-6">
          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Register here</Link>
          </div>
          <div className="text-center pt-4 border-t border-gray-100">
            <Link href="/login/admin" className="text-xs font-medium text-gray-400 hover:text-gray-800 transition-colors">Go to Admin Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
