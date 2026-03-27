'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

type Quiz = { id: string; title: string; duration: number; content: { title: string }; _count: { questions: number } };

export default function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  useEffect(() => { api.get('/quizzes/available').then(res => setQuizzes(res.data)).catch(console.error); }, []);

  return (
    <ProtectedRoute>
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '28px' }}>
          Available Quizzes 📝
        </h1>

        {quizzes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-dim)' }}>
            No quizzes available right now.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {quizzes.map(quiz => (
              <div key={quiz.id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 0.2s' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>{quiz.title}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', flex: 1 }}>From: {quiz.content?.title || 'Unknown Document'}</p>
                <div style={{ display: 'flex', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <div><span style={{ display: 'block', color: 'var(--color-text-dim)', marginBottom: '2px' }}>Questions</span><strong style={{ color: 'var(--color-text)' }}>{quiz._count?.questions || 0}</strong></div>
                  <div><span style={{ display: 'block', color: 'var(--color-text-dim)', marginBottom: '2px' }}>Duration</span><strong style={{ color: 'var(--color-text)' }}>{quiz.duration} mins</strong></div>
                </div>
                <Link href={`/user/quizzes/${quiz.id}/take`} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                  Start Quiz →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
