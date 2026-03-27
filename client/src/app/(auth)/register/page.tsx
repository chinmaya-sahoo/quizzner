'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      // By default, registration is for USER role.
      const payload = { ...data, role: 'USER' };
      const res = await api.post('/auth/register', payload);
      login(res.data.user, res.data.token);
      router.push('/dashboard/user');
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-sm text-gray-500">Join Quizzner today</p>
        </div>
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input {...register('name')} className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="John Doe" />
            {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
          </div>
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
          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link href="/login/user" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
