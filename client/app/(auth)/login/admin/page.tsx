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
      if (res.data.user.role !== 'ADMIN') throw new Error('Access denied. Admin privileges required.');
      login(res.data.user, res.data.token);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error || e.message || 'Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-card)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '40px', boxShadow: '0 0 40px rgba(99,102,241,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.4rem' }}>🔒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>Admin Portal</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>Restricted access area</p>
        </div>
        {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '6px' }}>Admin Email</label>
            <input {...register('email')} className="input-field" placeholder="admin@domain.com" />
            {errors.email && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '6px' }}>Password</label>
            <input type="password" {...register('password')} className="input-field" placeholder="••••••••" />
            {errors.password && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.password.message}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}>
            {isSubmitting ? 'Authenticating...' : 'Secure Login →'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/login/user" style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textDecoration: 'none' }}>← Back to User Login</Link>
        </div>
      </div>
    </div>
  );
}
