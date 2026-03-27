'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

interface Attempt {
  id: string;
  startTime: string;
  totalMarks: number | null;
  status: string;
  quiz: { title: string; duration: number };
}

interface DashboardData {
  stats: { totalTaken: number };
  attempts: Attempt[];
}

export default function UserDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    api.get('/dashboard/user').then(res => setDashboard(res.data)).catch(console.error);
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '24px' }}>
          Welcome, {user?.name}! 👋
        </h1>

        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1.1rem' }}>{user?.email}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Student Account</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Quizzes Completed</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-primary)' }}>{dashboard?.stats?.totalTaken || 0}</div>
          </div>
        </div>

        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-text)' }}>
            Recent Quiz Attempts
          </div>
          {(dashboard?.attempts?.length ?? 0) > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Quiz', 'Date', 'Score', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboard?.attempts.map((a) => (
                  <tr key={a.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 24px', color: 'var(--color-text)', fontWeight: 500 }}>{a.quiz.title}</td>
                    <td style={{ padding: '14px 24px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{new Date(a.startTime).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 24px', color: 'var(--color-primary)', fontWeight: 700 }}>{a.totalMarks !== null ? a.totalMarks : '—'}</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: a.status === 'SUBMITTED' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: a.status === 'SUBMITTED' ? '#34d399' : '#fbbf24' }}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-dim)' }}>You haven&apos;t taken any quizzes yet.</div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
