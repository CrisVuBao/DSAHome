import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Code2, TerminalSquare } from 'lucide-react';

export default function Playground() {
  const [code, setCode] = useState('Console.WriteLine("Hello, DSA Hub!");\n\nint[] arr = { 5, 2, 8, 1, 9 };\nArray.Sort(arr);\n\nforeach(var item in arr) {\n    Console.Write(item + " ");\n}');
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 w-full max-w-6xl mx-auto flex flex-col h-full"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Code Playground</h1>
        <p className="text-slate-500 text-lg">Viết và thử nghiệm code C# ngay trên trình duyệt (sử dụng Roslyn Compiler).</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Editor Side */}
        <div className="modern-card rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Code2 size={18} className="text-indigo-400" />
              <span>Program.cs</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-colors"
            >
              {isRunning ? <span className="animate-spin">⏳</span> : <Play size={16} fill="currentColor" />}
              {isRunning ? 'Đang chạy' : 'Run Code'}
            </motion.button>
          </div>
          
          <div className="flex-1 bg-[#1e1e1e] p-4 relative">
            {/* Simple textarea for code for now instead of Monaco Editor for simplicity */}
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Output Side */}
        <div className="modern-card rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center gap-2 text-slate-600 font-bold">
            <TerminalSquare size={18} />
            <span>Output (Console)</span>
          </div>
          <div className={`flex-1 p-6 font-mono text-sm overflow-y-auto whitespace-pre-wrap
            ${hasError ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-800'}
          `}>
            {output || <span className="text-slate-400 italic">Kết quả sẽ hiển thị ở đây...</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
