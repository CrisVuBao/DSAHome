import { useState, useEffect } from 'react';
import { Play, RotateCcw, Pause, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Visualizer() {
  const [array, setArray] = useState<{id: string, val: number}[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [speed, setSpeed] = useState(200);

  useEffect(() => {
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    if (isSorting) return;
    const newArr = Array.from({ length: 15 }, (_, i) => ({
      id: `bar-${i}-${Math.random()}`,
      val: Math.floor(Math.random() * 90) + 10
    }));
    setArray(newArr);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    
    let arr = [...array];
    let n = arr.length;
    let newSorted: number[] = [];
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight compared elements
        setActiveIndices([j, j + 1]);
        await delay(speed);
        
        if (arr[j].val > arr[j + 1].val) {
          // Swap
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await delay(speed);
        }
      }
      newSorted.push(n - i - 1);
      setSortedIndices([...newSorted]);
    }
    
    newSorted.push(0);
    setSortedIndices([...newSorted]);
    setActiveIndices([]);
    setIsSorting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 w-full max-w-6xl mx-auto flex flex-col h-full overflow-hidden"
    >
      <div className="flex justify-between items-end mb-8 modern-card p-6 rounded-3xl">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Algorithm Visualizer</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase border border-indigo-100">Bubble Sort</span>
            <span className="text-slate-500 text-sm font-medium">O(n²) Time Complexity</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl mr-2">
            <Settings2 size={18} className="text-slate-400" />
            <input 
              type="range" 
              min="50" max="500" 
              step="50"
              value={550 - speed} 
              onChange={(e) => setSpeed(550 - parseInt(e.target.value))}
              disabled={isSorting}
              className="w-24 accent-indigo-500"
            />
            <span className="text-xs font-bold text-slate-500 w-12 text-right">Tốc độ</span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateRandomArray}
            disabled={isSorting}
            className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm disabled:opacity-50 transition-colors"
          >
            <RotateCcw size={18} /> Tạo mới
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={bubbleSort}
            disabled={isSorting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 transition-all"
          >
            {isSorting ? <Pause size={18} /> : <Play size={18} fill="currentColor" />} 
            {isSorting ? 'Đang chạy...' : 'Bắt đầu'}
          </motion.button>
        </div>
      </div>

      {/* Main visualization area */}
      <div className="flex-1 modern-card rounded-3xl p-8 flex items-end justify-center gap-3 min-h-[400px] relative overflow-hidden">
        {/* Background grid lines */}
        <div className="absolute inset-0 border-y border-slate-100/50" style={{ backgroundSize: '100% 20%', backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(226, 232, 240, 0.3) 100%)' }}></div>
        
        <AnimatePresence>
          {array.map((item, idx) => {
            const isActive = activeIndices.includes(idx);
            const isSorted = sortedIndices.includes(idx);
            
            return (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30, 
                  mass: 0.8 
                }}
                className={`w-14 rounded-2xl flex flex-col justify-end items-center pb-3 text-white font-extrabold text-sm shadow-lg relative z-10
                  ${isActive 
                    ? 'bg-gradient-to-t from-rose-500 to-pink-500 shadow-rose-500/40' 
                    : isSorted 
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-emerald-500/30'
                      : 'bg-gradient-to-t from-indigo-500 to-blue-400 shadow-indigo-500/30'}`}
                style={{ height: `${(item.val / 110) * 100}%` }}
              >
                {item.val}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 modern-card rounded-3xl p-6"
      >
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-t from-indigo-500 to-blue-400"></div>
            <span className="text-sm font-bold text-slate-600">Chưa sắp xếp</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-t from-rose-500 to-pink-500"></div>
            <span className="text-sm font-bold text-slate-600">Đang so sánh</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-t from-emerald-500 to-teal-400"></div>
            <span className="text-sm font-bold text-slate-600">Đã sắp xếp</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
