import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Lightbulb, 
  X, 
  RefreshCcw, 
  AlertTriangle, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  BarChart3,
  Cpu,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Persona, Message, Scenario } from '../types';

interface InterviewProps {
  scenario: Scenario;
  messages: Message[];
  isThinking: boolean;
  input: string;
  setInput: (val: string) => void;
  handleSend: (audio?: any) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  errorStatus: string | null;
  setViewMode: (mode: 'Lobby' | 'Study' | 'Interview') => void;
  handleCoachingRequest: () => void;
  coachingData: any;
  isCoachingLoading: boolean;
  setCoachingData: (data: any) => void;
  currentScore: number;
}

export const Interview: React.FC<InterviewProps> = ({
  scenario,
  messages,
  isThinking,
  input,
  setInput,
  handleSend,
  isRecording,
  startRecording,
  stopRecording,
  errorStatus,
  setViewMode,
  handleCoachingRequest,
  coachingData,
  isCoachingLoading,
  setCoachingData,
  currentScore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <>
      <div className="flex-grow flex flex-row h-full relative overflow-hidden bg-executive-dark/50">
        <div className="flex-grow flex flex-col h-full relative min-w-0">
          {/* Scenario Header */}
          <header className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setViewMode('Lobby')}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">{scenario.title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-[0.5rem] px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter ${
                    scenario.difficulty === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-perficient/20 text-perficient'
                  }`}>
                    {scenario.difficulty} Priority
                  </span>
                  <span className="text-[0.5625rem] text-white/30 font-mono">ID: {scenario.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[0.5rem] uppercase font-bold text-white/30 tracking-widest">Real-time Grade</span>
                <div className="flex items-center space-x-2">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${currentScore >= 7 ? 'bg-emerald-500' : currentScore >= 4 ? 'bg-perficient' : 'bg-red-500'}`} />
                   <span className="text-xl font-mono text-white">{currentScore.toFixed(1)}</span>
                </div>
              </div>
              <button 
                onClick={handleCoachingRequest}
                disabled={isThinking || isCoachingLoading}
                className={`p-3 rounded-full transition-all border flex items-center space-x-2 ${
                  coachingData ? 'border-perficient bg-perficient text-black' : 'border-white/10 bg-white/5 text-perficient hover:bg-white/10'
                }`}
              >
                <Lightbulb className={`w-5 h-5 ${isCoachingLoading ? 'animate-pulse' : ''}`} />
                <span className="text-[0.625rem] font-bold uppercase tracking-widest hidden lg:inline">Get Coaching</span>
              </button>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-4 md:p-10 space-y-8 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === 'CANDIDATE' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[60%] space-y-2 ${msg.sender === 'CANDIDATE' ? 'items-end' : 'items-start'}`}>
                    {msg.sender !== 'CANDIDATE' && (
                      <div className="flex items-center space-x-2 ml-1">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${msg.sender === Persona.SAM ? 'bg-perficient/20' : 'bg-blue-600/20'}`}>
                           {msg.sender === Persona.SAM ? <BarChart3 className="w-3 h-3 text-perficient" /> : <Cpu className="w-3 h-3 text-blue-400" />}
                        </div>
                        <span className="text-[0.625rem] font-bold uppercase tracking-widest text-white/60">{msg.personaName}</span>
                      </div>
                    )}
                    
                    <div className={`p-6 rounded-2xl relative shadow-xl ${
                      msg.sender === 'CANDIDATE' 
                        ? 'bg-perficient text-black font-medium selection:bg-black/20' 
                        : 'bg-white/5 border border-white/10 text-white/90 backdrop-blur-sm'
                    }`}>
                      <div className="markdown-body text-inherit">
                        <ReactMarkdown>
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {/* Message Metadata/Reasoning for Non-Candidates */}
                      {msg.sender !== 'CANDIDATE' && msg.score !== undefined && (
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                             <div className="text-[0.5625rem] uppercase font-bold text-white/30 tracking-widest">Panel Evaluation</div>
                             <div className={`px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold ${msg.score >= 8 ? 'bg-emerald-500/20 text-emerald-400' : msg.score >= 5 ? 'bg-perficient/20 text-perficient' : 'bg-red-500/20 text-red-400'}`}>
                                {msg.score}/10
                             </div>
                          </div>
                          {msg.reasoning && (
                            <div className="group relative">
                              <AlertTriangle className="w-4 h-4 text-white/20 hover:text-perficient transition-colors cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black border border-white/10 rounded-lg text-[0.625rem] font-mono leading-relaxed text-white/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                {msg.reasoning}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 px-2 text-[0.5rem] uppercase font-bold tracking-widest text-white/20">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.sender === 'CANDIDATE' && <CheckCircle2 className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isThinking && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3 ml-2"
              >
                 <div className="flex space-x-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-perficient" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-perficient/60" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-perficient/30" />
                 </div>
                 <span className="text-[0.625rem] font-mono uppercase tracking-[0.2em] text-white/30">Panel deliberating...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-black/40 border-t border-white/10 backdrop-blur-xl relative">
            <AnimatePresence>
              {errorStatus && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-[0.625rem] font-bold uppercase tracking-widest p-3 rounded-lg mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {errorStatus}
                  </div>
                  <button onClick={() => window.location.reload()} className="flex items-center gap-1 hover:text-white transition-colors">
                    <RefreshCcw className="w-3 h-3" /> Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto flex items-end space-x-4">
              <div className="flex-grow relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Deploy your executive response..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pr-14 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-perficient/50 transition-all resize-none h-20 scrollbar-hide"
                />
                <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                  <button 
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    className={`p-2.5 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-white/5 text-white/30 hover:text-perficient hover:bg-white/10'}`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => handleSend()}
                disabled={isThinking || (!input.trim() && !isRecording)}
                className="p-5 bg-perficient text-black rounded-2xl hover:bg-perficient/80 transition-all shadow-[0_0_20px_rgba(242,125,38,0.2)] disabled:opacity-20 disabled:grayscale"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {coachingData && (
            <>
              {/* Backdrop for Mobile */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCoachingData(null)}
                className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              />
              
              <motion.div 
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed lg:relative inset-y-0 right-0 w-full lg:w-[400px] bg-black/90 lg:bg-black/40 border-l border-white/10 p-6 z-[110] lg:z-30 backdrop-blur-2xl overflow-y-auto h-full shrink-0"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-perficient" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Neural Coaching</h3>
                  </div>
                  <button onClick={() => setCoachingData(null)} className="text-white/20 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[0.625rem] font-bold text-perficient uppercase tracking-widest">Model Response</h4>
                    <div className="p-4 bg-perficient/5 border border-perficient/20 rounded-xl space-y-4">
                      <p className="text-xs text-white/90 leading-relaxed italic font-sans">{coachingData.modelAnswer}</p>
                      <button 
                        onClick={() => { setInput(coachingData.modelAnswer); setCoachingData(null); }}
                        className="w-full py-2.5 bg-perficient text-black text-[0.5625rem] font-bold uppercase tracking-widest rounded hover:bg-perficient/80 transition-all shadow-[0_0_15px_rgba(242,125,38,0.2)]"
                      >
                        Adopt Response
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-[0.625rem] font-bold text-perficient uppercase tracking-widest">Strategic Vector</h4>
                    <p className="text-[0.6875rem] text-white/60 leading-relaxed font-mono">{coachingData.strategy}</p>
                  </div>
                  
                  {coachingData.acronymGlossary && Object.keys(coachingData.acronymGlossary).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[0.625rem] font-bold text-white/30 uppercase tracking-widest border-t border-white/5 pt-4">Tactical Glossary</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(coachingData.acronymGlossary).map(([term, def]: [any, any]) => (
                          <div key={term} className="flex flex-col space-y-1">
                            <span className="text-[0.625rem] font-bold text-perficient uppercase tracking-tighter">{term}</span>
                            <span className="text-[0.5625rem] text-white/40 font-mono leading-tight">{def}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

