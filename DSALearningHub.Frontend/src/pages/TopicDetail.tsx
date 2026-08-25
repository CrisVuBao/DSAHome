import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Box, Code, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 w-full max-w-5xl mx-auto h-full overflow-y-auto"
    >
      <Link to="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-8">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <div className="modern-card p-10 rounded-3xl mb-8 border-t-4 border-t-indigo-500">
        <div className="flex flex-wrap gap-3 mb-6">
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

        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{topic.name}</h1>
        <p className="text-lg text-slate-600 mb-8">{topic.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Clock size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Time Complexity</h4>
              <p className="text-sm text-slate-600">{topic.timeComplexity}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg"><Box size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Space Complexity</h4>
              <p className="text-sm text-slate-600">{topic.spaceComplexity}</p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-a:text-indigo-600">
          <ReactMarkdown>{topic.theory}</ReactMarkdown>
        </div>
      </div>

      {topic.codeExamples && (
        <div className="modern-card p-10 rounded-3xl mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Code className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Ví dụ Code (C#)</h2>
          </div>
          <div className="prose prose-slate max-w-none prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-xl">
            <ReactMarkdown>{topic.codeExamples}</ReactMarkdown>
          </div>
        </div>
      )}

      {topic.realWorldExamples && (
        <div className="modern-card p-10 rounded-3xl mb-8 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-amber-500" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Ứng dụng thực tế</h2>
          </div>
          <p className="text-slate-700">{topic.realWorldExamples}</p>
        </div>
      )}
    </motion.div>
  );
}
