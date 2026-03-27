'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ContentItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

export default function ContentDashboard() {
  const router = useRouter();
  const [contents, setContents] = useState<ContentItem[]>([]);

  useEffect(() => {
    api.get('/content').then(res => setContents(res.data)).catch(console.error);
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Content Dashboard</h1>
          <Link href="/admin/upload" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
            Upload New Notes
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contents.map((item: ContentItem) => (
                <tr key={item.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => router.push(`/admin/content/${item.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'PROCESSED' ? 'bg-green-100 text-green-800' : item.status === 'ERROR' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/content/${item.id}`} className="text-indigo-600 hover:text-indigo-800">Review & Edit →</Link>
                  </td>
                </tr>
              ))}
              {contents.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">No content uploaded yet. Click Upload New Notes to begin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
