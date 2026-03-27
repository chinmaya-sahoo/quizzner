'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

export default function UserDashboard() {
  const [dashboard, setDashboard] = useState<{stats: Record<string, number>, attempts: Array<{id: string, quiz: {title: string, duration: number}, startTime: string, totalMarks: number, status: string, createdAt: string}>} | null>(null);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    api.get('/dashboard/user').then(res => setDashboard(res.data)).catch(console.error);
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
        
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Your Activity Profile</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          <div className="text-right">
            <span className="block text-sm text-gray-500">Quizzes Completed</span>
            <span className="text-3xl font-bold text-indigo-600">{dashboard?.stats?.totalTaken || 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Quiz Attempts</h2>
          </div>
          {dashboard?.attempts && dashboard.attempts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quiz</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.attempts.map(attempt => (
                  <tr key={attempt.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{attempt.quiz?.title || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(attempt.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-indigo-600">{attempt.totalMarks !== null ? attempt.totalMarks : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attempt.status === 'SUBMITTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {attempt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div className="p-8 text-center text-gray-500">You haven't taken any quizzes yet.</div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
