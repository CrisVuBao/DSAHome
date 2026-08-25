import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, ChevronRight, Grid3x3, Link2, Layers,
  ArrowDownUp, Network, Hash, Cpu, Search, Mountain,
  Zap, Library, Binary, ArrowLeftRight, Code2
} from 'lucide-react';

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

// Helper function to map Topic Order to specific Icons and Colors
const getTopicIdentity = (order: number) => {
  switch (order) {
    case 1: return { icon: <Grid3x3 size={24} />, color: 'bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600' };
    case 2: return { icon: <Link2 size={24} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600' };
    case 3: return { icon: <Layers size={24} />, color: 'bg-violet-50 text-violet-600 border-violet-200 group-hover:bg-violet-600' };
    case 4: return { icon: <ArrowDownUp size={24} />, color: 'bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600' };
    case 5: return { icon: <Network size={24} />, color: 'bg-green-50 text-green-600 border-green-200 group-hover:bg-green-600' };
    case 6: return { icon: <Hash size={24} />, color: 'bg-pink-50 text-pink-600 border-pink-200 group-hover:bg-pink-600' };
    case 7: return { icon: <Cpu size={24} />, color: 'bg-purple-50 text-purple-600 border-purple-200 group-hover:bg-purple-600' };
    case 8: return { icon: <Search size={24} />, color: 'bg-cyan-50 text-cyan-600 border-cyan-200 group-hover:bg-cyan-600' };
    case 9: return { icon: <Mountain size={24} />, color: 'bg-orange-50 text-orange-600 border-orange-200 group-hover:bg-orange-600' };
    case 10: return { icon: <Zap size={24} />, color: 'bg-yellow-50 text-yellow-600 border-yellow-200 group-hover:bg-yellow-600' };
    case 11: return { icon: <Library size={24} />, color: 'bg-rose-50 text-rose-600 border-rose-200 group-hover:bg-rose-600' };
    case 12: return { icon: <Binary size={24} />, color: 'bg-slate-100 text-slate-700 border-slate-300 group-hover:bg-slate-700' };
    case 13: return { icon: <ArrowLeftRight size={24} />, color: 'bg-teal-50 text-teal-600 border-teal-200 group-hover:bg-teal-600' };
    default: return { icon: <Code2 size={24} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600' };
  }
};

export default function Learn() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5205/api/Topics')
      .then(res => res.json())
      .then(data => {
        // Sort topics by Order ascending
        const sorted = data.sort((a: any, b: any) => a.order - b.order);
        setTopics(sorted);
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
      className="p-4 md:p-10 w-full max-w-6xl mx-auto h-full overflow-y-auto"
    >
      <motion.div variants={item} className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Lộ trình học tập</h1>
        <p className="text-slate-500 text-lg">Chinh phục Cấu trúc Dữ liệu & Giải thuật từ cơ bản đến nâng cao.</p>
      </motion.div>

      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const identity = getTopicIdentity(topic.order);
          return (
            <motion.div
              key={topic.id}
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={`/learn/${topic.id}`} className="block h-full modern-card rounded-3xl p-6 relative overflow-hidden group cursor-pointer">
                {/* Background gradient blob for hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border transition-colors duration-300 group-hover:text-white ${identity.color}`}>
                    {identity.icon}
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                  ${topic.difficulty === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      topic.difficulty === 1 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'}`}
                  >
                    {topic.difficulty === 0 ? 'Dễ' : topic.difficulty === 1 ? 'Trung bình' : 'Khó'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {/* <span className="text-xs font-bold text-slate-400">Bài {topic.order}</span> */}
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{topic.name}</h2>
                </div>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">{topic.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                    <BookOpen size={16} /> Học ngay
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
