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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
      const res = await api.post('/auth/register', { ...data, role: 'USER' });
      login(res.data.user, res.data.token);
      router.push('/user/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>Create Account</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Join Quizzner today</p>
        </div>
        {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '6px' }}>Full Name</label>
            <input {...register('name')} className="input-field" placeholder="John Doe" />
            {errors.name && <span style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name.message}</span>}
          </div>
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
            {isSubmitting ? 'Creating account...' : 'Register →'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login/user" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
