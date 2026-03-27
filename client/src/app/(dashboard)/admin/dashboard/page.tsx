'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function AdminDashboard() {
  const [data, setData] = useState<{stats: Record<string, number>, recentUsers: Array<{id: string, name: string, email: string, createdAt: string}>} | null>(null);

  useEffect(() => {
    api.get('/dashboard/admin').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-center">Loading...</div>;

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Metrics & Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{data.stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Uploaded Notes</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{data.stats.totalContent}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-emerald-500">
            <h3 className="text-gray-500 text-sm font-medium">Generated Quizzes</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{data.stats.totalQuizzes}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-amber-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Quiz Attempts</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{data.stats.totalAttempts}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 mt-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
            <Link href="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Manage Users</Link>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentUsers.map((user: {id: string, name: string, email: string, createdAt: string}) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </ProtectedRoute>
  );
}
