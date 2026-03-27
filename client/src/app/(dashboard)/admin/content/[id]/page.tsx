'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useParams } from 'next/navigation';

export default function ContentDetail() {
  const { id } = useParams();
  const [content, setContent] = useState<{id: string, title: string, status: string, memoryMapPath?: string, typedNotesPath?: string} | null>(null);
  const [memoryMap, setMemoryMap] = useState<string[]>([]); // Corrected type based on usage in the rest of the code
  const [questions, setQuestions] = useState<Array<{id: string, questionText: string, options: string[], correctAnswer: string}>>([]);

  useEffect(() => {
    if (id) {
      api.get(`/content/${id}`).then(res => {
        setContent(res.data);
        setMemoryMap(res.data.memoryMap || []);
        // Extract questions from the first quiz attached to content
        if (res.data.quizzes && res.data.quizzes.length > 0) {
          setQuestions(res.data.quizzes[0].questions);
        }
      }).catch(console.error);
    }
  }, [id]);

  const saveMemoryMap = async () => {
    try {
      await api.put(`/content/${id}/memory-map`, { memoryMap });
      alert('Memory Map saved!');
    } catch (e) {
      alert('Failed to save memory map');
    }
  };

  const updateMapItem = (index: number, val: string) => {
    const newMap = [...memoryMap];
    newMap[index] = val;
    setMemoryMap(newMap);
  };

  const addMapItem = () => {
    setMemoryMap([...memoryMap, 'New key point']);
  };

  const deleteQuestion = async (qId: string) => {
    await api.delete(`/questions/${qId}`);
    setQuestions(questions.filter(q => q.id !== qId));
  };

  if (!content) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">{content.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Memory Map Editor */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Memory Map Editor</h2>
              <button onClick={saveMemoryMap} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Save Map</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {memoryMap.map((point, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    type="text" 
                    value={point} 
                    onChange={e => updateMapItem(i, e.target.value)} 
                    className="flex-1 border-gray-300 rounded p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <button onClick={() => setMemoryMap(memoryMap.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 px-2 font-bold">×</button>
                </div>
              ))}
              {memoryMap.length === 0 && <p className="text-sm text-gray-400">No key points extracted.</p>}
            </div>
            <button onClick={addMapItem} className="mt-4 text-blue-600 text-sm font-medium hover:underline">+ Add Point</button>
          </div>

          {/* Question Bank Editor */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Draft Questions</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {questions.map((q, i) => (
                <div key={q.id} className="border border-gray-200 rounded p-4 relative group">
                  <span className="absolute top-2 right-2 text-xs font-bold text-gray-400">Q{q.questionNumber || i+1}</span>
                  <p className="font-medium text-gray-800 text-sm mb-2">{q.questionText}</p>
                  <ul className="text-xs text-gray-600 space-y-1 mb-3">
                    {q.options?.map((opt: string, optI: number) => (
                      <li key={optI} className={opt === q.correctAnswer ? 'text-green-600 font-semibold' : ''}>• {opt}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button className="text-indigo-600 text-xs font-medium hover:underline">Edit</button>
                    <button onClick={() => deleteQuestion(q.id)} className="text-red-600 text-xs font-medium hover:underline">Delete</button>
                  </div>
                </div>
              ))}
              {questions.length === 0 && <p className="text-sm text-gray-400">No questions generated yet.</p>}
            </div>
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
