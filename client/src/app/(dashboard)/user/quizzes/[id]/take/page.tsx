'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  id: string;
  questionText: string;
  options: string[];
}

interface QuizAttempt {
  id: string;
  startTime: string;
  responses?: Record<string, string>;
  quiz: {
    id: string;
    title: string;
    duration: number;
    questions: Question[];
  };
}

export default function TakeQuiz() {
  const { id } = useParams();
  const router = useRouter();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      api.post(`/attempts/${id}/start`).then(res => {
        setAttempt(res.data);
        const durationSeconds = (res.data.quiz.duration || 10) * 60;
        const elapsed = Math.floor((new Date().getTime() - new Date(res.data.startTime).getTime()) / 1000);
        setTimeLeft(Math.max(durationSeconds - elapsed, 0));
        if (res.data.responses) setResponses(res.data.responses);
      }).catch(err => {
        console.error(err);
        alert('Failed to start quiz');
      });
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev! - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, isSubmitting]);

  const handleSubmit = async () => {
    if (!attempt || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const res = await api.post(`/attempts/${attempt.id}/submit`, { responses });
      alert(`Quiz completed! You scored ${res.data.result.totalMarks}`);
      router.push('/user/quizzes');
    } catch (e) {
      console.error(e);
      alert('Failed to submit quiz.');
      setIsSubmitting(false);
    }
  };

  const handleSelect = (questionId: string, option: string) => {
    setResponses(prev => ({ ...prev, [questionId]: option }));
  };

  if (!attempt) return <div className="p-8 text-center text-gray-500">Loading quiz...</div>;

  const m = Math.floor((timeLeft || 0) / 60);
  const s = (timeLeft || 0) % 60;

  return (
    <ProtectedRoute>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center sticky top-0 z-10 border-b-4 border-indigo-500">
          <h1 className="text-2xl font-bold text-gray-800">{attempt.quiz.title}</h1>
          <div className="text-xl font-mono bg-red-50 text-red-600 px-4 py-2 rounded font-bold border border-red-200">
            {m}:{s < 10 ? '0' : ''}{s}
          </div>
        </div>

        <div className="space-y-8">
          {attempt.quiz.questions.map((q: Question, i: number) => (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-4">{i + 1}. {q.questionText}</h3>
              <div className="space-y-2">
                {q.options.map((opt: string, optI: number) => (
                  <label key={optI} className={`flex items-center p-3 border rounded cursor-pointer transition ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name={q.id} 
                      value={opt} 
                      checked={responses[q.id] === opt}
                      onChange={() => handleSelect(q.id, opt)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
