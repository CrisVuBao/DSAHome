import ReactMarkdown from 'react-markdown';
import { Clock, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TheoryTab({ topic }: { topic: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="modern-card p-8 md:p-10 rounded-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><Clock size={20} /></div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Thời gian (Time Complexity)</h4>
            <p className="text-sm text-slate-600 font-mono">{topic.timeComplexity}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-violet-100 text-violet-700 rounded-lg"><Box size={20} /></div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Không gian (Space Complexity)</h4>
            <p className="text-sm text-slate-600 font-mono">{topic.spaceComplexity}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl">
        <ReactMarkdown>{topic.theory}</ReactMarkdown>
      </div>

      {topic.realWorldExamples && (
        <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-900">
          <h4 className="font-bold mb-2 flex items-center gap-2">💡 Ứng dụng thực tế</h4>
          <p className="text-sm">{topic.realWorldExamples}</p>
        </div>
      )}
    </motion.div>
  );
}
