import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TosaLevel, 
  UserSession, 
  Question, 
} from './types';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import BilanScreen from './components/BilanScreen';

type Screen = 'welcome' | 'quiz' | 'bilan';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [session, setSession] = useState<UserSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{questionId: number, isCorrect: boolean, points: number}[]>([]);
  
  const startTest = async (sessionData: UserSession) => {
    setSession(sessionData);
    try {
      const response = await fetch('/api/questions');
      const allQuestions: Question[] = await response.json();
      
      // Adaptation simple au niveau (Normalement fait par le serveur, mais ici on simule la sélection)
      const selectedPool = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 35);
      setQuestions(selectedPool);
      setScreen('quiz');
      setCurrentQuestionIndex(0);
      setAnswers([]);
    } catch (error) {
      console.error("Erreur lors de la récupération des questions:", error);
      alert("Impossible de contacter le serveur API.");
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    const q = questions[currentQuestionIndex];
    if (!q) return;
    const points = isCorrect ? (q.difficulty === "F" ? 1 : 2) : 0;
    setAnswers(prev => [...prev, { questionId: q.id, isCorrect, points }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setScreen('bilan');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleStop = () => {
    setScreen('bilan');
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans overflow-x-hidden selection:bg-[#141414] selection:text-[#E4E3E0]">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={startTest} />
        )}
        {screen === 'quiz' && questions.length > 0 && (
          <QuizScreen 
            key="quiz"
            session={session!}
            currentQuestion={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            total={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onStop={handleStop}
            isLoading={false}
            history={answers}
          />
        )}
        {screen === 'bilan' && (
          <BilanScreen 
            key="bilan"
            session={session!}
            answers={answers}
            questions={questions.slice(0, answers.length)}
            onRestart={() => setScreen('welcome')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


