
import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { InvestigationOpportunity, Language, Paper } from '../types';

interface OpportunitiesSectionProps {
  opportunities: InvestigationOpportunity[];
  papers: Paper[];
  language: Language;
  topic: string;
}

const translations = {
  es: {
    title: "Oportunidades de Paper Q1 (Frontera de Complejidad)",
    subtitle: "Brechas teóricas detectadas donde el contexto de investigación sirve como entorno para validación científica.",
    colRank: "#",
    colTitle: "Título Tentativo del Paper",
    colGap: "La Brecha Científica (The Gap)",
    colNovelty: "Contribución PhD (The Novelty)",
    colContext: "Contexto de Aplicación",
    colBasedOn: "Basado en Papers",
    strategicAnalysis: "Análisis Estratégico & Generación de Conocimiento",
    viewAnalysis: "Ver Análisis Detallado",
    hideAnalysis: "Ocultar Análisis",
    userContext: "Análisis de Contexto Específico (Usuario)",
    // Groups
    groupParticipatory: "A. Procesos Participativos y Metodología de Diseño",
    groupScience: "B. Ciencia Aplicada a la Toma de Decisiones",
    groupEfficiency: "C. Eficiencia y Costo-Efectividad",
    // Questions
    q1: "1. Design Thinking (Problem ID)",
    q2: "2. Valor Colaborativo (Políticas)",
    q3: "3. Datos Cualitativos -> Roadmaps",
    q4: "4. Rol Académico (Mediador)",
    q5: "5. Eficiencia Nexo vs Sectorial",
    q6: "6. Co-Beneficios (Econ/Soc/Amb)",
    exportCsv: "CSV",
    exportPdf: "PDF",
    exportExcel: "Excel",
    exportJson: "JSON"
  },
  en: {
    title: "Q1 Paper Opportunities (Complexity Frontier)",
    subtitle: "Theoretical gaps detected where the research context serves as an environment for scientific validation.",
    colRank: "#",
    colTitle: "Tentative Paper Title",
    colGap: "The Scientific Gap",
    colNovelty: "PhD Contribution (The Novelty)",
    colContext: "Application Context",
    colBasedOn: "Based on Papers",
    strategicAnalysis: "Strategic Analysis & Knowledge Generation",
    viewAnalysis: "View Detailed Analysis",
    hideAnalysis: "Hide Analysis",
    userContext: "Specific Context Analysis (User)",
    // Groups
    groupParticipatory: "A. Participatory Processes & Design Methodology",
    groupScience: "B. Science Applied to Decision Making",
    groupEfficiency: "C. Efficiency & Cost-Effectiveness",
    // Questions
    q1: "1. Design Thinking (Problem ID)",
    q2: "2. Collaborative Value (Policies)",
    q3: "3. Qualitative Data -> Roadmaps",
    q4: "4. Academic Role (Mediator)",
    q5: "5. Nexus Efficiency vs Sectoral",
    q6: "6. Co-Benefits (Econ/Soc/Env)",
    exportCsv: "CSV",
    exportPdf: "PDF",
    exportExcel: "Excel",
    exportJson: "JSON"
  }
};

export const OpportunitiesSection: React.FC<OpportunitiesSectionProps> = ({ 
  opportunities, 
  papers, 
  language, 
  topic 
}) => {
  const t = translations[language];
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  if (opportunities.length === 0) return null;

  const toggleExpand = (rank: number) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(rank)) {
      newSet.delete(rank);
    } else {
      newSet.add(rank);
    }
    setExpandedIds(newSet);
  };

  const sanitizeFilename = (str: string) => str.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);

  const isFromFile = (title: string) => {
    return papers.some(p => p.isUploadedFile && p.title.toLowerCase().includes(title.toLowerCase()));
  };

  const handleExportJSON = () => {
    const filename = `phd_opportunities_${sanitizeFilename(topic)}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(opportunities, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportCSV = () => {
    const filename = `scholarseek_phd_ops_${sanitizeFilename(topic)}.csv`;
    const headers = [
      "Rank",
      "Tentative Title",
      "The Gap",
      "The Novelty",
      "Application Context",
      "User Context Analysis",
      "Design Thinking",
      "Collaborative Value",
      "Qualitative Data",
      "Academic Role",
      "Nexus Efficiency",
      "Co-Benefits",
      "Based on Titles"
    ];

    const rows = opportunities.map(o => [
      o.rank,
      `"${o.title[language].replace(/"/g, '""')}"`,
      `"${o.theGap[language].replace(/"/g, '""')}"`,
      `"${o.theNovelty[language].replace(/"/g, '""')}"`,
      `"${o.highValueContext[language].replace(/"/g, '""')}"`,
      `"${o.userContextAnalysis ? o.userContextAnalysis[language].replace(/"/g, '""') : ''}"`,
      `"${o.strategicAnalysis?.designThinking[language].replace(/"/g, '""') || ''}"`,
      `"${o.strategicAnalysis?.collaborativeValue[language].replace(/"/g, '""') || ''}"`,
      `"${o.strategicAnalysis?.qualitativeData[language].replace(/"/g, '""') || ''}"`,
      `"${o.strategicAnalysis?.academicRole[language].replace(/"/g, '""') || ''}"`,
      `"${o.strategicAnalysis?.nexusEfficiency[language].replace(/"/g, '""') || ''}"`,
      `"${o.strategicAnalysis?.coBenefits[language].replace(/"/g, '""') || ''}"`,
      `"${o.basedOnTitles.join('; ').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const filename = `scholarseek_phd_ops_${sanitizeFilename(topic)}.xls`;
    
    const oppRows = opportunities.map(o => `
      <tr>
        <td style="text-align:center">${o.rank}</td>
        <td style="font-weight:bold">${o.title[language]}</td>
        <td>${o.theGap[language]}</td>
        <td>${o.theNovelty[language]}</td>
        <td>${o.highValueContext[language]}</td>
        <td>${o.userContextAnalysis ? o.userContextAnalysis[language] : ''}</td>
        <td>${o.strategicAnalysis?.designThinking[language] || ''}</td>
        <td>${o.strategicAnalysis?.collaborativeValue[language] || ''}</td>
        <td>${o.strategicAnalysis?.qualitativeData[language] || ''}</td>
        <td>${o.strategicAnalysis?.academicRole[language] || ''}</td>
        <td>${o.strategicAnalysis?.nexusEfficiency[language] || ''}</td>
        <td>${o.strategicAnalysis?.coBenefits[language] || ''}</td>
        <td>${o.basedOnTitles.join('; ')}</td>
      </tr>
    `).join('');

    const template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: 'Arial', sans-serif; margin-bottom: 20px; }
          th { background-color: #ea580c; color: #ffffff; border: 1px solid #ddd; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
        </style>
      </head>
      <body>
        <h2>${t.title}</h2>
        <table>
          <thead>
            <tr>
              <th>${t.colRank}</th>
              <th>${t.colTitle}</th>
              <th>${t.colGap}</th>
              <th>${t.colNovelty}</th>
              <th>${t.colContext}</th>
              <th>${t.userContext}</th>
              <th>${t.q1}</th>
              <th>${t.q2}</th>
              <th>${t.q3}</th>
              <th>${t.q4}</th>
              <th>${t.q5}</th>
              <th>${t.q6}</th>
              <th>${t.colBasedOn}</th>
            </tr>
          </thead>
          <tbody>${oppRows}</tbody>
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

  const handleExportPDF = () => {
    const filename = `scholarseek_phd_ops_${sanitizeFilename(topic)}.pdf`;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    doc.setFontSize(16);
    doc.setTextColor(234, 88, 12); 
    doc.text(t.title, 14, 15);
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Topic: ${topic}`, 14, 22);

    let currentY = 30;

    opportunities.forEach((o, i) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175); 
      
      const titleText = `#${o.rank} ${o.title[language]}`;
      const maxWidth = 182; 
      const splitTitle = doc.splitTextToSize(titleText, maxWidth);
      
      doc.text(splitTitle, 14, currentY);
      
      const lineHeight = 5.5; 
      currentY += (splitTitle.length * lineHeight) + 2;
      
      doc.setTextColor(0);
      doc.setFont("helvetica", "normal");

      const coreData = [
        [t.colGap, t.colNovelty, t.colContext],
        [o.theGap[language], o.theNovelty[language], o.highValueContext[language]]
      ];

      autoTable(doc, {
        startY: currentY,
        head: coreData.slice(0, 1),
        body: coreData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 60 }, 2: { cellWidth: 'auto' } }
      });

      // @ts-ignore
      currentY = doc.lastAutoTable.finalY + 5;

      if (o.userContextAnalysis) {
        autoTable(doc, {
            startY: currentY,
            head: [[t.userContext]],
            body: [[o.userContextAnalysis[language]]],
            theme: 'grid',
            headStyles: { fillColor: [224, 231, 255], textColor: [30, 58, 138], fontSize: 9, fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 5;
      }

      if (o.strategicAnalysis) {
        const strategyData = [
             [t.groupParticipatory, ""],
             [t.q1, o.strategicAnalysis.designThinking[language]],
             [t.q2, o.strategicAnalysis.collaborativeValue[language]],
             [t.groupScience, ""],
             [t.q3, o.strategicAnalysis.qualitativeData[language]],
             [t.q4, o.strategicAnalysis.academicRole[language]],
             [t.groupEfficiency, ""],
             [t.q5, o.strategicAnalysis.nexusEfficiency[language]],
             [t.q6, o.strategicAnalysis.coBenefits[language]]
        ];

        autoTable(doc, {
            startY: currentY,
            body: strategyData,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
            columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold', fillColor: [249, 250, 251] }, 1: { cellWidth: 'auto' } },
            didParseCell: function (data) {
                if (data.row.raw[1] === "") {
                    data.cell.styles.fillColor = [224, 231, 255]; 
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.colSpan = 2;
                }
            }
        });

         // @ts-ignore
         currentY = doc.lastAutoTable.finalY + 15; 
      } else {
        currentY += 10;
      }
    });

    doc.save(filename);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-4">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">⚡</span> {t.title}
            </h2>
            <p className="text-gray-600 mt-1 max-w-3xl">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportJSON} className="px-3 py-2 border rounded-md text-sm bg-white border-blue-200 text-blue-700 hover:bg-blue-50 font-bold">{t.exportJson}</button>
            <button onClick={handleExportCSV} className="px-3 py-2 border rounded-md text-sm bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-50">{t.exportCsv}</button>
            <button onClick={handleExportExcel} className="px-3 py-2 border rounded-md text-sm bg-white text-green-700 border-green-200 hover:bg-green-50">{t.exportExcel}</button>
            <button onClick={handleExportPDF} className="px-3 py-2 rounded-md text-sm bg-yellow-600 text-white hover:bg-yellow-700">{t.exportPdf}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-10">
          {opportunities.map((opp, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-yellow-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-sm text-lg">
                  {opp.rank}
                </div>
                <div className="flex-grow w-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">{opp.title[language]}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <span className="text-xs font-bold text-red-800 uppercase tracking-wide block mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/></svg>
                        {t.colGap}
                      </span>
                      <p className="text-sm text-gray-800 leading-relaxed">{opp.theGap[language]}</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wide block mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>
                        {t.colNovelty}
                      </span>
                      <p className="text-sm text-gray-800 leading-relaxed">{opp.theNovelty[language]}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <span className="text-xs font-bold text-green-800 uppercase tracking-wide block mb-2 flex items-center gap-1">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        {t.colContext}
                      </span>
                      <p className="text-sm text-gray-800 leading-relaxed">{opp.highValueContext[language]}</p>
                    </div>
                  </div>

                  {opp.userContextAnalysis && (
                     <div className="mb-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-fadeIn">
                        <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide block mb-2 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            {t.userContext}
                        </span>
                        <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                            {opp.userContextAnalysis[language]}
                        </p>
                     </div>
                  )}

                  {opp.strategicAnalysis && (
                    <div className="mt-4 border-t border-gray-100 pt-3">
                        <button 
                            onClick={() => toggleExpand(opp.rank)}
                            className="flex items-center gap-2 text-sm font-bold text-academic-700 hover:text-academic-900 transition-colors"
                        >
                            <svg 
                                className={`w-4 h-4 transform transition-transform ${expandedIds.has(opp.rank) ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            {expandedIds.has(opp.rank) ? t.hideAnalysis : t.viewAnalysis}
                        </button>
                        
                        {expandedIds.has(opp.rank) && (
                            <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-fadeIn">
                                <div className="mb-4">
                                  <h4 className="text-sm font-bold text-academic-800 border-b border-academic-200 pb-1 mb-3">{t.groupParticipatory}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.q1}</p>
                                          <p className="text-sm text-slate-800">{opp.strategicAnalysis.designThinking[language]}</p>
                                      </div>
                                      <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.q2}</p>
                                          <p className="text-sm text-slate-800">{opp.strategicAnalysis.collaborativeValue[language]}</p>
                                      </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <h4 className="text-sm font-bold text-academic-800 border-b border-academic-200 pb-1 mb-3">{t.groupScience}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.q3}</p>
                                          <p className="text-sm text-slate-800">{opp.strategicAnalysis.qualitativeData[language]}</p>
                                      </div>
                                      <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.q4}</p>
                                          <p className="text-sm text-slate-800">{opp.strategicAnalysis.academicRole[language]}</p>
                                      </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-bold text-academic-800 border-b border-academic-200 pb-1 mb-3">{t.groupEfficiency}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.q5}</p>
                                          <p className="text-sm text-slate-800">{opp.strategicAnalysis.nexusEfficiency[language]}</p>
                                      </div>
                                      <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.q6}</p>
                                          <p className="text-sm text-slate-800">{opp.strategicAnalysis.coBenefits[language]}</p>
                                      </div>
                                  </div>
                                </div>
                            </div>
                        )}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100 mt-4">
                    <span className="font-semibold block mb-1 text-gray-600">{t.colBasedOn}:</span>
                    <ul className="list-disc list-inside">
                      {opp.basedOnTitles.map((title, i) => {
                        const isFile = isFromFile(title);
                        return (
                          <li key={i} className="inline mr-4 leading-loose">
                             {isFile && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                             )}
                             <span className={isFile ? "font-medium text-gray-800" : ""}>{title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
