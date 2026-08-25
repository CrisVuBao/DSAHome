import { useState, useEffect } from 'react';
import { Trophy, Target, Zap, BrainCircuit, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function Dashboard() {
  const [progress, setProgress] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userId = 8916208820;

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:5205/api/Progress/${userId}`).then(r => r.ok ? r.json() : null),
      fetch(`http://localhost:5205/api/Leaderboard`).then(r => r.ok ? r.json() : [])
    ])
    .then(([progData, leadData]) => {
      setProgress(progData);
      setLeaderboard(leadData);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [userId]);

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
      <motion.div variants={item} className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Xin chào, Học giả! 👋</h1>
          <p className="text-slate-500 text-lg">Cùng xem bạn đã luyện công được bao nhiêu rồi nhé.</p>
        </div>
      </motion.div>
      
      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div variants={item} className="modern-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
              <Trophy size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Cấp độ hiện tại</p>
              <h2 className="text-4xl font-black text-slate-800">{progress?.level || 1}</h2>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="modern-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Zap size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Tổng điểm XP</p>
              <h2 className="text-4xl font-black text-slate-800">{progress?.totalXP || 0}</h2>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="modern-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white">
              <Target size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Số câu đúng</p>
              <h2 className="text-4xl font-black text-slate-800">{progress?.totalCorrect || 0}</h2>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="modern-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl"><BrainCircuit size={20} /></div>
            <h3 className="text-xl font-bold text-slate-800">Tiến độ theo chủ đề</h3>
          </div>
          
          {progress?.details && progress.details.length > 0 ? (
            <div className="space-y-4">
              {progress.details.map((d: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-700">{d.topicName}</h4>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">+{d.xp} XP</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Đã làm: {d.questionsAnswered} câu</span>
                    <span className="text-emerald-600 font-bold">{d.correctAnswers} câu đúng</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((d.correctAnswers / Math.max(d.questionsAnswered, 1)) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Activity size={48} className="mb-4 text-slate-200" />
              <p>Bạn chưa hoàn thành bài tập nào.</p>
              <p className="text-sm mt-1">Lên Telegram gõ /quiz để bắt đầu nhé!</p>
            </div>
          )}
        </div>
        
        {/* Leaderboard */}
        <div className="modern-card rounded-3xl p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Trophy size={20} /></div>
            <h3 className="text-xl font-bold text-slate-800">Bảng xếp hạng</h3>
          </div>
          
          <div className="flex-1">
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((user: any) => (
                  <div key={user.userId} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                    user.userId == userId ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-transparent hover:border-slate-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1 ? 'bg-amber-400 text-white shadow-md' :
                      user.rank === 2 ? 'bg-slate-300 text-slate-700' :
                      user.rank === 3 ? 'bg-orange-300 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${user.userId == userId ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {user.username} {user.userId == userId && '(Bạn)'}
                      </p>
                      <p className="text-xs text-slate-500">Cấp độ {user.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{user.totalXP}</p>
                      <p className="text-xs text-slate-400">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 h-full">
                <p>Chưa có dữ liệu bảng xếp hạng.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
