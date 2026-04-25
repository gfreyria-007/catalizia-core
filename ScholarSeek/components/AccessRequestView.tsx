
import React, { useState } from 'react';
import { requestAccess, UserStatus } from '../services/userService';
import { Language } from '../types';

interface AccessRequestViewProps {
  uid: string;
  status: UserStatus;
  language: Language;
}

export const AccessRequestView: React.FC<AccessRequestViewProps> = ({ uid, status, language }) => {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.length < 10) return;
    await requestAccess(uid, reason);
    setSubmitted(true);
  };

  const t = {
    es: {
      title: "Solicitar Acceso a ScholarSeek",
      desc: "ScholarSeek es una plataforma de élite para investigación doctoral. El acceso está restringido a investigadores verificados.",
      placeholder: "Describe brevemente tu área de investigación y por qué necesitas acceso...",
      button: "Enviar Solicitud",
      pending: "Tu solicitud está siendo revisada",
      pendingDesc: "Un administrador revisará tu perfil en las próximas 24-48 horas. Recibirás acceso automáticamente una vez aprobado.",
      banned: "Acceso Denegado",
      bannedDesc: "Tu cuenta ha sido restringida. Si crees que esto es un error, contacta al administrador.",
      minChar: "Mínimo 10 caracteres."
    },
    en: {
      title: "Request Access to ScholarSeek",
      desc: "ScholarSeek is an elite platform for doctoral research. Access is restricted to verified researchers.",
      placeholder: "Briefly describe your research area and why you need access...",
      button: "Submit Request",
      pending: "Your request is under review",
      pendingDesc: "An administrator will review your profile within 24-48 hours. You will gain access automatically once approved.",
      banned: "Access Denied",
      bannedDesc: "Your account has been restricted. If you believe this is an error, please contact the administrator.",
      minChar: "Minimum 10 characters."
    }
  }[language];

  if (status === 'banned') {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-red-50 border border-red-200 rounded-2xl text-center">
        <div className="text-4xl mb-4">🚫</div>
        <h2 className="text-2xl font-serif font-bold text-red-800">{t.banned}</h2>
        <p className="text-red-600 mt-2">{t.bannedDesc}</p>
      </div>
    );
  }

  if (status === 'pending' || submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 bg-white shadow-2xl rounded-3xl text-center border border-blue-50">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">{t.pending}</h2>
        <p className="text-gray-500 mt-4 leading-relaxed">{t.pendingDesc}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
      <div className="bg-academic-700 p-8 text-white text-center">
        <h2 className="text-2xl font-serif font-bold">{t.title}</h2>
        <p className="text-blue-100 text-sm mt-2">{t.desc}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          {t.placeholder}
        </label>
        <textarea 
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-academic-600 focus:outline-none transition-all text-sm"
          placeholder="..."
        />
        {reason.length > 0 && reason.length < 10 && (
          <p className="text-red-500 text-[10px] mt-1 font-bold">{t.minChar}</p>
        )}
        
        <button 
          type="submit"
          disabled={reason.length < 10}
          className="w-full mt-6 bg-academic-700 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-academic-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {t.button}
        </button>
      </form>
    </div>
  );
};
