import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Code2, TerminalSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PracticeTab({ topic }: { topic: any }) {
  const [code, setCode] = useState(topic.codeExamples ? topic.codeExamples.replace(/```csharp\n|```/g, '') : '// Viết code của bạn ở đây\n');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Đang biên dịch và chạy...');
    setHasError(false);
    
    try {
      const res = await fetch('http://localhost:5205/api/CodeRun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await res.json();
      setOutput(data.output);
      setHasError(data.hasError);
    } catch (err) {
      setOutput('Không thể kết nối đến máy chủ thực thi Code.');
      setHasError(true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="modern-card p-6 rounded-3xl flex flex-col gap-6"
    >
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
        <h4 className="font-bold text-emerald-900 mb-1">Thực hành Code</h4>
        <p className="text-sm text-emerald-700">Hãy thử tự cài đặt lại cấu trúc dữ liệu hoặc chạy thử các ví dụ bên dưới nhé.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
        {/* Editor Side */}
        <div className="rounded-2xl overflow-hidden flex flex-col border border-slate-200 shadow-sm">
          <div className="bg-slate-900 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
              <Code2 size={16} className="text-indigo-400" />
              <span>Program.cs</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-colors"
            >
              {isRunning ? <span className="animate-spin">⏳</span> : <Play size={14} fill="currentColor" />}
              {isRunning ? 'Đang chạy' : 'Run Code'}
            </motion.button>
          </div>
          
          <div className="flex-1 bg-[#1e1e1e] p-4 relative">
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Output Side */}
        <div className="rounded-2xl overflow-hidden flex flex-col border border-slate-200 shadow-sm">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-slate-600 font-bold text-sm">
            <TerminalSquare size={16} />
            <span>Output (Console)</span>
          </div>
          <div className={`flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap
            ${hasError ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-800'}
          `}>
            {output || <span className="text-slate-400 italic">Kết quả sẽ hiển thị ở đây...</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
