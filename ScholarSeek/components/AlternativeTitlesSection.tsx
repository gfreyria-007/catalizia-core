
import React from 'react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ProposedTitle, Language } from '../types';

interface AlternativeTitlesSectionProps {
  titles: ProposedTitle[];
  language: Language;
  topic: string;
}

const translations = {
  es: {
    sectionTitle: "Redefinición Estratégica: Títulos de Alto Impacto",
    sectionDesc: "Propuestas de títulos alternativos diseñados para maximizar el interés de tomadores de decisiones globales y la replicabilidad metodológica.",
    originalTitleLabel: "Título Analizado:",
    colTitle: "Propuesta de Título",
    colRationale: "Impacto & Justificación (2024+)",
    badgeGlobal: "Global",
    badgePolicy: "Política",
    badgeScalable: "Escalable",
    exportPdf: "PDF",
    exportExcel: "Excel"
  },
  en: {
    sectionTitle: "Strategic Redefinition: High-Impact Titles",
    sectionDesc: "Alternative title proposals designed to maximize global policy-maker interest and methodological replicability.",
    originalTitleLabel: "Analyzed Title:",
    colTitle: "Proposed Title",
    colRationale: "Impact & Rationale (2024+)",
    badgeGlobal: "Global",
    badgePolicy: "Policy",
    badgeScalable: "Scalable",
    exportPdf: "PDF",
    exportExcel: "Excel"
  }
};

export const AlternativeTitlesSection: React.FC<AlternativeTitlesSectionProps> = ({ titles, language, topic }) => {
  const t = translations[language];

  if (!titles || titles.length === 0) return null;

  const sanitizeFilename = (str: string) => str.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFontSize(16);
    doc.setTextColor(67, 56, 202); // indigo-700
    doc.text(t.sectionTitle, 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Topic: ${topic}`, 14, 22);
    doc.text(`${t.originalTitleLabel} ${topic}`, 14, 27, { maxWidth: 180 });

    const tableData = titles.map((item, idx) => [
      idx + 1,
      item.title[language],
      item.rationale[language]
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["#", t.colTitle, t.colRationale]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 80 },
        2: { cellWidth: 'auto' }
      }
    });

    doc.save(`alternative_titles_${sanitizeFilename(topic)}.pdf`);
  };

  const handleExportExcel = () => {
    const filename = `alternative_titles_${sanitizeFilename(topic)}.xls`;
    const rows = titles.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.title[language]}</td>
        <td>${item.rationale[language]}</td>
      </tr>
    `).join('');

    const template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"></head>
      <body>
        <table>
          <thead>
            <tr>
              <th style="background-color:#4338ca; color:#ffffff">#</th>
              <th style="background-color:#4338ca; color:#ffffff">${t.colTitle}</th>
              <th style="background-color:#4338ca; color:#ffffff">${t.colRationale}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([template], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl overflow-hidden">
        <div className="bg-indigo-700 px-8 py-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg">✍️</span>
              {t.sectionTitle}
            </h2>
            <p className="text-indigo-100 mt-2 text-sm opacity-90 max-w-3xl">
              {t.sectionDesc}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportExcel} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-xs font-bold transition-colors">
              {t.exportExcel}
            </button>
            <button onClick={handleExportPDF} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-xs font-bold transition-colors">
              {t.exportPdf}
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
             <div className="bg-slate-200 text-slate-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                {t.originalTitleLabel}
             </div>
             <p className="text-slate-700 italic font-serif text-sm">
                "{topic}"
             </p>
          </div>

          <div className="space-y-4">
            {titles.map((item, idx) => (
              <div key={idx} className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300">
                <div className="md:w-1/2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {idx + 1}
                    </span>
                    <div className="flex gap-1">
                       <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase">{t.badgeGlobal}</span>
                       <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded uppercase">{t.badgePolicy}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-serif leading-snug group-hover:text-indigo-800 transition-colors">
                    {item.title[language]}
                  </h4>
                </div>
                
                <div className="md:w-1/2 border-l border-slate-100 md:pl-6 flex items-center">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter block mb-1">
                      {t.colRationale}
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.rationale[language]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
