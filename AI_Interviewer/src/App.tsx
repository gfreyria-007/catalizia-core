import { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Persona, Message, GauntletState, Scenario } from './types';
import { sendMessageToGauntlet, generatePanelSpeech, getCoachingAdvice, getStudyAssistantResponse } from './lib/gemini';
import { SCENARIOS, STUDY_MODULES, MASTER_GLOSSARY } from './constants';
import { SelectionDictionary } from './components/SelectionDictionary';
import { generateCheatSheetHTML } from './lib/cheatSheet';
import { 
  auth, 
  db, 
  googleProvider, 
  syncUserProfile, 
  saveSession, 
  addMessageToSession 
} from './lib/firebase';
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

// New Components
import { Sidebar } from './components/Sidebar';
import { Lobby } from './components/Lobby';
import { StudyHub } from './components/StudyHub';
import { Interview } from './components/Interview';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [state, setState] = useState<GauntletState>({
    currentScore: 5,
    stressLevel: 20,
    messages: [],
    isThinking: false,
    precisionLevel: 100,
    currentScenario: null,
    passedScenarios: [],
    viewMode: 'Lobby',
  });

  const [expandedStudyModule, setExpandedStudyModule] = useState<string | null>(null);
  const [showArchitectConsole, setShowArchitectConsole] = useState(false);
  const [glossaryCategory, setGlossaryCategory] = useState<string>('ALL');
  const [showMasterGlossary, setShowMasterGlossary] = useState(false);
  const [studyMessages, setStudyMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [studyInput, setStudyInput] = useState('');
  const [isStudyThinking, setIsStudyThinking] = useState(false);
  const [showStudyAssistant, setShowStudyAssistant] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [coachingData, setCoachingData] = useState<any>(null);
  const [fontSizeScale, setFontSizeScale] = useState(1.1); // Starting at 1.1 because user said it was too small

  useEffect(() => {
    // Set both the root font size and a CSS variable for arbitrary pixel-to-rem conversions
    document.documentElement.style.fontSize = `${fontSizeScale * 100}%`;
    document.documentElement.style.setProperty('--font-scale', fontSizeScale.toString());
  }, [fontSizeScale]);
  const [isCoachingLoading, setIsCoachingLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lastAudioRequestIdRef = useRef<number>(0);

  // Safety watchdog for study assistant stuck state
  useEffect(() => {
    let watchdog: NodeJS.Timeout;
    if (isStudyThinking) {
      watchdog = setTimeout(() => {
        setIsStudyThinking(false);
      }, 20000); // 20s safety reset
    }
    return () => clearTimeout(watchdog);
  }, [isStudyThinking]);

  // Handle panel speech playback
  const playPanelVoice = async (text: string) => {
    if (isMuted) return;
    
    const requestId = ++lastAudioRequestIdRef.current;
    
    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch (e) {}
    }

    const cleanedText = text.replace(/\[Score:\s*(\d+)\s*\|\s*Reason:\s*([^\]]+)\]/, "").trim();
    const base64Audio = await generatePanelSpeech(cleanedText);
    
    if (requestId !== lastAudioRequestIdRef.current) return;
    if (!base64Audio) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }

    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
        floatData[i] = pcmData[i] / 32768.0;
    }

    const audioBuffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
    audioBuffer.getChannelData(0).set(floatData);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    
    currentAudioSourceRef.current = source;
    source.start();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await syncUserProfile(u);
        const userRef = doc(db, 'users', u.uid);
        const unsubProgress = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setState(prev => ({ ...prev, passedScenarios: data.passedScenarios || [] }));
          }
        });
        setIsAuthLoading(false);
        return () => unsubProgress();
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSendStudyMessage = async (overrideMessage?: string) => {
    if (isStudyThinking || (!overrideMessage && !studyInput.trim())) return;

    const userMessage = overrideMessage || studyInput.trim();
    setStudyMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    
    if (!overrideMessage) setStudyInput('');
    else setShowStudyAssistant(true);
    
    setIsStudyThinking(true);

    try {
      const response = await getStudyAssistantResponse(userMessage, { modules: STUDY_MODULES, glossary: MASTER_GLOSSARY });
      setStudyMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setStudyMessages(prev => [...prev, { role: 'assistant', text: "The architectural gateway is congested. Please retry your query." }]);
    } finally {
      setIsStudyThinking(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setState(prev => ({ ...prev, currentScenario: null, messages: [], viewMode: 'Lobby' }));
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const downloadCheatSheet = () => {
    const html = generateCheatSheetHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) win.focus();
  };

  const startScenario = async (scenario: Scenario) => {
    if (!user) {
      setErrorStatus("Authentication required to enter the gauntlet.");
      return;
    }

    setErrorStatus(null);
    setState(prev => ({ 
      ...prev, 
      currentScenario: scenario,
      viewMode: 'Interview',
      messages: [],
      currentScore: 5,
      stressLevel: 20,
      isThinking: true 
    }));

    try {
      const sessionId = await saveSession(user.uid, scenario.id, 'active');
      setCurrentSessionId(sessionId);

      const response = await sendMessageToGauntlet([
        { role: 'user', parts: [{ text: `I am ready for the challenge: ${scenario.title}. ${scenario.description}. Start the interview.` }] }
      ], undefined, scenario.title);
      
      const initialMessage: Message = {
        id: Date.now().toString(),
        sender: response.text.includes('JUDAH TICE') ? Persona.JUDAH : Persona.SAM,
        personaName: response.text.includes('JUDAH TICE') ? 'Judah Tice' : 'Sam Davitt',
        text: response.text,
        timestamp: Date.now(),
        score: response.score,
        reasoning: response.reason
      };

      if (sessionId) {
        await addMessageToSession(user.uid, sessionId, initialMessage);
      }

      setState(prev => ({
        ...prev,
        messages: [initialMessage],
        currentScore: response.score || 5,
      }));

      playPanelVoice(response.text);
    } catch (err) {
      console.error("Scenario Start Error:", err);
      setErrorStatus("The Gauntlet panel encountered a connection timeout. Please reset.");
    } finally {
      setState(prev => ({ ...prev, isThinking: false }));
    }
  };

  const handleSend = async (audioData?: { data: string, mimeType: string }) => {
    if ((!input.trim() && !audioData) || state.isThinking) return;
    if (!user || !currentSessionId) return;

    setErrorStatus(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'CANDIDATE',
      text: input || "[Voice Submission]",
      timestamp: Date.now(),
    };

    await addMessageToSession(user.uid, currentSessionId, userMessage);

    const history = [
      ...state.messages.map(m => ({
        role: m.sender === 'CANDIDATE' ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: input || "User responded via audio." }] }
    ];

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isThinking: true,
      precisionLevel: Math.max(0, 100 - Math.floor((input?.length || 0) / 4)),
    }));
    setInput('');
    setCoachingData(null);

    try {
      const response = await sendMessageToGauntlet(history, audioData, state.currentScenario?.title);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: response.text.includes('JUDAH TICE') ? Persona.JUDAH : Persona.SAM,
        personaName: response.text.includes('JUDAH TICE') ? 'Judah Tice' : 'Sam Davitt',
        text: response.text,
        timestamp: Date.now(),
        score: response.score,
        reasoning: response.reason
      };

      await addMessageToSession(user.uid, currentSessionId, botMessage);

      setState(prev => {
        const nextScore = response.score !== undefined ? response.score : prev.currentScore;
        let newPassed = [...prev.passedScenarios];
        
        if (nextScore >= 8.5 && prev.messages.length >= 4 && prev.currentScenario && !prev.passedScenarios.includes(prev.currentScenario.id)) {
          newPassed = [...prev.passedScenarios, prev.currentScenario.id];
          const userRef = doc(db, 'users', user.uid);
          updateDoc(userRef, { passedScenarios: newPassed }).catch(err => {
            console.error("Failed to sync progress", err);
          });
        }

        return {
          ...prev,
          messages: [...prev.messages, botMessage],
          currentScore: nextScore,
          stressLevel: Math.min(100, prev.stressLevel + (response.score && response.score < 5 ? 15 : 5)),
          passedScenarios: newPassed
        };
      });

      playPanelVoice(response.text);
    } catch (err) {
      console.error("Transmission Error:", err);
      setErrorStatus("Network latency exceeded executive tolerance. Message dropped.");
    } finally {
      setState(prev => ({ ...prev, isThinking: false }));
    }
  };

  const handleCoachingRequest = async () => {
    if (state.isThinking || isCoachingLoading) return;
    setIsCoachingLoading(true);
    
    const history = state.messages.map(m => ({
      role: m.sender === 'CANDIDATE' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const advice = await getCoachingAdvice(history);
    setCoachingData(advice);
    setIsCoachingLoading(false);
  };

  const startRecording = async () => {
    try {
      if (currentAudioSourceRef.current) {
        try { currentAudioSourceRef.current.stop(); } catch (e) {}
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          handleSend({ data: base64String, mimeType: 'audio/webm' });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access failed:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0B] text-white overflow-hidden relative font-sans">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-perficient/5 via-transparent to-blue-900/5 pointer-events-none" />
      
      <Sidebar 
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        user={user}
        isAuthLoading={isAuthLoading}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        currentScore={state.currentScore}
        stressLevel={state.stressLevel}
        precisionLevel={state.precisionLevel}
        showArchitectConsole={showArchitectConsole}
        setShowArchitectConsole={setShowArchitectConsole}
        downloadCheatSheet={downloadCheatSheet}
        setCurrentScore={(score) => setState(prev => ({ ...prev, currentScore: score }))}
        lastMessageSender={state.messages.slice(-1)[0]?.sender}
        Persona={Persona}
        fontSizeScale={fontSizeScale}
        setFontSizeScale={setFontSizeScale}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="flex-grow flex flex-col relative min-w-0 z-10">
        <AnimatePresence>
          {errorStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-red-500 text-white text-[0.625rem] font-bold uppercase tracking-widest rounded-lg shadow-2xl flex items-center gap-3 border border-red-400/50"
            >
              <ShieldAlert className="w-4 h-4" />
              {errorStatus}
              <button onClick={() => setErrorStatus(null)} className="ml-4 hover:text-white/60">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {state.viewMode === 'Lobby' && (
            <Lobby 
              key="lobby"
              viewMode={state.viewMode}
              setViewMode={(mode) => setState(prev => ({ ...prev, viewMode: mode }))}
              scenarios={SCENARIOS}
              passedScenarios={state.passedScenarios}
              startScenario={startScenario}
            />
          )}

          {state.viewMode === 'Study' && (
            <StudyHub 
              key="study"
              setViewMode={(mode) => setState(prev => ({ ...prev, viewMode: mode }))}
              showStudyAssistant={showStudyAssistant}
              setShowStudyAssistant={setShowStudyAssistant}
              downloadCheatSheet={downloadCheatSheet}
              showMasterGlossary={showMasterGlossary}
              setShowMasterGlossary={setShowMasterGlossary}
              glossaryCategory={glossaryCategory}
              setGlossaryCategory={setGlossaryCategory}
              masterGlossary={MASTER_GLOSSARY}
              studyModules={STUDY_MODULES}
              expandedStudyModule={expandedStudyModule}
              setExpandedStudyModule={setExpandedStudyModule}
              studyMessages={studyMessages}
              studyInput={studyInput}
              setStudyInput={setStudyInput}
              isStudyThinking={isStudyThinking}
              handleSendStudyMessage={handleSendStudyMessage}
            />
          )}

          {state.viewMode === 'Interview' && state.currentScenario && (
            <Interview 
              key="interview"
              scenario={state.currentScenario}
              messages={state.messages}
              isThinking={state.isThinking}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              errorStatus={errorStatus}
              setViewMode={(mode) => setState(prev => ({ ...prev, viewMode: mode }))}
              handleCoachingRequest={handleCoachingRequest}
              coachingData={coachingData}
              isCoachingLoading={isCoachingLoading}
              setCoachingData={setCoachingData}
              currentScore={state.currentScore}
            />
          )}
        </AnimatePresence>
      </main>

      <SelectionDictionary onAskAssistant={handleSendStudyMessage} />
    </div>
  );
}

