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

export default function AdminLogin() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin privileges required.');
      }
      login(res.data.user, res.data.token);
      router.push('/dashboard/admin');
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-zinc-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 mb-4">
            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-sm text-zinc-400">Restricted access area</p>
        </div>
        {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm font-medium text-center">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Admin Email</label>
              <input {...register('email')} className="w-full rounded-lg bg-zinc-900/50 border border-zinc-700 shadow-sm p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" placeholder="admin@domain.com" />
              {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
              <input type="password" {...register('password')} className="w-full rounded-lg bg-zinc-900/50 border border-zinc-700 shadow-sm p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" placeholder="••••••••" />
              {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        <div className="text-center pt-6 border-t border-zinc-800">
          <Link href="/login/user" className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors">← Back to User Login</Link>
        </div>
      </div>
    </div>
  );
}
