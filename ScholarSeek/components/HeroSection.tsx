
import React, { useState, useRef } from 'react';
import { SearchStatus, Language, SearchMode, UserState } from '../types';

interface HeroSectionProps {
  onSearch: (
    topic: string, 
    mode: SearchMode, 
    projectFiles: File[], 
    externalFiles: File[],
    context: string, 
    manualPaper: string, 
    keywords: string, 
    personalApiKey?: string
  ) => void;
  status: SearchStatus;
  language: Language;
  authState: UserState;
}

const translations = {
  es: {
    title: "ScholarSeek",
    subtitle: "Asistente de Revisión Sistemática para Doctorado",
    desc: "Análisis de alto impacto para investigadores de nivel doctoral. Identificación de brechas y oportunidades científicas.",
    placeholder: "Ingrese su tema central (ej. 'Impacto de la Inteligencia Artificial en la Educación Superior')",
    contextLabel: "Configuración Avanzada & Contexto (+)",
    contextPlaceholder: "Describa el marco teórico, restricciones geográficas, demográficas o metodológicas específicas...",
    manualPaperLabel: "Texto de Paper Manual (Abstract/Cuerpo):",
    manualPaperPlaceholder: "Pegue aquí el contenido de un paper clave para análisis prioritario...",
    keywordsLabel: "Palabras Clave de la Revisión:",
    keywordsPlaceholder: "Ingrese todas las palabras clave separadas por comas (ej: AI, Higher Education, Pedagogy...)",
    apiKeyLabel: "Personal Gemini API Key (Opcional):",
    apiKeyPlaceholder: "Pegue su API Key para usar sus propios créditos...",
    apiKeyNote: "Si se agotan los créditos del sistema, puede usar su propia cuenta de Google AI Studio.",
    button: "Investigar",
    searching: "Analizando...",
    loadingDeep: "Modo Profundo: Verificando citas en 250+ journals de alto impacto...",
    loadingFast: "Modo Rápido: Escaneo global optimizado...",
    modeDeep: "Investigación Profunda",
    modeFast: "Escaneo Rápido (Lite)",
    modeDescDeep: "Razonamiento extendido, verificación de fuentes.",
    modeDescFast: "Resultados veloces, exploración inicial.",
    uploadOwnLabel: "Anexo 1: Archivos Propios / Tesis (Contexto)",
    uploadExternalLabel: "Anexo 2: Papers Externos (Extracción de Datos)",
    filesSelected: "archivos seleccionados",
    clearFiles: "Borrar todo",
    maxFilesError: "Máximo 15 archivos permitidos.",
    loginRequired: "Por favor inicie sesión para comenzar su investigación."
  },
  en: {
    title: "ScholarSeek",
    subtitle: "PhD Systematic Review Assistant",
    desc: "High-impact analysis for doctoral researchers. Identification of scientific gaps and opportunities.",
    placeholder: "Enter research topic (e.g., 'Impact of Artificial Intelligence in Higher Education')",
    contextLabel: "Advanced Settings & Context (+)",
    contextPlaceholder: "Describe theoretical frameworks, geographic constraints, demographic details, or specific methodological requirements...",
    manualPaperLabel: "Manual Paper Text (Abstract/Body):",
    manualPaperPlaceholder: "Paste specific paper content here for priority analysis...",
    keywordsLabel: "Review Keywords:",
    keywordsPlaceholder: "Enter all keywords separated by commas (ex: AI, Higher Education, Pedagogy...)",
    apiKeyLabel: "Personal Gemini API Key (Optional):",
    apiKeyPlaceholder: "Paste your API Key to use your own credits...",
    apiKeyNote: "If system credits are exhausted, you can utilize your own Google AI Studio account.",
    button: "Research",
    searching: "Analyzing...",
    loadingDeep: "Deep Mode: Verifying citations in 250+ high-impact journals...",
    loadingFast: "Fast Mode: Optimized global scanning...",
    modeDeep: "Deep Research",
    modeFast: "Fast Scan (Lite)",
    modeDescDeep: "Extended reasoning, source verification.",
    modeDescFast: "Fast results, initial scoping.",
    uploadOwnLabel: "Attachment 1: Project/Own Research Files (Context)",
    uploadExternalLabel: "Attachment 2: External Reference Papers (Data Extraction)",
    filesSelected: "files selected",
    clearFiles: "Clear all",
    maxFilesError: "Maximum 15 files allowed.",
    loginRequired: "Please sign in to start your research."
  }
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, status, language, authState }) => {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [manualPaper, setManualPaper] = useState('');
  const [keywords, setKeywords] = useState('');
  const [personalApiKey, setPersonalApiKey] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<SearchMode>('deep');
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [externalFiles, setExternalFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const externalFileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  
  const t = translations[language];
  const isLoading = status === SearchStatus.SEARCHING;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + Math.floor(Math.random() * 3) + 1;
          if (prev < 99) return prev + 1;
          return prev;
        });
      }, 500); // Gradual build up over ~45-60s
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && authState.user) {
      onSearch(topic, mode, projectFiles, externalFiles, context, manualPaper, keywords, personalApiKey);
    }
  };

  const handleProjectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (projectFiles.length + selected.length > 15) {
        setFileError(t.maxFilesError);
      } else {
        setProjectFiles(prev => [...prev, ...selected]);
        setFileError(null);
      }
    }
  };

  const handleExternalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (externalFiles.length + selected.length > 15) {
        setFileError(t.maxFilesError);
      } else {
        setExternalFiles(prev => [...prev, ...selected]);
        setFileError(null);
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-academic-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-academic-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.125 5.754 18.75 7.5 18.75S10.832 19.125 12 19.125m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.125 18.247 18.75 16.5 18.75c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">{t.title}</h1>
        <p className="text-lg text-academic-700 font-semibold mb-2">{t.subtitle}</p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-8 font-light italic">
          {t.desc}
        </p>

        <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => setMode('deep')} className={`px-4 py-2 rounded-lg border transition-all ${mode === 'deep' ? 'bg-academic-50 border-academic-500 text-academic-700 ring-1 ring-academic-500' : 'bg-white border-gray-200 text-gray-600'}`}>
              <div className="text-sm font-semibold">{t.modeDeep}</div>
              <div className="text-[10px] opacity-75">{t.modeDescDeep}</div>
            </button>
            <button onClick={() => setMode('fast')} className={`px-4 py-2 rounded-lg border transition-all ${mode === 'fast' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 ring-1 ring-yellow-500' : 'bg-white border-gray-200 text-gray-600'}`}>
              <div className="text-sm font-semibold">{t.modeFast}</div>
              <div className="text-[10px] opacity-75">{t.modeDescFast}</div>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-6">
          <div className="relative mb-4">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
              rows={3}
              placeholder={t.placeholder}
              className="w-full pl-6 pr-32 py-4 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-academic-500 focus:border-academic-500 transition-all text-lg resize-none disabled:bg-gray-50 font-medium"
            />
            <div className="absolute right-2 bottom-3 flex gap-2">
              <button type="submit" disabled={isLoading || !topic.trim() || !authState.user} className="bg-academic-700 hover:bg-academic-800 text-white font-bold rounded-lg px-8 py-2 transition-all shadow-lg hover:shadow-academic-200/50 disabled:opacity-50 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                    {t.searching}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t.button}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button 
              type="button" 
              disabled={isLoading} 
              onClick={() => projectFileInputRef.current?.click()} 
              className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-2 group ${projectFiles.length > 0 ? 'bg-academic-50 border-academic-300' : 'bg-white border-gray-200 hover:border-academic-200'}`}
            >
              <div className={`p-2 rounded-lg ${projectFiles.length > 0 ? 'bg-academic-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-900">{t.uploadOwnLabel}</div>
                <div className="text-[10px] text-gray-500 font-bold tracking-tight mt-1 opacity-70">PDF / Word / Thesis</div>
              </div>
            </button>

            <button 
              type="button" 
              disabled={isLoading} 
              onClick={() => externalFileInputRef.current?.click()} 
              className={`p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-2 group ${externalFiles.length > 0 ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200 hover:border-purple-200'}`}
            >
              <div className={`p-2 rounded-lg ${externalFiles.length > 0 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-900">{t.uploadExternalLabel}</div>
                <div className="text-[10px] text-gray-500 font-bold tracking-tight mt-1 opacity-70">Research Papers (External)</div>
              </div>
            </button>
          </div>
          
          <div className="text-left">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-academic-600 hover:text-academic-800 font-bold flex items-center gap-1">
              {t.contextLabel} {showAdvanced ? '(-)' : '(+)'}
            </button>
            
            {showAdvanced && (
                <div className="mt-4 space-y-5 bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fadeIn shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.keywordsLabel}</label>
                      <textarea 
                        value={keywords} 
                        onChange={(e) => setKeywords(e.target.value)} 
                        placeholder={t.keywordsPlaceholder} 
                        rows={3}
                        className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-academic-500 bg-white resize-none custom-scrollbar shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.contextLabel}</label>
                      <textarea 
                        value={context} 
                        onChange={(e) => setContext(e.target.value)} 
                        placeholder={t.contextPlaceholder} 
                        rows={3}
                        className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-academic-500 bg-white resize-none custom-scrollbar shadow-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.manualPaperLabel}</label>
                    <textarea 
                      value={manualPaper} 
                      onChange={(e) => setManualPaper(e.target.value)} 
                      rows={5} 
                      placeholder={t.manualPaperPlaceholder} 
                      className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-academic-500 bg-white custom-scrollbar resize-none shadow-sm" 
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{t.apiKeyLabel}</label>
                    <div className="flex flex-col gap-2">
                       <input 
                         type="password"
                         value={personalApiKey} 
                         onChange={(e) => setPersonalApiKey(e.target.value)} 
                         placeholder={t.apiKeyPlaceholder} 
                         className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-academic-500 bg-white shadow-sm"
                       />
                       <p className="text-[10px] text-gray-400 italic">
                         {t.apiKeyNote}
                       </p>
                    </div>
                  </div>
                </div>
            )}
          </div>
          <input type="file" ref={projectFileInputRef} onChange={handleProjectFileChange} className="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" />
          <input type="file" ref={externalFileInputRef} onChange={handleExternalFileChange} className="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" />
          {!authState.user && !isLoading && (
            <div className="mt-4 p-3 bg-academic-50 text-academic-700 text-xs font-bold rounded-lg border border-academic-100 animate-pulse">
               {t.loginRequired}
            </div>
          )}
        </form>

        {(projectFiles.length > 0 || externalFiles.length > 0) && (
          <div className="max-w-3xl mx-auto space-y-2 mb-4">
            {projectFiles.length > 0 && (
              <div className="bg-academic-50 rounded-lg p-2 border border-academic-200 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-academic-600 text-white px-1.5 rounded font-black uppercase text-[8px]">Project</span>
                  <span className="font-semibold text-academic-900">{projectFiles.length} {t.filesSelected}</span>
                </div>
                <button onClick={() => setProjectFiles([])} className="text-red-500 hover:underline font-bold">{t.clearFiles}</button>
              </div>
            )}
            {externalFiles.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200 flex justify-between items-center text-xs">
                 <div className="flex items-center gap-2">
                  <span className="bg-yellow-600 text-white px-1.5 rounded font-black uppercase text-[8px]">External</span>
                  <span className="font-semibold text-yellow-900">{externalFiles.length} {t.filesSelected}</span>
                </div>
                <button onClick={() => setExternalFiles([])} className="text-red-500 hover:underline font-bold">{t.clearFiles}</button>
              </div>
            )}
          </div>
        )}
        
        {isLoading && (
          <div className="mt-8 animate-fadeIn max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-academic-700 font-bold">{mode === 'deep' ? t.loadingDeep : t.loadingFast}</p>
              <span className="text-sm font-black text-academic-600">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-academic-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-academic-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {mode === 'deep' && progress > 50 && (
              <p className="text-[10px] text-academic-500 font-bold mt-2 animate-pulse uppercase tracking-wider">
                Synthesizing Semantic Literature & Cross-referencing...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
