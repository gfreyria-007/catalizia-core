import React from 'react';
import { AuthProvider, useAuth } from './core/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Zap, Award, Settings, LogOut } from 'lucide-react';
import { auth, signOut } from './firebase';
// Removed direct app wrapper import; apps are launched as independent micro‑frontends
import AppLoader from './components/AppLoader';

const HubDashboard = () => {
  const [selectedApp, setSelectedApp] = React.useState<string | null>(null);
  const { profile, loading, user } = useAuth();

  if (loading) return (
    <div className="h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );

  if (!user) return (
    <div className="h-screen bg-slate-900 flex items-center justify-center">
      <button 
        onClick={() => { /* Implement Login */ }}
        className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-blue-500 transition-all"
      >
        Entrar a Catalizia
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">C</div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Catalizia <span className="text-blue-500">Hub</span></h1>
        </div>
        <button onClick={() => signOut(auth)} className="p-3 hover:bg-white/10 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col sm:flex-row items-center gap-8"
        >
          <img src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Catalizia"} className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-500/30" />
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-black mb-2">{profile?.name || user.displayName}</h2>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <span className="px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/30 flex items-center gap-2">
                <Shield size={12} /> {profile?.subscriptionLevel || 'Free'}
              </span>
              <span className="px-4 py-1.5 bg-amber-600/20 text-amber-400 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/30 flex items-center gap-2">
                <Zap size={12} /> {profile?.dailyUsageCount} / {profile?.tokensPerDay} Tokens
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6">
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400"><Award /></div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Medallas Totales</p>
                <p className="text-2xl font-black">{profile?.badges?.length || 0}</p>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400"><Settings /></div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Proyectos Guardados</p>
                <p className="text-2xl font-black">{profile?.projects?.length || 0}</p>
              </div>
           </div>
        </div>
      </main>

      {selectedApp ? (
        <div className="p-4">
          <AppLoader appName={selectedApp!} />
          {/* Future app components can be added here */}
          <button onClick={() => setSelectedApp(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Back to Hub</button>
        </div>
      ) : (
        <section className="max-w-6xl mx-auto mt-12">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em] mb-6">Tus Apps Autorizadas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           {['Techie Tutor', 'Arcade 2099', 'ScholarSeek', 'BioBrain'].map(app => (
             <div key={app} onClick={() => setSelectedApp(app)} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-slate-800 rounded-xl mb-4 group-hover:scale-110 transition-transform"></div>
                <p className="text-xs font-bold uppercase tracking-tight">{app}</p>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <HubDashboard />
    </AuthProvider>
  );
}

export default App;
