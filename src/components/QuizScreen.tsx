import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, QuestionType, UserSession, Difficulty } from '../types';
import { HelpCircle, SkipForward, RotateCcw, StopCircle, CheckCircle2, XCircle, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  session: UserSession;
  currentQuestion: Question;
  index: number;
  total: number;
  isLoading: boolean;
  history: {isCorrect: boolean}[];
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onStop: () => void;
}

export default function QuizScreen({ 
  session, 
  currentQuestion, 
  index, 
  total, 
  isLoading, 
  onAnswer, 
  onNext, 
  onStop,
  history 
}: Props) {
  const [userAnswer, setUserAnswer] = useState<string | number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [showHint, setShowHint] = useState(session.autoHint);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setUserAnswer(null);
    setShowCorrection(false);
    setShowHint(session.autoHint);
  }, [currentQuestion, session.autoHint]);

  const handleSubmit = (answer?: string | number) => {
    const finalAnswer = answer ?? userAnswer;
    if (finalAnswer === null && currentQuestion.type === QuestionType.QCM) return;

    let correct = false;
    if (currentQuestion.type === QuestionType.QCM) {
      correct = finalAnswer === currentQuestion.correctAnswer;
    } else {
      // For practical, we do a loose string match (no = sign required if they forgot, trim spaces, case insensitive)
      const expected = String(currentQuestion.correctAnswer).toLowerCase().trim().replace(/ /g, '').replace(/,/g, '.');
      const actual = String(finalAnswer).toLowerCase().trim().replace(/ /g, '').replace(/,/g, '.');
      correct = actual === expected || actual === expected.replace(/^=/, '');
    }

    setIsCorrect(correct);
    setShowCorrection(true);
    onAnswer(correct);
  };

  const handleDontKnow = () => {
    setIsCorrect(false);
    setShowCorrection(true);
    onAnswer(false);
  };

  if (isLoading && !currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen gap-3 text-2xl font-bold uppercase italic font-serif">
        <Loader2 className="animate-spin" /> Génération de la question...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-12 min-h-screen flex flex-col">
      {/* Header Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-[#141414] mb-8 divide-x divide-[#141414]">
        <div className="p-3">
          <p className="text-[10px] uppercase opacity-50 font-mono italic">Progression</p>
          <p className="font-bold text-lg">{index + 1} / {total}</p>
        </div>
        <div className="p-3">
          <p className="text-[10px] uppercase opacity-50 font-mono italic">Domaine</p>
          <p className="font-bold text-lg truncate">{currentQuestion.domain}</p>
        </div>
        <div className="p-3">
          <p className="text-[10px] uppercase opacity-50 font-mono italic">Difficulté</p>
          <p className="font-bold text-lg">{currentQuestion.difficulty === Difficulty.Facile ? 'FACILE' : 'MOYEN'}</p>
        </div>
        <div className="p-3">
            <p className="text-[10px] uppercase opacity-50 font-mono italic">Score</p>
            <div className="flex gap-1 mt-1 overflow-x-hidden h-4">
                {history.map((h, i) => (
                    <div key={i} className={`w-2 h-full ${h.isCorrect ? 'bg-green-600' : 'bg-red-600'}`} />
                ))}
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        {/* Question Area */}
        <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
        >
            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {currentQuestion.text}
            </h3>

            {currentQuestion.tableData && (
                <div className="bg-white/50 border border-[#141414] p-4 mb-6 font-mono text-xs overflow-x-auto overflow-y-hidden markdown-body prose prose-sm max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]}>{currentQuestion.tableData}</Markdown>
                    <p className="mt-4 text-[10px] opacity-70 italic">Conseil : Vous pouvez utiliser Ctrl+T pour structurer ce tableau.</p>
                </div>
            )}

            {/* Answer Interface */}
            {!showCorrection ? (
                <div className="space-y-4">
                    {currentQuestion.type === QuestionType.QCM ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentQuestion.options?.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSubmit(i)}
                                    className="border-2 border-[#141414] p-4 text-left font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition-all flex items-center gap-4"
                                >
                                    <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-sm shrink-0">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input 
                                type="text"
                                autoFocus
                                value={userAnswer || ''}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="Tapez votre réponse ici..."
                                className="w-full bg-white border-2 border-[#141414] p-6 text-2xl font-bold font-mono focus:outline-none focus:ring-4 ring-[#141414]/10"
                            />
                            <button 
                                onClick={() => handleSubmit()}
                                className="bg-[#141414] text-[#E4E3E0] px-8 py-3 font-bold uppercase hover:bg-opacity-90 transition w-full md:w-auto"
                            >
                                Valider
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`border-4 p-6 ${isCorrect ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}
                >
                    <div className="flex items-center gap-4 mb-4">
                        {isCorrect ? (
                            <><CheckCircle2 className="text-green-600 w-12 h-12" /> <span className="text-4xl font-black text-green-600 uppercase italic font-serif">Correct</span></>
                        ) : (
                            <><XCircle className="text-red-600 w-12 h-12" /> <span className="text-4xl font-black text-red-600 uppercase italic font-serif">Incorrect</span></>
                        )}
                    </div>

                    <div className="space-y-4 text-lg">
                        <p className="font-bold">
                            Réponse attendue : <span className="font-mono bg-white px-2 py-1 border border-current">
                                {currentQuestion.type === QuestionType.QCM 
                                    ? currentQuestion.options?.[currentQuestion.correctAnswer as number] 
                                    : currentQuestion.correctAnswer}
                            </span>
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <p className="text-xs uppercase font-mono opacity-50 underline decoration-2">Explication</p>
                                <p className="leading-snug">{currentQuestion.explanation}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs uppercase font-mono opacity-50 underline decoration-2">Le piège</p>
                                <p className="italic">{currentQuestion.trap}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#141414]/10 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex items-center gap-2 text-sm font-bold bg-yellow-400 px-3 py-1 uppercase italic">
                                <Lightbulb size={16} /> ASTUCE : {currentQuestion.tip}
                            </div>
                            <button 
                                onClick={onNext}
                                className="group flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-10 py-5 text-xl font-bold uppercase transition hover:scale-105 active:scale-95 whitespace-nowrap"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <>Suivant <ArrowRight /></>}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>

        {/* Hints and Commands */}
        <div className="flex flex-wrap gap-3 border-t border-[#141414] pt-8 mt-auto">
            {!showCorrection && (
                <>
                    <button 
                        disabled={showHint}
                        onClick={() => setShowHint(true)}
                        className={`flex items-center gap-2 border border-[#141414] px-4 py-2 text-xs font-bold uppercase hover:bg-yellow-400 transition cursor-help ${showHint ? 'opacity-30' : ''}`}
                    >
                        <HelpCircle size={14} /> Indice
                    </button>
                    <button 
                        onClick={handleDontKnow}
                        className="flex items-center gap-2 border border-[#141414] px-4 py-2 text-xs font-bold uppercase hover:bg-red-200 transition"
                    >
                        <SkipForward size={14} /> Je ne sais pas
                    </button>
                </>
            )}
            <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 border border-[#141414] px-4 py-2 text-xs font-bold uppercase hover:bg-blue-200 transition"
            >
                <RotateCcw size={14} /> Répéter
            </button>
            <button 
                onClick={onStop}
                className="flex items-center gap-2 border border-[#141414] px-4 py-2 text-xs font-bold uppercase hover:bg-red-600 hover:text-white transition ml-auto"
            >
                <StopCircle size={14} /> Stop
            </button>
        </div>

        {/* Hint Box */}
        <AnimatePresence>
            {showHint && !showCorrection && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="bg-yellow-50 border-x-2 border-b-2 border-yellow-400 p-3 text-sm italic flex items-start gap-2">
                        <Lightbulb size={16} className="text-yellow-600 shrink-0 mt-1" />
                        <span>{currentQuestion.tip}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
