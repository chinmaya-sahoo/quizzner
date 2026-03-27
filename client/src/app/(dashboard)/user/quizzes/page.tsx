'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState<Array<{id: string, title: string, duration: number, content: {title: string}, _count: {questions: number}}>>([]);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    api.get('/quizzes/available').then(res => setQuizzes(res.data)).catch(console.error);
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Quizzes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="text-sm text-gray-500 mb-4 flex-grow">
                From Note: {quiz.content?.title || 'Unknown Document'}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded">
                <div>
                  <span className="block font-medium">Questions</span>
                  {quiz._count?.questions || 0}
                </div>
                <div>
                  <span className="block font-medium">Duration</span>
                  {quiz.duration} mins
                </div>
              </div>

              <Link 
                href={`/user/quizzes/${quiz.id}/take`} 
                className="w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 font-medium">No quizzes available right now.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
