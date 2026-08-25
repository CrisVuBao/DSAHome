import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Lock } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Learn() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5205/api/Topics')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="p-10 w-full max-w-6xl mx-auto h-full overflow-y-auto"
    >
      <motion.div variants={item} className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Lộ trình học tập</h1>
        <p className="text-slate-500 text-lg">Chinh phục Cấu trúc Dữ liệu và Giải thuật từ cơ bản đến nâng cao.</p>
      </motion.div>
      
      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <motion.div 
            key={topic.id} 
            variants={item}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="modern-card rounded-3xl p-6 relative overflow-hidden group cursor-pointer"
          >
            {/* Background gradient blob for hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-sm border border-indigo-100">
                {topic.order}
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                ${topic.difficulty === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                  topic.difficulty === 1 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                  'bg-rose-50 text-rose-700 border border-rose-200'}`}
              >
                {topic.difficulty === 0 ? 'Dễ' : topic.difficulty === 1 ? 'Trung bình' : 'Khó'}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{topic.name}</h2>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">{topic.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                <BookOpen size={16} /> Học ngay
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <ChevronRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Coming soon placeholder cards */}
        {[2, 3, 4].map((item) => (
          <motion.div 
            key={`placeholder-${item}`}
            variants={item}
            className="modern-card rounded-3xl p-6 relative overflow-hidden bg-slate-50/80 grayscale opacity-60"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xl">
                ?
              </div>
              <div className="p-2 bg-slate-200 text-slate-500 rounded-full">
                <Lock size={14} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-400 mb-2">Đang phát triển</h2>
            <p className="text-slate-400 text-sm line-clamp-2">Nội dung này đang được biên soạn và sẽ sớm ra mắt trong tương lai.</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
