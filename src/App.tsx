import React from 'react';
import { AuthProvider, useAuth } from './core/AuthContext';
import { auth, signOut } from './firebase';
import AppLoader from './components/AppLoader';

const HubDashboard = () => {
  const [selectedApp, setSelectedApp] = React.useState<string | null>(null);
  const { profile, loading, user, loginWithGoogle } = useAuth();

  if (loading) return (
    <div style={{ height: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <p>Cargando Catalizia...</p>
    </div>
  );

  if (!user) return (
    <div style={{ height: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => loginWithGoogle()}
        style={{ 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '15px 30px', 
          borderRadius: '30px', 
          border: 'none', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)'
        }}
      >
        ENTRAR A CATALIZIA
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      {selectedApp ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#0F172A' }}>
           <button 
             onClick={() => setSelectedApp(null)} 
             style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 110, padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', cursor: 'pointer' }}
           >
             ← Volver al Hub
           </button>
           <AppLoader appName={selectedApp} />
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>CATALIZIA <span style={{ color: '#3b82f6' }}>HUB</span></h1>
            <button onClick={() => signOut(auth)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Salir</button>
          </header>

          <section>
            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '10px' }}>¡Hola, {profile?.name || user.displayName}!</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Selecciona una aplicación para comenzar.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {['Techie Tutor'].map(app => (
                <div 
                  key={app} 
                  onClick={() => setSelectedApp(app)} 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    padding: '30px', 
                    borderRadius: '24px', 
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{app}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
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
