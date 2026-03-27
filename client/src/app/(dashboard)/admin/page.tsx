'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="p-8 bg-zinc-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={logout} className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700">Logout</button>
        </div>
        <p className="text-lg">Welcome back, Super Admin {user?.name}!</p>
      </div>
    </ProtectedRoute>
  );
}
