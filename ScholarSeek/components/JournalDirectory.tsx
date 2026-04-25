
import React from 'react';
import { Language } from '../types';

interface JournalInfo {
  name: string;
  accessType: 'open' | 'hybrid' | 'subscription';
  description: {
    en: string;
    es: string;
  };
  apiAvailable: boolean;
}

const JOURNALS: JournalInfo[] = [
  {
    name: "Semantic Scholar / Crossref",
    accessType: 'open',
    description: {
      en: "Core API engine for ScholarSeek. Provides verified metadata, DOIs, and citation counts for millions of papers.",
      es: "Motor API central de ScholarSeek. Proporciona metadatos verificados, DOIs y recuentos de citas para millones de papers."
    },
    apiAvailable: true
  },
  {
    name: "Nature Communications",
    accessType: 'open',
    description: {
      en: "High-quality multidisciplinary open access research.",
      es: "Investigación multidisciplinaria de acceso abierto y alta calidad."
    },
    apiAvailable: true
  },
  {
    name: "Science Advances",
    accessType: 'open',
    description: {
      en: "Open access expansion of the Science family journals.",
      es: "Expansión de acceso abierto de la familia de revistas Science."
    },
    apiAvailable: true
  },
  {
    name: "Sustainability (MDPI)",
    accessType: 'open',
    description: {
      en: "Gold Open Access journal on environmental and social sustainability.",
      es: "Revista Gold Open Access sobre sostenibilidad ambiental y social."
    },
    apiAvailable: true
  },
  {
    name: "ICML / NeurIPS Proceedings",
    accessType: 'open',
    description: {
      en: "Premier open-access proceedings for ML and AI research.",
      es: "Actas de acceso abierto líderes para investigación en ML e IA."
    },
    apiAvailable: true
  },
  {
    name: "PNAS",
    accessType: 'hybrid',
    description: {
      en: "Accessible after 6 months; immediate access via institutional login.",
      es: "Accesible después de 6 meses; acceso inmediato mediante login institucional."
    },
    apiAvailable: true
  },
  {
    name: "Nature / Science (Flagships)",
    accessType: 'hybrid',
    description: {
      en: "Subscription based; selected high-impact articles are open access.",
      es: "Basado en suscripción; artículos seleccionados de alto impacto son OA."
    },
    apiAvailable: true
  },
  {
    name: "The Lancet / BMJ",
    accessType: 'hybrid',
    description: {
      en: "Medical research often made free for public interest/policy.",
      es: "Investigación médica a menudo gratuita por interés público/políticas."
    },
    apiAvailable: true
  },
  {
    name: "IEEE TPAMI",
    accessType: 'hybrid',
    description: {
      en: "Specialized engineering journal; requires institutional API for full text.",
      es: "Revista de ingeniería especializada; requiere API institucional para texto completo."
    },
    apiAvailable: true
  },
  {
    name: "AER / HBR",
    accessType: 'subscription',
    description: {
      en: "Business and Economics journals; strictly limited without subscription.",
      es: "Revistas de Negocios y Economía; acceso estrictamente limitado sin suscripción."
    },
    apiAvailable: false
  }
];

interface JournalDirectoryProps {
  language: Language;
}

export const JournalDirectory: React.FC<JournalDirectoryProps> = ({ language }) => {
  const t = {
    es: {
      title: "Directorio de Acceso a Journals",
      subtitle: "Transparencia sobre la disponibilidad de fuentes para su investigación.",
      typeLabel: "Tipo de Acceso",
      apiLabel: "Integrable vía API",
      statusOpen: "Abierto (Libre)",
      statusHybrid: "Híbrido / Demorado",
      statusSub: "Suscripción / Limitado",
      apiNote: "Nota: ScholarSeek utiliza Grounding de Google Search para verificar estos papers, pero el acceso al PDF completo puede depender de las credenciales de su institución."
    },
    en: {
      title: "Journal Access Directory",
      subtitle: "Transparency regarding source availability for your research.",
      typeLabel: "Access Type",
      apiLabel: "API Integrable",
      statusOpen: "Open (Free)",
      statusHybrid: "Hybrid / Delayed",
      statusSub: "Subscription / Limited",
      apiNote: "Note: ScholarSeek uses Google Search Grounding to verify these papers, but full-text PDF access may depend on your institution's credentials."
    }
  }[language];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'hybrid': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'subscription': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case 'open': return t.statusOpen;
      case 'hybrid': return t.statusHybrid;
      case 'subscription': return t.statusSub;
      default: return type;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{t.title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {JOURNALS.map((journal, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{journal.name}</h3>
                <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${getStatusColor(journal.accessType)}`}>
                  {getStatusText(journal.accessType)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {journal.description[language]}
              </p>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
              <div className={`h-2 w-2 rounded-full ${journal.apiAvailable ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.apiLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-academic-50 rounded-xl border border-academic-100 italic text-sm text-academic-700 text-center">
        {t.apiNote}
      </div>
    </div>
  );
};
