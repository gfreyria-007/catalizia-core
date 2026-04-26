
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { HeroSection } from './components/HeroSection';
import { ResultsTable } from './components/ResultsTable';
import { OpportunitiesSection } from './components/OpportunitiesSection';
import { AlternativeTitlesSection } from './components/AlternativeTitlesSection';
import { JournalDirectory } from './components/JournalDirectory';
import { AdminDashboard } from './components/AdminDashboard';
import { AccessRequestView } from './components/AccessRequestView';
import { fetchLiteratureReview } from './services/geminiService';
import { auth, signInWithGoogle, logout } from './services/firebase';
import { syncUserRecord, UserRecord } from './services/userService';
import { Language, SearchState, SearchStatus, SearchMode, LiteratureReviewResponse, UserState, AuthUser } from './types';

const ADMIN_EMAILS = ['gfreyria@gmail.com', 'gabsvpn@gmail.com'];

const translations = {
  es: {
    features: {
      structured: { title: "Datos Estructurados", desc: "Tablas formateadas con Keywords, Citación y Enfoque." },
      sources: { title: "Contexto Personalizado", desc: "Análisis específico basado en su propio marco de investigación." },
      relevance: { title: "Oportunidades de Paper", desc: "Brechas científicas detectadas para nuevas publicaciones." }
    },
    error: "Error al buscar publicaciones. Por favor verificate su conexión o proporcione su propia API Key si los créditos se agotaron.",
    noData: "No se encontraron papers que coincidan con los criterios específicos. Intente ampliar su tema.",
    footer: "© " + new Date().getFullYear() + " ScholarSeek. Inteligencia Artificial para Investigación Doctoral de Élite.",
    importJson: "Importar JSON",
    exportFullJson: "Exportar Informe Completo (JSON)",
    tabAnalysis: "Análisis de Investigación",
    tabDirectory: "Directorio de Acceso a Journals",
    tabAdmin: "Administración",
    importSuccess: "Informe cargado correctamente.",
    logout: "Cerrar Sesión",
    login: "Iniciar Sesión con Google",
    adminBadge: "Administrador"
  },
  en: {
    features: {
      structured: { title: "Structured Data", desc: "Formatted tables with Keywords, Citation, and Research Approach." },
      sources: { title: "Custom Context", desc: "Specific analysis tailored to your own research framework." },
      relevance: { title: "Research Opportunities", desc: "Detected scientific gaps for new paper submissions." }
    },
    error: "Failed to fetch research papers. Please check your connection or provide your own API Key if credits are exhausted.",
    noData: "No papers found matching specific criteria. Try broadening your topic.",
    footer: "© " + new Date().getFullYear() + " ScholarSeek. AI-Powered Elite Doctoral Research Assistant.",
    importJson: "Import JSON",
    exportFullJson: "Export Full Report (JSON)",
    tabAnalysis: "Research Analysis",
    tabDirectory: "Journal Access Directory",
    tabAdmin: "Administration",
    importSuccess: "Report loaded successfully.",
    login: "Sign In with Google",
    logout: "Sign Out",
    adminBadge: "Administrator"
  }
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en'); 
  const [authState, setAuthState] = useState<UserState>({ user: null, isLoading: true });
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    status: SearchStatus.IDLE,
    data: { papers: [], opportunities: [], proposedTitles: [] },
  });
  const [activeTab, setActiveTab] = useState<'analysis' | 'directory' | 'admin'>('analysis');
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [textSizePercent, setTextSizePercent] = useState(100);
  const [lastSearchArgs, setLastSearchArgs] = useState<any>(null);
  const [offset, setOffset] = useState<number>(0);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const record = await syncUserRecord(user);
          setUserRecord(record);
          setAuthState({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isAdmin: record.isAdmin || false,
            },
            isLoading: false,
          });
        } catch (error) {
          console.error("Error syncing user record:", error);
          setAuthState({ user: null, isLoading: false });
        }
      } else {
        setUserRecord(null);
        setAuthState({ user: null, isLoading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textSizePercent}%`;
    return () => {
      document.documentElement.style.fontSize = '100%';
    };
  }, [textSizePercent]);

  const handleTextSize = (delta: number) => {
    setTextSizePercent(prev => {
      const newSize = prev + delta;
      return Math.min(Math.max(newSize, 80), 130);
    });
  };

  const handleSearch = async (
    topic: string, 
    mode: SearchMode, 
    projectFiles: File[], 
    externalFiles: File[],
    context: string, 
    manualPaper: string, 
    keywords: string, 
    personalApiKey?: string
  ) => {
    setSearchState({ status: SearchStatus.SEARCHING, data: { papers: [], opportunities: [], proposedTitles: [] } });
    setCurrentTopic(topic);
    setLastSearchArgs({ topic, mode, projectFiles, externalFiles, context, manualPaper, keywords, personalApiKey });
    setOffset(0);
    
    try {
      const result = await fetchLiteratureReview(
        topic, 
        language, 
        mode, 
        projectFiles, 
        externalFiles,
        context, 
        manualPaper, 
        keywords, 
        personalApiKey,
        0
      );
      setSearchState({
        status: SearchStatus.COMPLETED,
        data: result,
      });
    } catch (error) {
      setSearchState({
        status: SearchStatus.ERROR,
        data: { papers: [], opportunities: [], proposedTitles: [] },
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const handleLoadMore = async () => {
    if (!lastSearchArgs) return;
    const newOffset = offset + 20;
    setOffset(newOffset);
    setSearchState(prev => ({ ...prev, status: SearchStatus.SEARCHING }));
    try {
      const result = await fetchLiteratureReview(
        lastSearchArgs.topic, 
        language, 
        lastSearchArgs.mode, 
        lastSearchArgs.projectFiles, 
        lastSearchArgs.externalFiles,
        lastSearchArgs.context, 
        lastSearchArgs.manualPaper, 
        lastSearchArgs.keywords, 
        lastSearchArgs.personalApiKey,
        newOffset
      );
      setSearchState(prev => ({
        status: SearchStatus.COMPLETED,
        data: {
          papers: [...(prev.data?.papers || []), ...(result.papers || [])],
          opportunities: result.opportunities?.length ? result.opportunities : prev.data?.opportunities || [],
          proposedTitles: result.proposedTitles?.length ? result.proposedTitles : prev.data?.proposedTitles || [],
        },
      }));
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        status: SearchStatus.ERROR,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.isFullState) {
          setSearchState({
            status: SearchStatus.COMPLETED,
            data: json.data
          });
          setCurrentTopic(json.currentTopic || "Imported Report");
          setOffset(json.offset || 0);
          if (json.lastSearchArgs) {
             setLastSearchArgs({
                ...json.lastSearchArgs,
                projectFiles: [], // Omitted from serialization
                externalFiles: [] // Omitted from serialization
             });
          }
        } else {
          setSearchState({
            status: SearchStatus.COMPLETED,
            data: json as LiteratureReviewResponse
          });
          setCurrentTopic(json.papers?.[0]?.title || "Imported Report");
        }
        alert(t.importSuccess);
      } catch (err) {
        alert("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportFullJson = () => {
    const filename = `scholarseek_session_${new Date().getTime()}.json`;
    
    const cleanArgs = lastSearchArgs ? {
      topic: lastSearchArgs.topic,
      mode: lastSearchArgs.mode,
      context: lastSearchArgs.context,
      manualPaper: lastSearchArgs.manualPaper,
      keywords: lastSearchArgs.keywords,
      personalApiKey: lastSearchArgs.personalApiKey
    } : null;

    const payload = {
      isFullState: true,
      currentTopic,
      offset,
      lastSearchArgs: cleanArgs,
      data: searchState.data
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="bg-academic-700 text-white p-1.5 rounded flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 4.168 6.253v13C4.168 19.125 5.754 18.75 7.5 18.75S10.832 19.125 12 19.125m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.125 18.247 18.75 16.5 18.75c-1.746 0-3.332.477-4.5 1.253" />
                   </svg>
                </div>
                <span className="font-serif font-bold text-xl text-gray-900 tracking-tight">ScholarSeek</span>
             </div>
             {authState.user?.isAdmin && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                  {t.adminBadge}
                </span>
             )}
          </div>
          
          {authState.user && (
            <div className="hidden lg:flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'analysis' ? 'bg-white text-academic-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t.tabAnalysis}
              </button>
              <button 
                onClick={() => setActiveTab('directory')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'directory' ? 'bg-white text-academic-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t.tabDirectory}
              </button>
              {authState.user?.isAdmin && (
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'admin' ? 'bg-white text-academic-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t.tabAdmin}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={jsonInputRef} 
              onChange={handleImportJson} 
              className="hidden" 
              accept=".json"
            />
            <button 
              onClick={() => jsonInputRef.current?.click()}
              className="hidden md:flex items-center gap-2 bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t.importJson}
            </button>

            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
              <button 
                onClick={() => handleTextSize(-5)} 
                disabled={textSizePercent <= 80}
                className="px-2 py-1 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-r border-gray-200 disabled:opacity-30 transition-colors"
              >
                <span className="text-[10px] font-bold">A-</span>
              </button>
              <button 
                onClick={() => handleTextSize(5)} 
                disabled={textSizePercent >= 130}
                className="px-2 py-1 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <span className="text-xs font-bold">A+</span>
              </button>
            </div>

            <button 
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              {language === 'es' ? 'English' : 'Español'}
            </button>

            {authState.isLoading ? (
              <div className="h-8 w-8 rounded-full border-2 border-academic-100 border-t-academic-600 animate-spin"></div>
            ) : authState.user ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-[10px] font-bold text-gray-900 leading-none">{authState.user.displayName}</span>
                  <button onClick={logout} className="text-[9px] text-academic-600 hover:underline font-bold mt-1 uppercase tracking-tight">
                    {t.logout}
                  </button>
                </div>
                <img src={authState.user.photoURL || ''} alt="" className="h-8 w-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                <button onClick={logout} className="md:hidden text-gray-500">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                   </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-academic-700 text-white px-4 py-1.5 rounded-md text-xs font-bold shadow-md hover:bg-academic-800 transition-colors ml-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t.login}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {!authState.user ? (
          <>
            <HeroSection onSearch={handleSearch} status={searchState.status} language={language} authState={authState} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                  icon="📊" 
                  title={t.features.structured.title}
                  desc={t.features.structured.desc}
                />
                <FeatureCard 
                  icon="🏛️" 
                  title={t.features.sources.title}
                  desc={t.features.sources.desc}
                />
                <FeatureCard 
                  icon="💡" 
                  title={t.features.relevance.title}
                  desc={t.features.relevance.desc}
                />
              </div>
            </div>
          </>
        ) : userRecord && userRecord.status !== 'approved' ? (
          <AccessRequestView uid={userRecord.uid} status={userRecord.status} language={language} />
        ) : activeTab === 'admin' && authState.user?.isAdmin ? (
          <AdminDashboard language={language} />
        ) : activeTab === 'directory' ? (
          <JournalDirectory language={language} />
        ) : (
          <>
            <HeroSection onSearch={handleSearch} status={searchState.status} language={language} authState={authState} />
            
            {searchState.status === SearchStatus.ERROR && (
               <div className="max-w-3xl mx-auto mt-10 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {searchState.error || t.error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {searchState.status === SearchStatus.COMPLETED && searchState.data.papers.length === 0 && (
              <div className="max-w-3xl mx-auto mt-12 text-center text-gray-500">
                <p className="text-lg">{t.noData}</p>
              </div>
            )}

            {searchState.status === SearchStatus.COMPLETED && searchState.data.papers.length > 0 && (
               <>
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-end">
                    <button 
                      onClick={handleExportFullJson}
                      className="bg-academic-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-academic-800 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t.exportFullJson}
                    </button>
                 </div>

                 <ResultsTable papers={searchState.data.papers} language={language} topic={currentTopic} />
                 
                 <div className="flex justify-center mt-6">
                   <button 
                     onClick={handleLoadMore}
                     className="px-8 py-3 bg-academic-100 hover:bg-academic-200 text-academic-700 font-bold rounded-lg transition-all shadow-sm flex items-center gap-2 border border-academic-300"
                   >
                     <span>Load Next 20 Papers</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                   </button>
                 </div>
                 
                 <AlternativeTitlesSection 
                    titles={searchState.data.proposedTitles} 
                    language={language} 
                    topic={currentTopic}
                 />

                 <OpportunitiesSection 
                    opportunities={searchState.data.opportunities} 
                    papers={searchState.data.papers}
                    language={language} 
                    topic={currentTopic} 
                 />
               </>
            )}
            
            {searchState.status === SearchStatus.IDLE && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon="📊" 
                    title={t.features.structured.title}
                    desc={t.features.structured.desc}
                  />
                  <FeatureCard 
                    icon="🏛️" 
                    title={t.features.sources.title}
                    desc={t.features.sources.desc}
                  />
                  <FeatureCard 
                    icon="💡" 
                    title={t.features.relevance.title}
                    desc={t.features.relevance.desc}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
  </div>
);
