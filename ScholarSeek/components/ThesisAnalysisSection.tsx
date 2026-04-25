import React from 'react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { StrategicAnswer, LocalizedText, Language } from '../types';

interface ThesisAnalysisSectionProps {
  answers: StrategicAnswer[];
  takeaways: LocalizedText[];
  language: Language;
  topic: string;
}

const translations = {
  es: {
    title: "Alineación Estratégica de Tesis & Análisis",
    subtitle: "Respuestas a preguntas clave de investigación basadas en la literatura encontrada.",
    category: "Categoría",
    question: "Pregunta de Investigación",
    answer: "Análisis Basado en Literatura",
    takeawaysTitle: "Conclusiones Clave / Key Takeaways",
    takeawaysSubtitle: "Hallazgos principales sintetizados.",
    exportPdf: "Exportar Análisis"
  },
  en: {
    title: "Thesis Strategic Alignment & Analysis",
    subtitle: "Answers to key research questions based on found literature.",
    category: "Category",
    question: "Research Question",
    answer: "Literature-Based Analysis",
    takeawaysTitle: "Key Takeaways",
    takeawaysSubtitle: "Synthesized main findings.",
    exportPdf: "Export Analysis"
  }
};

export const ThesisAnalysisSection: React.FC<ThesisAnalysisSectionProps> = ({ answers, takeaways, language, topic }) => {
  const t = translations[language];

  if ((!answers || answers.length === 0) && (!takeaways || takeaways.length === 0)) return null;

  const sanitizeFilename = (str: string) => str.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);

  const handleExportPDF = () => {
    const filename = `scholarseek_strategic_${sanitizeFilename(topic)}.pdf`;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    doc.setFontSize(14);
    doc.text(t.title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Topic: ${topic}`, 14, 22);

    // Q&A Table
    const tableData = answers.map(a => [
      a.category[language],
      a.question[language],
      a.answer[language]
    ]);

    autoTable(doc, {
      startY: 28,
      head: [[t.category, t.question, t.answer]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [100, 116, 139], textColor: [255, 255, 255], fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 60 },
        2: { cellWidth: 'auto' }
      }
    });

    // Takeaways
    // @ts-ignore - autoTable adds lastAutoTable property to doc
    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30;
    
    doc.setFontSize(12);
    doc.text(t.takeawaysTitle, 14, finalY);
    finalY += 6;

    const takeawayRows = takeaways.map((tk, i) => [`${i + 1}. ${tk[language]}`]);
    
    autoTable(doc, {
      startY: finalY,
      body: takeawayRows,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2, overflow: 'linebreak' },
    });

    doc.save(filename);
  };

  // Group answers by category
  const groupedAnswers: Record<string, StrategicAnswer[]> = {};
  answers.forEach(a => {
    const cat = a.category[language];
    if (!groupedAnswers[cat]) groupedAnswers[cat] = [];
    groupedAnswers[cat].push(a);
  });

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-4">
      
      {/* Strategic Q&A Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
              <span className="text-2xl">🧭</span> {t.title}
            </h2>
            <p className="text-slate-500 mt-1">{t.subtitle}</p>
          </div>
          <button onClick={handleExportPDF} className="px-4 py-2 rounded-md text-sm bg-slate-600 text-white hover:bg-slate-700 transition-colors">
            {t.exportPdf}
          </button>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedAnswers).map(([category, items], idx) => (
            <div key={idx} className="border-l-4 border-academic-300 pl-4">
              <h3 className="text-lg font-bold text-academic-800 mb-4 bg-academic-50 inline-block px-2 py-1 rounded">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {items.map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <p className="font-semibold text-slate-900 mb-2">
                      <span className="text-academic-600 mr-2">Q:</span>
                      {item.question[language]}
                    </p>
                    <div className="text-slate-700 text-sm leading-relaxed border-t border-slate-200 pt-2 mt-2">
                      <span className="font-bold text-slate-500 mr-2 block mb-1">Analysis:</span>
                      {item.answer[language]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways Section */}
      {takeaways.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-serif font-bold text-indigo-900 flex items-center gap-2">
              <span className="text-2xl">✨</span> {t.takeawaysTitle}
            </h2>
            <p className="text-indigo-500/80 text-sm">{t.takeawaysSubtitle}</p>
          </div>
          
          <ul className="space-y-3">
            {takeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-md border border-indigo-50 shadow-sm">
                <span className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {takeaway[language]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
