import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { to: '/learn', icon: <BookOpen size={20} />, label: 'Học tập' },
    { to: '/visualizer', icon: <BarChart2 size={20} />, label: 'Mô phỏng thuật toán' },
  ];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-72 bg-slate-900 text-slate-300 min-h-screen flex flex-col m-4 rounded-3xl overflow-hidden relative z-10 shadow-2xl shadow-indigo-900/20"
    >
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Bot className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-white">
          DSA Hub
        </h1>
      </div>
      
      <nav className="flex-1 mt-4 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="relative flex items-center gap-4 px-4 py-3.5 rounded-2xl group transition-all duration-300 overflow-hidden"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-600 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                {link.icon}
              </div>
              <span className={`relative z-10 font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Trạng thái Telegram</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-100">Đã kết nối</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
