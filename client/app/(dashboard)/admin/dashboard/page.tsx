'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

type DashData = {
  stats: Record<string, number>;
  recentUsers: Array<{id: string; name: string; email: string; createdAt: string}>;
} | null;

export default function AdminDashboard() {
  const [data, setData] = useState<DashData>(null);
  useEffect(() => { api.get('/dashboard/admin').then(res => setData(res.data)).catch(console.error); }, []);
  if (!data) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>;

  const cards = [
    { label: 'Total Users', value: data.stats.totalUsers, color: '#6366f1' },
    { label: 'Uploaded Notes', value: data.stats.totalContent, color: '#06b6d4' },
    { label: 'Generated Quizzes', value: data.stats.totalQuizzes, color: '#10b981' },
    { label: 'Quiz Attempts', value: data.stats.totalAttempts, color: '#f59e0b' },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '28px' }}>
          Admin Analytics 📊
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {cards.map(c => (
            <div key={c.label} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderTop: `3px solid ${c.color}`, borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 500, marginBottom: '8px' }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: c.color }}>{c.value ?? 0}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Recent Users</span>
            <Link href="/admin/users" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>Manage Users →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Name', 'Email', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map(u => (
                <tr key={u.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 24px', color: 'var(--color-text)', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '14px 24px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 24px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
