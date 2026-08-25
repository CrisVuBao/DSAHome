import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2 } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/learn', icon: <BookOpen size={20} />, label: 'Learn' },
    { to: '/visualizer', icon: <BarChart2 size={20} />, label: 'Visualizer' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          DSA Hub
        </h1>
      </div>
      <nav className="flex-1 mt-6">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-6 py-3 transition-colors ${
              location.pathname === link.to
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
