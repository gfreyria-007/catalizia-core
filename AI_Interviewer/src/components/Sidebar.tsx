import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Volume2, 
  VolumeX, 
  PanelLeftClose, 
  PanelLeftOpen, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Loader2, 
  Target, 
  Zap, 
  ShieldAlert, 
  FileDown 
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  user: FirebaseUser | null;
  isAuthLoading: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  currentScore: number;
  stressLevel: number;
  precisionLevel: number;
  showArchitectConsole: boolean;
  setShowArchitectConsole: (show: boolean) => void;
  downloadCheatSheet: () => void;
  setCurrentScore: (score: number) => void;
  lastMessageSender?: string;
  Persona: any;
  fontSizeScale: number;
  setFontSizeScale: (scale: number | ((s: number) => number)) => void;
  viewMode: 'Lobby' | 'Study' | 'Interview';
  setViewMode: (mode: 'Lobby' | 'Study' | 'Interview') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  setShowSidebar,
  isMuted,
  setIsMuted,
  user,
  isAuthLoading,
  handleLogin,
  handleLogout,
  currentScore,
  stressLevel,
  precisionLevel,
  showArchitectConsole,
  setShowArchitectConsole,
  downloadCheatSheet,
  setCurrentScore,
  lastMessageSender,
  Persona,
  fontSizeScale,
  setFontSizeScale,
  viewMode,
  setViewMode
}) => {
  return (
    <>
      {!showSidebar && (
        <button 
          onClick={() => setShowSidebar(true)}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 p-2 bg-black/80 backdrop-blur-xl border border-perficient/20 text-perficient hover:text-white hover:border-perficient rounded transition-all shadow-[0_0_20px_rgba(242,125,38,0.2)] group"
        >
          <PanelLeftOpen className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          <span className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] pr-2 hidden md:inline">Show Console</span>
        </button>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSidebar(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSidebar && (
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed md:relative inset-y-0 left-0 w-[18.5rem] border-r border-white/10 flex flex-col p-5 md:p-6 space-y-6 bg-black/90 md:bg-black/40 backdrop-blur-2xl shrink-0 overflow-y-auto z-[110] md:z-40 scrollbar-thin scrollbar-thumb-perficient/20"
          >
            <div className="md:hidden flex justify-end mb-2">
              <button onClick={() => setShowSidebar(false)} className="text-white/40 hover:text-white">
                <PanelLeftClose className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8 w-full">
              <header className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="text-perficient w-5 h-5" />
                  <h1 className="text-xl font-bold tracking-tighter uppercase glitch-text">GAUNTLET</h1>
                </div>
                
                <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.5rem] uppercase tracking-widest text-white/40 font-bold">System Config</span>
                    <button 
                      onClick={() => setShowSidebar(false)} 
                      className="p-1 hover:text-perficient transition-colors"
                      title="Hide Sidebar"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center flex-grow">
                      <div className="flex items-center w-full bg-black/40 border border-white/10 rounded overflow-hidden">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFontSizeScale(prev => Math.max(0.8, prev - 0.2)); }} 
                          className="flex-grow py-1.5 text-[0.625rem] font-bold text-white/40 hover:text-white hover:bg-white/10 transition-colors border-r border-white/10"
                          title="Decrease Text Size"
                        >
                          -A
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFontSizeScale(prev => Math.min(2.0, prev + 0.2)); }} 
                          className="flex-grow py-1.5 text-[0.625rem] font-bold text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="Increase Text Size"
                        >
                          +A
                        </button>
                      </div>
                      <span className="text-[0.4375rem] text-white/20 font-bold mt-1 uppercase tracking-widest">Interface Scale: {Math.round(fontSizeScale * 100)}%</span>
                    </div>
                    
                    <button 
                      onClick={() => setIsMuted(!isMuted)} 
                      className={`p-2 rounded border transition-all ${isMuted ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                      title={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </header>

              <nav className="space-y-2">
                <p className="text-[0.5rem] uppercase tracking-[0.25em] text-white/20 font-bold mb-3 pl-1">Global Navigation</p>
                <button 
                  onClick={() => setViewMode && setViewMode('Lobby')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all group ${
                    viewMode === 'Lobby' ? 'bg-perficient/10 border-perficient/40 text-perficient' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <Target className={`w-4 h-4 transition-transform group-hover:scale-110 ${viewMode === 'Lobby' ? 'text-perficient' : ''}`} />
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest">Command Center</span>
                </button>
                
                <button 
                  onClick={() => setViewMode && setViewMode('Study')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all group ${
                    viewMode === 'Study' ? 'bg-perficient/10 border-perficient/40 text-perficient' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 transition-transform group-hover:scale-110 ${viewMode === 'Study' ? 'text-perficient' : ''}`} />
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest">Knowledge Hub</span>
                </button>
              </nav>

              <div className="border-t border-white/5 pt-4">
                <p className="text-[0.5rem] uppercase tracking-[0.25em] text-white/20 font-bold mb-3 pl-1">Executive Authentication</p>
                {!isAuthLoading ? (
                  user ? (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-perficient/20 flex items-center justify-center shrink-0">
                          <UserIcon className="w-4 h-4 text-perficient" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.625rem] font-bold text-white uppercase truncate">Session Active</p>
                          <p className="text-[0.5625rem] font-mono text-white/40 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button onClick={handleLogout} className="p-2 text-white/20 hover:text-red-400 transition-colors">
                        <LogOut className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleLogin}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-perficient text-black rounded-lg text-[0.625rem] font-bold uppercase tracking-widest hover:bg-perficient/80 transition-all shadow-[0_0_15px_rgba(242,125,38,0.2)]"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Executive Login</span>
                    </button>
                  )
                ) : (
                  <div className="flex items-center justify-center p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-white/20" />
                  </div>
                )}
              </div>
            </div>

            <section className="space-y-6">
              <div className="space-y-2 group relative">
                <div className="flex justify-between items-end">
                  <label className="text-[0.625rem] uppercase font-bold text-white/60 flex items-center cursor-help" title="Overall KPI performance based on ROI and strategy.">
                    <Target className="w-3 h-3 mr-1" /> Delivery Score
                  </label>
                  <span className="font-mono text-xl text-perficient">{currentScore.toFixed(1)}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-perficient shadow-[0_0_10px_rgba(242,125,38,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentScore * 10}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 group relative">
                <div className="flex justify-between items-end">
                  <label className="text-[0.625rem] uppercase font-bold text-white/60 flex items-center cursor-help" title="Simulated examiner pressure. High stress risks simulation failure.">
                    <Zap className="w-3 h-3 mr-1" /> Stress Level
                  </label>
                  <span className="font-mono text-xl text-red-500">{stressLevel}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                    animate={{ width: `${stressLevel}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 group relative">
                <div className="flex justify-between items-end">
                  <label className="text-[0.625rem] uppercase font-bold text-white/60 flex items-center cursor-help whitespace-nowrap" title="Technical accuracy of architecture and tool selection.">
                    <ShieldAlert className="w-3 h-3 mr-1" /> Executive Precision
                  </label>
                  <span className="font-mono text-xl text-emerald-400">{precisionLevel}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${precisionLevel}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button 
                  onClick={() => setShowArchitectConsole(!showArchitectConsole)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded border border-white/5 transition-all group"
                >
                  <Terminal className="w-3 h-3 text-cyan-400 group-hover:animate-pulse" />
                  <span className="text-[0.5625rem] font-bold uppercase tracking-widest text-white/40 group-hover:text-white whitespace-nowrap">Toggle Architect_Console</span>
                </button>

                <button 
                  onClick={downloadCheatSheet}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-perficient/5 hover:bg-perficient/10 rounded border border-perficient/20 transition-all group"
                >
                  <FileDown className="w-3 h-3 text-perficient group-hover:animate-bounce" />
                  <span className="text-[0.5625rem] font-bold uppercase tracking-widest text-perficient">Download Cheat Sheet</span>
                </button>

                <AnimatePresence>
                  {showArchitectConsole && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 p-4 bg-black/60 rounded border border-cyan-500/30 font-mono text-[0.625rem] text-cyan-400 space-y-3 overflow-hidden"
                    >
                      <div className="flex justify-between items-center text-perficient/80 border-b border-perficient/20 pb-1">
                        <span>SYS_ARCH_MONITOR v4.1</span>
                        <span className="animate-pulse">● LIVE</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/30">VPC_TUNNEL:</span>
                          <span className="text-emerald-400">ENCRYPTED</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/30">H100_LOAD:</span>
                          <span className="text-emerald-400">12%</span>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <p className="text-[0.5625rem] text-white/30 italic whitespace-normal">Admin override enable. Manual KPI manipulation allowed.</p>
                        <div className="flex items-center gap-2">
                          <span className="w-16">KPI:</span>
                          <input 
                            type="range" min="0" max="10" step="0.1" 
                            value={currentScore} 
                            onChange={(e) => setCurrentScore(parseFloat(e.target.value))}
                            className="flex-grow accent-perficient h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                          />
                          <span className="w-8 text-right font-bold">{currentScore.toFixed(1)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="flex-grow" />

            <div className="executive-panel p-4 border-perficient/20 bg-perficient/5 space-y-3">
              <h3 className="text-[0.625rem] font-bold uppercase tracking-widest text-perficient">Interview Panel</h3>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded border flex items-center justify-center transition-all duration-500 ${lastMessageSender === Persona.SAM ? 'bg-perficient/40 border-perficient shadow-[0_0_10px_rgba(242,125,38,0.3)]' : 'bg-white/5 border-white/10'}`}>
                  <Target className={`w-4 h-4 ${lastMessageSender === Persona.SAM ? 'text-white' : 'text-perficient'}`} />
                </div>
                <div>
                  <p className="text-xs font-bold">Sam Davitt</p>
                  <p className="text-[0.5625rem] text-white/40 uppercase">Delivery Director</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded border flex items-center justify-center transition-all duration-500 ${lastMessageSender === Persona.JUDAH ? 'bg-blue-600/40 border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-white/5 border-white/10'}`}>
                  <ShieldAlert className={`w-4 h-4 ${lastMessageSender === Persona.JUDAH ? 'text-white' : 'text-blue-400'}`} />
                </div>
                <div>
                  <p className="text-xs font-bold">Judah Tice</p>
                  <p className="text-[0.5625rem] text-white/40 uppercase">Practice Director</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

