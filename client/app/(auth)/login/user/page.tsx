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
      if (res.data.user.role !== 'USER') throw new Error('Please use the Admin login page.');
      login(res.data.user, res.data.token);
      router.push('/user/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error || e.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Sign in to your account</p>
        </div>
        {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '6px' }}>Email Address</label>
            <input {...register('email')} className="input-field" placeholder="you@example.com" />
            {errors.email && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '6px' }}>Password</label>
            <input type="password" {...register('password')} className="input-field" placeholder="••••••••" />
            {errors.password && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.password.message}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}>
            {isSubmitting ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </span>
          <Link href="/login/admin" style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', textDecoration: 'none' }}>Go to Admin Login →</Link>
        </div>
      </div>
    </div>
  );
}
