'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';

type User = { id: string; name: string; email: string; role: string; isBlocked: boolean; createdAt: string };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { api.get('/users').then(res => setUsers(res.data)).catch(console.error); }, []);

  const toggleBlock = async (id: string) => {
    try {
      const res = await api.put(`/users/${id}/block`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: res.data.isBlocked } : u));
    } catch (e) { console.error(e); }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '28px' }}>
          User Management 👥
        </h1>
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 24px', color: 'var(--color-text)', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '14px 24px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)', color: u.role === 'ADMIN' ? '#a5b4fc' : 'var(--color-text-muted)' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 24px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: u.isBlocked ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: u.isBlocked ? '#f87171' : '#34d399' }}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <button onClick={() => toggleBlock(u.id)} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, border: `1px solid ${u.isBlocked ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, background: 'transparent', color: u.isBlocked ? '#34d399' : '#f87171', cursor: 'pointer' }}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
