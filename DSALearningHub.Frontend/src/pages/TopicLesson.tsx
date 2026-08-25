import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Eye, Code2, BrainCircuit } from 'lucide-react';
import TheoryTab from '../components/lesson/TheoryTab';
import VisualTab from '../components/lesson/VisualTab';
import PracticeTab from '../components/lesson/PracticeTab';
import QuizTab from '../components/lesson/QuizTab';

export default function TopicLesson() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'theory' | 'visual' | 'practice' | 'quiz'>('theory');

  useEffect(() => {
    fetch(`http://localhost:5205/api/Topics/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setTopic(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy bài học</h2>
        <Link to="/learn" className="text-indigo-600 hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'theory', label: 'Lý thuyết', icon: <BookOpen size={18} /> },
    { id: 'visual', label: 'Trực quan', icon: <Eye size={18} /> },
    { id: 'practice', label: 'Thực hành', icon: <Code2 size={18} /> },
    { id: 'quiz', label: 'Kiểm tra', icon: <BrainCircuit size={18} /> }
  ];

  return (
    <div className="p-4 md:p-10 w-full max-w-6xl mx-auto h-full overflow-y-auto flex flex-col">
      <Link to="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-4 py-2">
        <ArrowLeft size={18} /> Quay lại lộ trình
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
            Bài {topic.order}
          </span>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border
            ${topic.difficulty === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
              topic.difficulty === 1 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
              'bg-rose-50 text-rose-700 border-rose-200'}`}
          >
            {topic.difficulty === 0 ? 'Mức độ: Dễ' : topic.difficulty === 1 ? 'Mức độ: Trung bình' : 'Mức độ: Khó'}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{topic.name}</h1>
        <p className="text-slate-600 text-lg">{topic.description}</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-full max-w-2xl">
        {tabs.map((tab) => (
            <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all relative ${
              activeTab === tab.id ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="lessonTab"
                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              {tab.icon} <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'theory' && <TheoryTab key="theory" topic={topic} />}
          {activeTab === 'visual' && <VisualTab key="visual" topic={topic} />}
          {activeTab === 'practice' && <PracticeTab key="practice" topic={topic} />}
          {activeTab === 'quiz' && <QuizTab key="quiz" topicId={topic.id} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
