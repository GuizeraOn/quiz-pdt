"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, Play, Volume2, PlayCircle } from 'lucide-react';

type Option = {
  label: string;
  value: string;
  description?: string;
};

type Step = {
  id: string;
  title?: string;
  subtitle?: string;
  question: string;
  options: Option[];
  type: 'single' | 'multi';
  buttonText?: string;
  progressBar?: { text: string; percentage: number };
};

const steps: Step[] = [
  {
    id: 'sex',
    title: "Descubre Tu Tipo de Intestino y la Verdad Sobre la Fibra, los Laxantes y los Probióticos",
    question: "¿Cuál es tu sexo?",
    options: [
      { label: "Mujer", value: "mujer" },
      { label: "Hombre", value: "hombre" }
    ],
    type: 'single'
  },
  {
    id: 'age',
    question: "¿Cuál es tu edad?",
    options: [
      { label: "35 – 44", value: "35-44" },
      { label: "45 – 54", value: "45-54" },
      { label: "55 – 64", value: "55-64" },
      { label: "65 o más", value: "65+" }
    ],
    type: 'single',
    buttonText: "Siguiente",
    progressBar: { text: "Analizando tu perfil digestivo…", percentage: 20 }
  },
  {
    id: 'frequency',
    question: "¿Cada cuánto logras vaciar completamente tus intestinos?",
    options: [
      { label: "Todos los días, pero sin vaciado completo", value: "todos-los-dias-sin-vaciado" },
      { label: "Cada 2 o 3 días", value: "2-o-3-dias" },
      { label: "Una vez cada 4 días o más", value: "4-dias-o-mas" },
      { label: "Alterno entre estreñimiento y diarrea", value: "alterno" }
    ],
    type: 'single',
    buttonText: "Siguiente",
    progressBar: { text: "Analizando tu perfil digestivo…", percentage: 40 }
  },
  {
    id: 'symptoms',
    question: "Además de la hinchazón, ¿cuáles de estas señales notas en tu cuerpo?",
    options: [
      { label: "Cansancio o pesadez después de comer", value: "cansancio" },
      { label: "Gases incómodos o mal aliento", value: "gases" },
      { label: "Aumento de peso que no logro explicar", value: "aumento-peso" },
      { label: "Dolores de cabeza, niebla mental o dolor en las articulaciones", value: "dolores-generales" }
    ],
    type: 'multi',
    buttonText: "Siguiente",
    progressBar: { text: "Analizando tu perfil digestivo…", percentage: 60 }
  },
  {
    id: 'past-solutions',
    question: "¿Qué has intentado para resolverlo… sin resultados duraderos?",
    options: [
      { label: "Comer más fibra", value: "fibra" },
      { label: "Laxantes o tés", value: "laxantes" },
      { label: "Probióticos", value: "probioticos" },
      { label: "Fui al médico y solo me dijeron que \"es normal\"", value: "medico-normal" }
    ],
    type: 'multi',
    buttonText: "Siguiente",
    progressBar: { text: "Analizando tu perfil digestivo…", percentage: 80 }
  },
  {
    id: 'identity',
    question: "¿Cuál de estas frases describe mejor cómo te sientes hoy?",
    options: [
      { label: "ATRAPADA", description: '"Vivo planeando mi día alrededor del baño y evito comer ciertas cosas para no pasarla mal."', value: "atrapada" },
      { label: "PESADA", description: '"Me siento hinchada e inflamada todo el tiempo, como si cargara un peso que no se va."', value: "pesada" },
      { label: "CANSADA", description: '"Mi digestión me roba la energía, el ánimo y la confianza para vivir mi vida."', value: "cansada" },
      { label: "SIN RESPUESTAS", description: '"He probado de todo y nadie me ha dado una solución real que funcione."', value: "sin-respuestas" }
    ],
    type: 'single',
    buttonText: "Ver mi resultado",
    progressBar: { text: "Generando tu resultado…", percentage: 100 }
  }
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  const step = currentStep < steps.length ? steps[currentStep] : null;

  useEffect(() => {
    if (currentStep === steps.length && !isLoading) {
      const timer = setTimeout(() => {
        setShowOffer(true);
      }, 0); // Delay in milliseconds (currently 0)
      return () => clearTimeout(timer);
    }
  }, [currentStep, isLoading]);

  const handleSelect = (value: string) => {
    if (!step) return;

    if (step.type === 'single') {
      setAnswers(prev => ({ ...prev, [currentStep]: value }));
      
      // Auto-advance always for single choice
      setTimeout(() => {
        handleNext();
      }, 300);
    } else {
      const currentAnswers = (answers[currentStep] as string[]) || [];
      if (currentAnswers.includes(value)) {
        setAnswers(prev => ({
          ...prev,
          [currentStep]: currentAnswers.filter(a => a !== value)
        }));
      } else {
        setAnswers(prev => ({
          ...prev,
          [currentStep]: [...currentAnswers, value]
        }));
      }
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentStep === steps.length - 1;
    
    if (isLastQuestion) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    } else {
      setCurrentStep(curr => curr + 1);
    }
  };

  const isSelected = (value: string) => {
    const stepAnswers = answers[currentStep];
    if (step?.type === 'single') {
      return stepAnswers === value;
    } else {
      return Array.isArray(stepAnswers) && stepAnswers.includes(value);
    }
  };

  const hasAnsweredCurrentStep = () => {
    const stepAnswers = answers[currentStep];
    if (step?.type === 'single') return !!stepAnswers;
    if (step?.type === 'multi') return Array.isArray(stepAnswers) && stepAnswers.length > 0;
    return false;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pt-0 pb-0 selection:bg-blue-100 selection:text-blue-900 bg-slate-50 relative">
      
      {currentStep > 0 && currentStep < steps.length && !isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-200 h-1.5 flex flex-col w-full shadow-sm">
          <div className="w-full bg-slate-200 h-1.5 overflow-hidden flex">
            <motion.div 
              className="bg-blue-600 h-full"
              initial={{ width: `${steps[currentStep - 1]?.progressBar?.percentage || 0}%` }}
              animate={{ width: `${steps[currentStep].progressBar?.percentage}%` }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
        </div>
      )}

      <main className={`w-full max-w-3xl mx-auto flex-grow flex flex-col ${currentStep > 0 && currentStep < steps.length ? 'pt-6 md:pt-14' : 'pt-4 md:pt-12'} pb-6 px-3 lg:px-6`}>

          <div className="bg-white shadow-lg md:shadow-xl shadow-slate-200/50 rounded-xl md:rounded-3xl overflow-hidden relative min-h-[400px] border border-slate-100 flex-grow md:flex-grow-0 flex flex-col">
            
            <AnimatePresence mode="wait">
              
              {isLoading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white z-20"
                >
                  <Loader2 className="w-14 h-14 text-blue-600 animate-spin mb-4" />
                  <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-2 text-center">Analizando tus respuestas...</h2>
                  <p className="text-sm md:text-base text-slate-500 font-medium text-center">Generando tu protocolo personalizado</p>
                </motion.div>
              )}

              {!isLoading && currentStep < steps.length && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-5 md:p-10 w-full flex flex-col flex-grow relative"
                >
                  
                  {currentStep === 0 && (
                    <div className="text-center mb-6 md:mb-10 mt-2 md:mt-0">
                      <h1 className="text-2xl md:text-[2.75rem] font-extrabold text-slate-900 mb-2 md:mb-5 leading-tight tracking-tight">
                        Descubre Tu Tipo de Intestino y la Verdad Sobre la Fibra, los Laxantes y <span className="text-rose-500">los Probióticos</span>
                      </h1>
                    </div>
                  )}

                  <div className="text-center mb-8 md:mb-12 mx-auto max-w-2xl px-2 mt-4 md:mt-8">
                    <h2 className={`font-bold text-slate-900 leading-tight ${currentStep === 0 ? 'text-2xl md:text-3xl' : 'text-[28px] md:text-4xl'}`}>
                      {steps[currentStep].question}
                    </h2>
                    {steps[currentStep].type === 'multi' && (
                      <p className="text-sm md:text-base text-slate-500 font-medium mt-1.5 md:mt-2">
                        (Puedes elegir más de una)
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 md:gap-6 w-full max-w-xl mx-auto mb-8 md:mb-10">
                    {steps[currentStep].options.map((opt, i) => {
                      const selected = isSelected(opt.value);
                      const isMulti = steps[currentStep].type === 'multi';
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(opt.value)}
                          className={`
                            w-full text-left transition-colors flex items-center justify-between group outline-none min-h-[72px] md:min-h-[80px] p-5 md:p-6
                            rounded-xl md:rounded-2xl border-2 
                            ${selected 
                              ? 'border-blue-600 bg-blue-50/50' 
                              : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                            }
                          `}
                        >
                          <div className="flex-grow pr-4">
                            <span className={`block font-bold text-[18px] md:text-2xl transition-colors leading-snug ${selected ? 'text-blue-900' : 'text-slate-900'}`}>
                              {opt.label}
                            </span>
                            {opt.description && (
                              <span className={`block mt-1.5 md:mt-2 text-[15px] md:text-lg font-medium transition-colors leading-relaxed ${selected ? 'text-blue-800/80' : 'text-slate-600'}`}>
                                {opt.description}
                              </span>
                            )}
                          </div>
                          
                          <div className={`
                            flex-shrink-0 flex items-center justify-center transition-colors
                            ${isMulti ? 'w-8 h-8 rounded-md flex-shrink-0' : 'w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0'}
                            ${selected 
                              ? (isMulti ? 'bg-blue-600 border-blue-600' : 'border-[7px] border-blue-600 bg-white') 
                              : 'border-2 border-slate-300 bg-white group-hover:border-blue-400'}
                          `}>
                            {isMulti && selected && <Check size={14} strokeWidth={4} className="text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {steps[currentStep].type === 'multi' && steps[currentStep].buttonText && (
                    <div className="w-full max-w-xl mx-auto mt-2 mb-8 md:mb-4">
                      <button
                        onClick={handleNext}
                        disabled={!hasAnsweredCurrentStep()}
                        className={`w-full font-bold text-[20px] md:text-2xl py-5 rounded-xl md:rounded-2xl transition-colors flex justify-center items-center h-[68px] md:h-[72px] ${
                          hasAnsweredCurrentStep()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-80'
                        }`}
                      >
                        {steps[currentStep].buttonText}
                      </button>
                    </div>
                  )}

                </motion.div>
              )}

              {!isLoading && currentStep === steps.length && (
                 <motion.div
                   key="vsl"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.15 }}
                   className="p-5 md:p-12 w-full flex flex-col items-center bg-white"
                 >
                   
                   <div className="text-center mb-6 max-w-2xl px-1 mt-2">
                     <p className="font-extrabold text-xl md:text-2xl text-slate-900 mb-3">
                       ¡Gracias por responder!
                     </p>
                     <p className="text-slate-700 text-[15px] md:text-lg leading-snug md:leading-relaxed font-medium">
                       Según tus respuestas, tu caso coincide con un patrón que la <strong className="font-extrabold text-slate-900 bg-blue-100/50 px-1 py-0.5 rounded">Dra. Sofía Morales</strong> ha visto miles de veces. En este video te explica las 3 fases exactas que puedes empezar a aplicar hoy mismo:
                     </p>
                   </div>

                   <div className="flex items-center justify-center mb-6 w-full">
                      <div className="relative inline-flex items-center">
                         <svg className="absolute -left-6 md:-left-8 top-1 md:-top-0.5 text-slate-900 w-6 md:w-8 h-6 md:h-8 overflow-visible" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 80 20 Q 20 20 40 80" />
                            <path d="M 20 60 L 40 80 L 60 60" />
                         </svg>
                         <span className="font-extrabold text-lg md:text-xl text-slate-800">Haz clic para reproducir</span>
                      </div>
                   </div>

                   <div className="relative w-full max-w-sm md:max-w-md mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl cursor-pointer group bg-slate-900 aspect-[3/4] flex flex-col justify-center items-center transform transition-transform hover:scale-[1.01] duration-300 mb-8">
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-80 z-0"></div>
                      
                      <div className="absolute top-3 md:top-4 inset-x-2 md:inset-x-4 flex justify-center text-white/95 z-10 w-full pointer-events-none">
                         <span className="text-[10px] md:text-sm font-bold bg-black/60 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 md:gap-2 shadow-lg border border-white/10 uppercase tracking-wide text-center">
                            <Volume2 size={14} className="text-blue-400 animate-pulse hidden md:block" /> 
                            Tu video ya está reproduciéndose — Haz clic para activar el sonido
                         </span>
                      </div>

                      <div className="z-10 group-hover:scale-110 transition-transform duration-500 ease-out mt-4 md:mt-0">
                         <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)] group-hover:bg-blue-500 transition-colors">
                            <Play className="text-white ml-1.5 md:ml-2 w-8 h-8 md:w-12 md:h-12" fill="currentColor" />
                         </div>
                      </div>
                   </div>

                   {showOffer && (
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.5 }}
                       className="w-full max-w-sm md:max-w-md mx-auto mb-10"
                     >
                       <motion.a
                         href="https://app.hotmart.com"
                         animate={{ scale: [1, 1.02, 1] }}
                         transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                         className="w-full flex justify-center items-center text-center bg-green-600 hover:bg-green-500 text-white font-black text-xl md:text-2xl py-5 rounded-xl md:rounded-2xl shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] hover:-translate-y-1 transition-all duration-200 uppercase tracking-wide"
                       >
                         Acceder al Protocolo
                       </motion.a>
                     </motion.div>
                   )}
                   
                  </motion.div>
              )}

            </AnimatePresence>
          </div>
      </main>

    </div>
  );
}
