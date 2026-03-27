'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ContentItem { id: string; title: string; status: string; createdAt: string; }

export default function ContentDashboard() {
  const router = useRouter();
  const [contents, setContents] = useState<ContentItem[]>([]);
  useEffect(() => { api.get('/content').then(res => setContents(res.data)).catch(console.error); }, []);

  const statusColor = (s: string) => s === 'PROCESSED' ? { bg: 'rgba(16,185,129,0.15)', color: '#34d399' } : s === 'ERROR' ? { bg: 'rgba(239,68,68,0.15)', color: '#f87171' } : { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)' }}>Content Dashboard 📄</h1>
          <Link href="/admin/upload" className="btn-primary">Upload Notes →</Link>
        </div>

        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Title', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contents.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-dim)' }}>No content uploaded yet. Click Upload Notes to begin.</td></tr>
              ) : contents.map(item => {
                const sc = statusColor(item.status);
                return (
                  <tr key={item.id} style={{ borderTop: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => router.push(`/admin/content/${item.id}`)}>
                    <td style={{ padding: '14px 24px', color: 'var(--color-text)', fontWeight: 500 }}>{item.title}</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: sc.bg, color: sc.color }}>{item.status}</span>
                    </td>
                    <td style={{ padding: '14px 24px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 24px' }}>
                      <Link href={`/admin/content/${item.id}`} style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>Review & Edit →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
