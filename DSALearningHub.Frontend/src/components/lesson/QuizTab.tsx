import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react';

export default function QuizTab({ topicId }: { topicId: number }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5205/api/Topics/${topicId}/questions`)
      .then(res => res.json())
      .then(data => {
        // Parse options string to array if needed
        const parsed = data.map((q: any) => ({
          ...q,
          optionsList: JSON.parse(q.options || '[]')
        }));
        setQuestions(parsed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [topicId]);

  if (loading) return <div className="p-10 text-center text-slate-500">Đang tải câu hỏi...</div>;
  if (questions.length === 0) return <div className="p-10 text-center text-slate-500">Chưa có câu hỏi cho bài học này.</div>;

  const currentQ = questions[currentIdx];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modern-card p-10 rounded-3xl flex flex-col items-center justify-center text-center py-20"
      >
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-6">
          <Trophy size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Hoàn thành bài kiểm tra!</h2>
        <p className="text-lg text-slate-600 mb-6">Bạn trả lời đúng <span className="font-bold text-indigo-600">{score}/{questions.length}</span> câu hỏi.</p>
        
        <button 
          onClick={() => {
            setCurrentIdx(0);
            setScore(0);
            setIsFinished(false);
            setSelectedOption(null);
            setIsSubmitted(false);
          }}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors"
        >
          Làm lại từ đầu
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="modern-card p-8 md:p-10 rounded-3xl"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-slate-500">Câu hỏi {currentIdx + 1} / {questions.length}</h3>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full ${i === currentIdx ? 'bg-indigo-600' : i < currentIdx ? 'bg-indigo-200' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8">{currentQ.content}</h2>

      <div className="space-y-3 mb-8">
        {currentQ.optionsList.map((opt: string, i: number) => {
          let stateClass = "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50";
          if (isSubmitted) {
            if (opt === currentQ.correctAnswer) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
            else if (opt === selectedOption) stateClass = "border-rose-500 bg-rose-50 text-rose-900";
            else stateClass = "border-slate-100 bg-slate-50 opacity-50";
          } else if (opt === selectedOption) {
            stateClass = "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20";
          }

          return (
            <button
              key={i}
              onClick={() => !isSubmitted && setSelectedOption(opt)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-2xl border-2 font-medium transition-all ${stateClass}`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {isSubmitted && opt === currentQ.correctAnswer && <CheckCircle2 className="text-emerald-500" />}
                {isSubmitted && opt === selectedOption && opt !== currentQ.correctAnswer && <XCircle className="text-rose-500" />}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-6 rounded-2xl mb-8 ${isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}
          >
            <h4 className="font-bold mb-2">{isCorrect ? '🎉 Chính xác!' : '❌ Sai rồi!'}</h4>
            <p className="text-sm opacity-90">{currentQ.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-colors"
          >
            {currentIdx === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
