import { useState, useEffect } from 'react';
import { Trophy, Target, Zap } from 'lucide-react';

export default function Dashboard() {
  const [progress, setProgress] = useState<any>(null);
  
  // Fake userId for now (e.g., your Telegram ID)
  // In a real app, you would have an auth system.
  const userId = 8916208820; // Replace with a real userId when integrating

  useEffect(() => {
    fetch(`http://localhost:5205/api/Progress/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setProgress(data))
      .catch((err) => console.log('Error fetching progress', err));
  }, [userId]);

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Cấp độ</p>
            <h2 className="text-2xl font-bold">{progress?.level || 1}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng XP</p>
            <h2 className="text-2xl font-bold">{progress?.totalXP || 0}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Câu đúng</p>
            <h2 className="text-2xl font-bold">{progress?.totalCorrect || 0}</h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Chi tiết theo chủ đề</h3>
        {progress?.details && progress.details.length > 0 ? (
          <div className="divide-y">
            {progress.details.map((d: any, i: number) => (
              <div key={i} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{d.topicName}</h4>
                  <p className="text-sm text-gray-500">Đã làm: {d.questionsAnswered} câu</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">+{d.xp} XP</p>
                  <p className="text-sm text-green-600">{d.correctAnswers} đúng</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Bạn chưa hoàn thành bài tập nào.</p>
        )}
      </div>
    </div>
  );
}
