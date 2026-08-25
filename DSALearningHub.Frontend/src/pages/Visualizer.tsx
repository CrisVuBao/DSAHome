import { useState } from 'react';
import { Play, RotateCcw, Pause } from 'lucide-react';

export default function Visualizer() {
  const [array, setArray] = useState<number[]>([50, 20, 80, 40, 90, 10, 30, 70, 60]);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const generateRandomArray = () => {
    if (isSorting) return;
    const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArr);
    setActiveIndices([]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let arr = [...array];
    let n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        await delay(300);
        
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
        }
      }
    }
    setActiveIndices([]);
    setIsSorting(false);
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto flex flex-col h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Algorithm Visualizer</h1>
          <p className="text-gray-500">Thuật toán: Bubble Sort (O(n²))</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={generateRandomArray}
            disabled={isSorting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <RotateCcw size={18} /> Tạo mảng mới
          </button>
          <button 
            onClick={bubbleSort}
            disabled={isSorting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSorting ? <Pause size={18} /> : <Play size={18} />} 
            {isSorting ? 'Đang chạy...' : 'Chạy Bubble Sort'}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-end justify-center gap-2 min-h-[400px]">
        {array.map((val, idx) => (
          <div 
            key={idx}
            className={`w-12 rounded-t-md transition-all duration-200 flex flex-col justify-end items-center pb-2 text-white font-bold text-sm
              ${activeIndices.includes(idx) ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ height: `${(val / 110) * 100}%` }}
          >
            {val}
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">Giải thích Bubble Sort:</h3>
        <p className="text-blue-700 text-sm leading-relaxed">
          Thuật toán lặp qua mảng nhiều lần, ở mỗi lần lặp, nó so sánh các cặp phần tử kề nhau và đổi chỗ nếu chúng sai thứ tự. 
          Các phần tử lớn nhất sẽ "nổi" (bubble) lên cuối mảng sau mỗi vòng lặp.
        </p>
      </div>
    </div>
  );
}
