import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TosaLevel, UserSession } from '../types';
import { ChevronRight, Play } from 'lucide-react';

interface Props {
  onStart: (session: UserSession) => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  const [step, setStep] = useState(0);
  const [session, setSession] = useState<Partial<UserSession>>({
    autoHint: false,
    objective: "Réviser"
  });

  const levels = Object.values(TosaLevel);
  const objectives = ["Découvrir", "Réviser", "Me rassurer"];

  const nextStep = () => setStep(step + 1);

  const finish = () => {
    onStart(session as UserSession);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-6xl font-bold tracking-tight uppercase leading-none italic font-serif">
              TOSA Excel <br /> Prep 365
            </h1>
            <p className="text-xl max-w-lg opacity-80">
              Bienvenue ! On va faire 30 questions progressives pour t’entraîner sur Excel 365. 
              Tu peux répondre à ton rythme.
            </p>
            <div className="pt-8">
              <button 
                onClick={nextStep}
                className="group flex items-center gap-3 bg-[#141414] text-[#E4E3E0] px-8 py-4 text-xl font-bold uppercase transition hover:scale-105 active:scale-95"
              >
                C'est prêt <ChevronRight className="group-hover:translate-x-1 transition" />
              </button>
            </div>
            <p className="text-sm border-t border-[#141414]/10 pt-4 opacity-50 uppercase tracking-widest font-mono">
              Commandes : Indice / Je ne sais pas / Répéter / Suivant
            </p>
          </motion.div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <div>
                <label className="text-xs uppercase opacity-50 font-mono mb-2 block">01 / Niveau actuel</label>
                <h2 className="text-4xl font-bold mb-6">Ton niveau estimé ?</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[...levels, "Je ne sais pas"].map(l => (
                        <button 
                            key={l}
                            onClick={() => { setSession({...session, currentLevel: l as any}); nextStep(); }}
                            className="border-2 border-[#141414] p-4 text-left font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition uppercase"
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-8">
              <div>
                  <label className="text-xs uppercase opacity-50 font-mono mb-2 block">02 / Niveau visé</label>
                  <h2 className="text-4xl font-bold mb-6">Quel score vises-tu ?</h2>
                  <div className="grid grid-cols-2 gap-3">
                      {levels.map(l => (
                          <button 
                              key={l}
                              onClick={() => { setSession({...session, targetLevel: l}); nextStep(); }}
                              className="border-2 border-[#141414] p-4 text-left font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition uppercase"
                          >
                              {l}
                          </button>
                      ))}
                  </div>
              </div>
            </div>
          );
      case 3:
        return (
            <div className="space-y-8">
              <div>
                  <label className="text-xs uppercase opacity-50 font-mono mb-2 block">03 / Objectif</label>
                  <h2 className="text-4xl font-bold mb-6">Ton but aujourd'hui ?</h2>
                  <div className="flex flex-col gap-3">
                      {objectives.map(o => (
                          <button 
                              key={o}
                              onClick={() => { setSession({...session, objective: o as any}); nextStep(); }}
                              className="border-2 border-[#141414] p-4 text-left font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition uppercase"
                          >
                              {o}
                          </button>
                      ))}
                  </div>
              </div>
            </div>
          );
      case 4:
        return (
            <div className="space-y-8">
              <div>
                  <label className="text-xs uppercase opacity-50 font-mono mb-2 block">04 / Assistance</label>
                  <h2 className="text-4xl font-bold mb-6">Indice automatique ?</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => { setSession({...session, autoHint: true}); finish(); }}
                        className="border-2 border-[#141414] p-6 text-center font-bold hover:bg-green-600 hover:text-white transition uppercase text-2xl"
                    >
                        OUI
                    </button>
                    <button 
                        onClick={() => { setSession({...session, autoHint: false}); finish(); }}
                        className="border-2 border-[#141414] p-6 text-center font-bold hover:bg-red-600 hover:text-white transition uppercase text-2xl"
                    >
                        NON
                    </button>
                  </div>
              </div>
            </div>
          );
    }
  };

  return (
    <div className="flex items-center justify-center p-8 min-h-screen">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
