import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Cpu, FileDown, BookOpen, ChevronDown, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StudyHubProps {
  setViewMode: (mode: 'Lobby' | 'Study' | 'Interview') => void;
  showStudyAssistant: boolean;
  setShowStudyAssistant: (show: boolean) => void;
  downloadCheatSheet: () => void;
  showMasterGlossary: boolean;
  setShowMasterGlossary: (show: boolean) => void;
  glossaryCategory: string;
  setGlossaryCategory: (cat: string) => void;
  masterGlossary: any[];
  studyModules: any[];
  expandedStudyModule: string | null;
  setExpandedStudyModule: (id: string | null) => void;
  studyMessages: { role: 'user' | 'assistant', text: string }[];
  studyInput: string;
  setStudyInput: (val: string) => void;
  isStudyThinking: boolean;
  handleSendStudyMessage: (override?: string) => void;
}

export const StudyHub: React.FC<StudyHubProps> = ({
  setViewMode,
  showStudyAssistant,
  setShowStudyAssistant,
  downloadCheatSheet,
  showMasterGlossary,
  setShowMasterGlossary,
  glossaryCategory,
  setGlossaryCategory,
  masterGlossary,
  studyModules,
  expandedStudyModule,
  setExpandedStudyModule,
  studyMessages,
  studyInput,
  setStudyInput,
  isStudyThinking,
  handleSendStudyMessage
}) => {
  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-12 max-w-7xl mx-auto w-full relative">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setViewMode('Lobby')}
          className="flex items-center text-white/40 hover:text-perficient transition-colors uppercase text-[0.625rem] font-bold tracking-[0.2em] group"
        >
          <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Terminal
        </button>
        <div className="flex gap-4">
          <button 
            onClick={downloadCheatSheet}
            className="hidden sm:flex px-4 py-2 bg-perficient/10 hover:bg-perficient/20 border border-perficient/20 text-perficient font-bold uppercase tracking-widest text-[0.5625rem] transition-all items-center gap-2 rounded"
          >
            <FileDown className="w-3 h-3" />
            Executive Cheat Sheet
          </button>
          <button 
            onClick={() => setShowStudyAssistant(!showStudyAssistant)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all text-[0.5625rem] font-bold uppercase tracking-widest shadow-lg ${
              showStudyAssistant ? 'border-perficient bg-perficient text-black shadow-perficient/20' : 'border-white/10 bg-white/5 text-white hover:border-perficient'
            }`}
          >
            <Cpu className={`w-3 h-3 ${showStudyAssistant ? 'text-black' : 'text-perficient'}`} />
            {showStudyAssistant ? 'Minimize Neural Link' : 'Activate Study Assistant'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <motion.div 
          layout
          className={`space-y-12 transition-all duration-500 ${showStudyAssistant ? 'lg:w-[60%]' : 'w-full'}`}
        >
          <header className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2 text-white">
                  Executive <span className="text-perficient">Knowledge Hub</span>
                </h2>
                <p className="text-white/40 font-mono text-sm leading-relaxed max-w-2xl">
                  Analyze the "Guts" of Agentic Commerce and AI Quality Assurance. 
                  Master these architectural patterns to pass the Director-level technical deep-dives.
                </p>
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 shrink-0">
                <button 
                  onClick={() => setShowMasterGlossary(false)}
                  className={`px-4 py-2 text-[0.5625rem] font-bold uppercase tracking-widest transition-all rounded ${!showMasterGlossary ? 'bg-perficient text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Modules
                </button>
                <button 
                  onClick={() => setShowMasterGlossary(true)}
                  className={`px-4 py-2 text-[0.5625rem] font-bold uppercase tracking-widest transition-all rounded ${showMasterGlossary ? 'bg-perficient text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Glossary
                </button>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {showMasterGlossary ? (
              <motion.div 
                key="glossary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'AI/ML', 'QA/EVALS', 'INFRA/TI', 'EXEC/BIZ'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setGlossaryCategory(cat)}
                      className={`px-3 py-1.5 text-[0.5625rem] font-bold border transition-all rounded-md ${
                        glossaryCategory === cat ? 'bg-perficient border-perficient text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {masterGlossary.filter(item => glossaryCategory === 'ALL' || item.category === glossaryCategory).map((item, idx) => (
                    <div key={idx} className="executive-panel p-5 border-white/10 bg-white/5 group hover:border-perficient/40 hover:bg-perficient/5 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-bold text-white group-hover:text-perficient transition-colors">{item.term}</span>
                        <span className="text-[0.4375rem] bg-white/10 px-2 py-0.5 rounded text-white/60 uppercase font-mono tracking-tighter">{item.category}</span>
                      </div>
                      <p className="text-xs text-white/40 font-mono leading-relaxed group-hover:text-white/70 transition-colors">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="modules"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {studyModules.map((module) => (
                  <div 
                    key={module.id} 
                    onClick={() => setExpandedStudyModule(expandedStudyModule === module.id ? null : module.id)}
                    className="executive-panel overflow-hidden border-white/10 bg-white/5 p-0 transition-all hover:border-white/20 cursor-pointer"
                  >
                    <div className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left relative z-20">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg transition-colors ${expandedStudyModule === module.id ? 'bg-perficient/20 text-perficient' : 'bg-white/5 text-white/20'}`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">{module.title}</h4>
                          <p className="text-[0.625rem] text-white/30 font-mono mt-1">{module.concept}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-300 ${expandedStudyModule === module.id ? 'rotate-180 text-perficient' : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                      {expandedStudyModule === module.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-8 pt-2"
                        >
                          <div className="pl-4 md:pl-14 space-y-8" onClick={(e) => e.stopPropagation()}>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                              {/* Deep Dives */}
                              <div className="space-y-6">
                                <h5 className="text-[0.625rem] font-bold text-perficient uppercase tracking-widest flex items-center">
                                  <Sparkles className="w-3 h-3 mr-2" /> Technical Deep Dive
                                </h5>
                                <div className="space-y-4">
                                  {module.deepDive.map((dive: any, idx: number) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-perficient/30 transition-all group/dive">
                                      <h6 className="text-[0.6875rem] font-bold text-white/90 mb-2 group-hover/dive:text-perficient transition-colors">{dive.header}</h6>
                                      <p className="text-[0.6875rem] text-white/40 leading-relaxed font-mono">{dive.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Case Study & Comparison */}
                              <div className="space-y-8">
                                {module.caseStudy && (
                                  <div className="space-y-4">
                                    <h5 className="text-[0.625rem] font-bold text-perficient uppercase tracking-widest flex items-center">
                                      <Cpu className="w-3 h-3 mr-2" /> Strategic Case Study
                                    </h5>
                                    <div className="bg-perficient/5 border border-perficient/10 rounded-xl p-5 space-y-3">
                                      <h6 className="text-sm font-bold text-perficient">{module.caseStudy.title}</h6>
                                      <div className="space-y-2">
                                        <p className="text-[0.625rem] text-white/60"><span className="text-white/20 uppercase mr-2 font-bold">Scenario:</span> {module.caseStudy.scenario}</p>
                                        <p className="text-[0.625rem] text-white/60"><span className="text-white/20 uppercase mr-2 font-bold">Solution:</span> {module.caseStudy.solution}</p>
                                        <p className="text-[0.625rem] text-emerald-500/80 font-bold italic"><span className="text-white/20 uppercase mr-2 font-bold not-italic">ROI:</span> {module.caseStudy.roi}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {module.comparison && (
                                  <div className="space-y-4">
                                    <h5 className="text-[0.625rem] font-bold text-perficient uppercase tracking-widest flex items-center">
                                      <ChevronRight className="w-3 h-3 mr-2" /> Architectural Trade-offs
                                    </h5>
                                    <div className="space-y-3">
                                      {module.comparison.map((comp: any, idx: number) => (
                                        <div key={idx} className="space-y-3">
                                          <p className="text-[0.5625rem] font-bold text-white/20 uppercase tracking-widest">{comp.label}</p>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {comp.items.map((item: any, i: number) => (
                                              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                                                <p className="text-[0.6875rem] font-bold text-white">{item.name}</p>
                                                <p className="text-[0.625rem] text-white/40 font-mono leading-tight">{item.description}</p>
                                                <div className="flex justify-between text-[0.5rem] font-bold uppercase tracking-tighter pt-1 border-t border-white/5">
                                                  <span className="text-emerald-500/60">PRO: {item.pro}</span>
                                                  <span className="text-rose-500/60">CON: {item.con}</span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {module.acronyms && (
                                  <div className="space-y-4">
                                    <h5 className="text-[0.625rem] font-bold text-perficient uppercase tracking-widest flex items-center">
                                      <BookOpen className="w-3 h-3 mr-2" /> Executive Acronyms
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {Object.entries(module.acronyms).map(([term, def]: [string, any], idx) => (
                                        <div key={idx} className="group/term relative">
                                          <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-[0.625rem] text-white/60 hover:text-perficient hover:border-perficient/40 transition-all cursor-help">
                                            {term}
                                          </div>
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-perficient/30 rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover/term:opacity-100 transition-opacity z-50 text-[0.5625rem] text-white/80 leading-relaxed">
                                            <p className="font-bold text-perficient mb-1">{term}</p>
                                            {def}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="p-4 bg-perficient text-black rounded-xl">
                                  <p className="text-[0.625rem] font-bold uppercase tracking-widest mb-1 italic">Executive Takeaway</p>
                                  <p className="text-xs font-bold leading-relaxed">{module.executiveTakeaway}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Study Assistant Panel */}
        <AnimatePresence>
          {showStudyAssistant && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'min(450px, 35%)', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col bg-black/60 backdrop-blur-2xl border-l border-white/10 sticky top-0 h-screen z-50 shadow-2xl overflow-hidden shrink-0"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-perficient/20 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-perficient" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Neural Assistant</h3>
                    <p className="text-[0.5625rem] text-emerald-500 font-mono animate-pulse">● ARCHITECT_MODE_ACTIVE</p>
                  </div>
                </div>
                <button onClick={() => setShowStudyAssistant(false)} className="text-white/20 hover:text-white p-2 transition-colors">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {studyMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                    <MessageSquare className="w-12 h-12 text-white/20" />
                    <p className="text-xs font-mono uppercase tracking-widest">Awaiting Architectural Query...</p>
                  </div>
                )}
                {studyMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-4 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'user' ? 'bg-perficient text-black font-bold' : 'bg-white/5 border border-white/10 text-white/80 font-mono'
                    }`}>
                      <div className="markdown-body text-inherit">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[0.5rem] uppercase font-bold text-white/20 mt-1 tracking-widest px-1">
                      {msg.role === 'user' ? 'Gabriel' : 'Assistant Core'}
                    </span>
                  </div>
                ))}
                {isStudyThinking && (
                  <div className="flex items-center space-x-3 text-perficient/50 animate-pulse">
                    <Loader3 className="w-4 h-4 animate-spin" />
                    <span className="text-[0.625rem] font-mono uppercase tracking-[0.2em]">Processing architectural shift...</span>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-black/40">
                <div className="relative group">
                  <textarea
                    value={studyInput}
                    onChange={(e) => setStudyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendStudyMessage())}
                    placeholder="Ask about MLOps, RAG security, or TCO optimization..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-12 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-perficient/50 transition-all resize-none h-24"
                  />
                  <button 
                    onClick={() => handleSendStudyMessage()}
                    disabled={isStudyThinking || !studyInput.trim()}
                    className="absolute right-3 bottom-3 p-2 bg-perficient/10 hover:bg-perficient text-perficient hover:text-black rounded-lg transition-all disabled:opacity-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Loader3 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V6M12 18V22M6 12H2M22 12H18M5.63604 5.63604L8.46447 8.46447M15.5355 15.5355L18.364 18.364M5.63604 18.364L8.46447 15.5355M15.5355 8.46447L18.364 5.63604" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

