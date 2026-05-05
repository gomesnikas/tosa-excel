import React from 'react';
import { motion } from 'motion/react';
import { UserSession, Question, TosaLevel, Domain, Difficulty } from '../types';
import { Trophy, Target, AlertTriangle, CheckCircle, Award, ListChecks, ArrowLeft } from 'lucide-react';

interface Props {
  session: UserSession;
  answers: {questionId: number, isCorrect: boolean, points: number}[];
  questions: Question[];
  onRestart: () => void;
}

export default function BilanScreen({ session, answers, questions, onRestart }: Props) {
  const pointsObtenus = answers.reduce((sum, a) => sum + a.points, 0);
  const maxPossiblePoints = questions.reduce((sum, q) => sum + (q.difficulty === Difficulty.Facile ? 1 : 2), 0);
  
  const score1000 = Math.round((pointsObtenus / maxPossiblePoints) * 1000);

  const getEstimatedLevel = (score: number): TosaLevel => {
    if (score <= 350) return TosaLevel.Initial;
    if (score <= 550) return TosaLevel.Basique;
    if (score <= 725) return TosaLevel.Operationnel;
    if (score <= 875) return TosaLevel.Avance;
    return TosaLevel.Expert;
  };

  const estimatedLevel = getEstimatedLevel(score1000);
  const levels = [TosaLevel.Initial, TosaLevel.Basique, TosaLevel.Operationnel, TosaLevel.Avance, TosaLevel.Expert];
  
  const currentIdx = levels.indexOf(estimatedLevel);
  const targetIdx = levels.indexOf(session.targetLevel);
  
  const gapMessage = currentIdx >= targetIdx 
    ? "Objectif Atteint ! Vous avez le niveau souhaité." 
    : currentIdx + 1 === targetIdx 
        ? "Proche de l'objectif ! Encore un petit effort." 
        : "Objectif à travailler. Reprenez les fondamentaux.";

  // Domains analysis
  const domainAnalysis = Object.values(Domain).map(d => {
    const domainQs = questions.filter(q => q.domain === d);
    const domainAnswers = answers.filter(a => questions.find(q => q.id === a.questionId)?.domain === d);
    const correctCount = domainAnswers.filter(a => a.isCorrect).length;
    const totalCount = domainQs.length;
    const ratio = totalCount > 0 ? correctCount / totalCount : 0;
    
    return {
      name: d,
      ratio,
      status: ratio >= 0.8 ? 'Réussi' : ratio >= 0.5 ? 'À renforcer' : 'Prioritaire'
    };
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-12 space-y-12 pb-24">
      {/* Hero Score */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#141414] text-[#E4E3E0] p-12 text-center space-y-4"
      >
        <p className="text-xs uppercase font-mono tracking-widest opacity-60">Résultat Global</p>
        <h1 className="text-9xl font-black italic font-serif leading-none">{score1000} <span className="text-2xl not-italic font-sans opacity-50">/ 1000</span></h1>
        <div className="inline-block bg-white text-[#141414] px-6 py-2 text-2xl font-bold uppercase -rotate-2">
            Niveau {estimatedLevel}
        </div>
        <p className="text-xl font-bold pt-4">{gapMessage}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Domain Table */}
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm uppercase font-mono font-bold border-b border-[#141414] pb-2">
                <Target size={18} /> Analyse par domaine
            </h3>
            <div className="border border-[#141414] divide-y divide-[#141414]">
                {domainAnalysis.map(d => (
                    <div key={d.name} className="flex items-center justify-between p-4 bg-white">
                        <div className="flex-1">
                            <p className="font-bold">{d.name}</p>
                            <div className="w-full bg-gray-200 h-1 mt-2">
                                <div className="bg-[#141414] h-full" style={{ width: `${d.ratio * 100}%` }} />
                            </div>
                        </div>
                        <div className={`ml-8 text-xs font-bold uppercase px-2 py-1 ${
                            d.status === 'Réussi' ? 'bg-green-100 text-green-700' : 
                            d.status === 'À renforcer' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {d.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Personalized Advice */}
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm uppercase font-mono font-bold border-b border-[#141414] pb-2">
                <Award size={18} /> Conseils Personnalisés
            </h3>
            <div className="space-y-4">
                {[
                    { title: "Pratiquez le $", body: "Maîtrisez les références absolues avec F4. C'est le pilier de tout utilisateur opérationnel." },
                    { title: "Pensez 'Tableau'", body: "Transformez vos plages de données en Tableaux (Ctrl+T) pour automatiser les calculs et la mise en forme." },
                    { title: "Simplifiez vos SI", body: "N'imbriquez pas trop de SI. Utilisez des tables de correspondance (RECHERCHEX) pour plus de clarté." }
                ].map((c, i) => (
                    <div key={i} className="bg-white p-4 border border-[#141414] border-l-8">
                        <p className="font-bold mb-1">{c.title}</p>
                        <p className="text-sm opacity-80 leading-snug">{c.body}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Jour J Checklist */}
      <div className="bg-white border-2 border-[#141414] p-8 shadow-[8px_8px_0_0_#141414]">
        <h3 className="flex items-center gap-2 text-xl font-bold uppercase mb-6">
            <ListChecks size={24} /> Check-list Jour J
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                "Séparateur de fonctions : toujours ;",
                "Séparateur décimal : , (pas .)",
                "F4 pour les références absolues ($A$1)",
                "Ctrl+T pour créer un Tableau structuré",
                "Filtres + Mise en forme conditionnelle simples",
                "Différence entre référence relative et absolue"
            ].map((check, i) => (
                <div key={i} className="flex items-center gap-3 font-semibold">
                    <CheckCircle className="text-green-600 shrink-0" size={20} />
                    {check}
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
            onClick={onRestart}
            className="group flex items-center gap-3 bg-[#141414] text-[#E4E3E0] px-10 py-5 text-xl font-bold uppercase transition hover:scale-110 active:scale-95 shadow-xl"
        >
            <ArrowLeft /> Recommencer un test
        </button>
      </div>
    </div>
  );
}
