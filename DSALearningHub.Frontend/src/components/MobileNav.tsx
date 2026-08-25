import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const location = useLocation();

  const links = [
    { to: '/', icon: <LayoutDashboard size={22} />, label: 'Home' },
    { to: '/learn', icon: <BookOpen size={22} />, label: 'Học' },
    { to: '/visualizer', icon: <BarChart2 size={22} />, label: 'Mô phỏng' },
    { to: '/playground', icon: <TerminalSquare size={22} />, label: 'Code' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200 safe-area-bottom shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
      <nav className="flex justify-around items-center px-2 py-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className="relative flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeMobileTab"
                  className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className={`${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {link.icon}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-700' : 'text-slate-400'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
