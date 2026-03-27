'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  
  return (
    <ProtectedRoute>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
        </div>
        <p className="text-lg">Welcome back, {user?.name}!</p>
      </div>
    </ProtectedRoute>
  );
}
