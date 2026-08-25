import { useState, useEffect } from 'react';

export default function Learn() {
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5205/api/Topics')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Lộ trình học tập</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{topic.order}. {topic.name}</h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                {topic.difficulty === 0 ? 'Dễ' : topic.difficulty === 1 ? 'Trung bình' : 'Khó'}
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{topic.description}</p>
            <button className="text-blue-600 font-medium text-sm hover:underline">
              Vào học ngay &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
