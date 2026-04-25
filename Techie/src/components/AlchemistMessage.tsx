import React, { useState } from 'react';
import { AlchemistContent } from '../types';

interface AlchemistMessageProps {
  content: AlchemistContent;
  onSuccess: (text: string) => void;
  onAwardBadge?: (id: string, name: string, desc: string, icon: string) => void;
}

const AlchemistMessage: React.FC<AlchemistMessageProps> = ({ content, onSuccess, onAwardBadge }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [resultStatus, setResultStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const handleSelect = (id: string) => {
    if (resultStatus !== 'idle') return; // Can't select after checking

    setSelectedIds(prev => {
        if (prev.includes(id)) {
            return prev.filter(item => item !== id);
        }
        if (prev.length < 2) {
            return [...prev, id];
        }
        // If already 2, replace the last one
        return [prev[0], id];
    });
  };

  const handleMix = () => {
      if (selectedIds.length !== 2) return;

      const isCorrect = content.correctCombination.every(c => selectedIds.includes(c));
      
      if (isCorrect) {
          setResultStatus('success');
          if (onAwardBadge) {
              onAwardBadge(
                  `alchemist_${content.goal.replace(/\s+/g, '_').toLowerCase()}`,
                  `Alquimista: ${content.goal}`,
                  `Descubriste la combinación para crear ${content.goal}`,
                  '🧪'
              );
          }
      } else {
          setResultStatus('fail');
      }
  };

  const handleReset = () => {
      setSelectedIds([]);
      setResultStatus('idle');
  };

  const handleContinue = () => {
      onSuccess(`¡He logrado crear: ${content.goal}! ¿Qué sigue maestro alquimista?`);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-2xl p-4 sm:p-6 text-white shadow-xl w-full border border-purple-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse">
            🧪
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-purple-300 font-bold opacity-80">Laboratorio Alquimista</p>
            <h3 className="text-xl font-black text-purple-100">{content.goal}</h3>
        </div>
      </div>
      
      <p className="text-sm md:text-base text-purple-100 mb-6 leading-relaxed italic border-l-4 border-purple-500 pl-3">
          "{content.story}"
      </p>

      {/* Calderón (Mix Area) */}
      <div className="flex justify-center items-center gap-4 mb-6">
          <div className="flex gap-3">
            {[0, 1].map((index) => {
                const elementId = selectedIds[index];
                const elementInfo = elementId ? content.elements.find(e => e.id === elementId) : null;
                
                return (
                    <div key={index} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${elementInfo ? 'bg-indigo-800 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-black/20 border-dashed border-purple-500/40'}`}>
                        {elementInfo ? (
                            <>
                                <span className="text-2xl sm:text-3xl drop-shadow-md">{elementInfo.emoji}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold mt-1 text-indigo-100 uppercase truncate w-full text-center px-1">{elementInfo.name}</span>
                            </>
                        ) : (
                            <span className="text-2xl opacity-20">?</span>
                        )}
                    </div>
                );
            })}
          </div>
          
          {resultStatus === 'idle' && (
             <button 
                onClick={handleMix}
                disabled={selectedIds.length !== 2}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all ${
                    selectedIds.length === 2 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 shadow-[0_0_20px_rgba(219,39,119,0.5)] cursor-pointer hover:scale-105 active:scale-95' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border-2 border-gray-700'
                }`}
            >
                Mezclar
            </button>
          )}
      </div>

      {/* Result Display */}
      {resultStatus !== 'idle' && (
          <div className={`p-4 rounded-xl mb-6 border animate-fade-in ${resultStatus === 'success' ? 'bg-emerald-900/50 border-emerald-500' : 'bg-red-900/50 border-red-500'}`}>
              <div className="flex items-center gap-3">
                  <span className="text-3xl">{resultStatus === 'success' ? '✨' : '💥'}</span>
                  <p className="font-bold text-sm sm:text-base">
                      {resultStatus === 'success' ? content.successMessage : content.failMessage}
                  </p>
              </div>
              
              <div className="mt-4 flex justify-end">
                  {resultStatus === 'success' ? (
                      <button 
                          onClick={handleContinue}
                          className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition-all"
                      >
                          ¡Siguiente Reto!
                      </button>
                  ) : (
                      <button 
                          onClick={handleReset}
                          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-6 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition-all"
                      >
                          Limpiar Calderón
                      </button>
                  )}
              </div>
          </div>
      )}

      {/* Elements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {content.elements.map(el => {
              const isSelected = selectedIds.includes(el.id);
              return (
                  <button
                    key={el.id}
                    onClick={() => handleSelect(el.id)}
                    disabled={resultStatus !== 'idle'}
                    className={`p-3 rounded-xl border flex flex-col items-center transition-all ${
                        isSelected 
                        ? 'bg-purple-600/40 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)] scale-95' 
                        : 'bg-black/20 border-purple-500/20 hover:bg-purple-800/40 hover:border-purple-400/50'
                    } ${resultStatus !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                      <span className="text-3xl mb-1 drop-shadow-md">{el.emoji}</span>
                      <span className="text-xs font-bold text-purple-100 text-center w-full truncate">{el.name}</span>
                  </button>
              );
          })}
      </div>
    </div>
  );
};

export default AlchemistMessage;
