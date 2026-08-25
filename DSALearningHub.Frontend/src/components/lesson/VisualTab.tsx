import { motion } from 'framer-motion';
import Visualizer from '../../pages/Visualizer';

export default function VisualTab({ topic }: { topic: any }) {
  // Currently we only have a full visualizer for Sorting (Bubble Sort)
  // In the future, we could conditionally render different visualizers based on topic.id
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="modern-card p-6 rounded-3xl"
    >
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-6">
        <h4 className="font-bold text-indigo-900 mb-1">Mô phỏng Trực quan</h4>
        <p className="text-sm text-indigo-700">Xem cách cấu trúc dữ liệu hoặc thuật toán này hoạt động từng bước một.</p>
      </div>

      <div className="h-[600px] border border-slate-200 rounded-2xl overflow-hidden relative">
        {/* We reuse the Visualizer component but scale it down slightly to fit the tab */}
        <div className="absolute inset-0 overflow-y-auto">
          {topic.id === 4 ? (
            <Visualizer />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="text-6xl mb-4">🚧</span>
              <p className="font-bold text-lg text-slate-600">Animation đang được xây dựng</p>
              <p className="text-sm">Tính năng mô phỏng cho bài học này sẽ sớm ra mắt.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
