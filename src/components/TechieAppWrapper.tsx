import React from 'react';
import { useAuth } from '../core/AuthContext';
import { canUseService } from '../core/SubscriptionGuard';
import AppLoader from './AppLoader';

const TechieAppWrapper: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-4 text-center">Necesitas iniciar sesión para usar Techie.</div>;
  }

  const { allowed, reason } = canUseService(profile);

  if (!allowed) {
    return (
      <div className="p-6 bg-white/5 backdrop-blur-xl rounded-xl text-center">
        <p className="text-red-400 mb-4">{reason || 'Acceso restringido'}</p>
        <button
          onClick={() => {
            alert('Redirigir al flujo de suscripción para Techie');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition"
        >
          Actualizar suscripción
        </button>
      </div>
    );
  }

  // Use the common AppLoader which handles the subdomain and SSO token
  return <AppLoader appName="Techie Tutor" />;
};

export default TechieAppWrapper;
