import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, PlayCircle } from 'lucide-react';
import { Scenario } from '../types';

interface LobbyProps {
  viewMode: 'Lobby' | 'Study' | 'Interview';
  setViewMode: (mode: 'Lobby' | 'Study' | 'Interview') => void;
  scenarios: Scenario[];
  passedScenarios: string[];
  startScenario: (scenario: Scenario) => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  viewMode,
  setViewMode,
  scenarios,
  passedScenarios,
  startScenario
}) => {
  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-12 flex flex-col items-center justify-center space-y-12 max-w-5xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">
          <span className="text-white">Director's</span> 
          <span className="text-perficient glitch-text ml-3">Command Center</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 w-full">
        {scenarios.map((scenario) => {
          const isPassed = passedScenarios.includes(scenario.id);
          return (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startScenario(scenario)}
              className={`executive-panel p-8 text-left cursor-pointer transition-all border-2 relative overflow-hidden group ${
                isPassed ? 'border-perficient/40 bg-perficient/5 shadow-[0_0_20px_rgba(242,125,38,0.1)]' : 'border-white/5 bg-white/5 hover:border-perficient/30 shadow-xl'
              } ${!isPassed && 'opacity-90'}`}
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 {scenario.difficulty === 'Critical' ? 
                  <div className="w-24 h-24 bg-red-500 rounded-full blur-3xl" /> : 
                  <div className="w-24 h-24 bg-perficient rounded-full blur-3xl" />
                 }
              </div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`text-[0.5625rem] uppercase font-bold tracking-widest px-2.5 py-1 rounded border ${
                  scenario.difficulty === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  scenario.difficulty === 'Extreme' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-perficient/10 text-perficient border-perficient/20'
                }`}>
                  {scenario.difficulty} Difficulty
                </div>
                {isPassed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Trophy className="w-5 h-5 text-perficient" />
                  </motion.div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-4 group-hover:text-perficient transition-colors relative z-10">{scenario.title}</h3>
              <p className="text-sm text-white/50 mb-10 font-mono leading-relaxed relative z-10 min-h-[4rem]">{scenario.description}</p>
              
              <div className="flex items-center justify-between pt-8 border-t border-white/10 relative z-10">
                <div className="space-y-1">
                  <p className="text-[0.5rem] uppercase text-white/30 font-bold tracking-widest">Focus Area</p>
                  <span className="text-[0.625rem] uppercase text-white/70 font-bold font-mono">{scenario.focus}</span>
                </div>
                <div className="flex items-center text-perficient text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  {isPassed ? 'Restart Simulation' : 'Enter Gauntlet'}
                  <PlayCircle className="w-4 h-4 ml-2" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

