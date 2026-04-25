
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useEffect, useState } from 'react';
import { Language, Paper } from '../types';

interface ResultsTableProps {
  papers: Paper[];
  language: Language;
  topic: string;
}

const translations = {
  es: {
    title: "Revisión de Literatura & Análisis de Contexto",
    colRank: "#",
    colRelevance: "Relevance%",
    colStatus: "Status",
    colKeyAreas: "Key areas",
    colTitle: "Title",
    colAuthors: "Authors",
    colYear: "Year of publication",
    colJournal: "Journal",
    colAccess: "Acceso, Link or DOI",
    colMainIdea: "Main idea",
    colContextRelevance: "Relevancia con el Contexto de Investigación",
    colStrategicQuotes: "Citas Estratégicas y Alineación (2024+)",
    colApa: "Cita APA",
    copy: "Copiar",
    copied: "¡Copiado!",
    exportCsv: "CSV",
    exportPdf: "PDF",
    exportExcel: "Excel",
    exportJson: "JSON",
    uploadedFile: "Archivo",
    manualEntry: "Manual",
    searchEntry: "Busca",
    verifiedSource: "Verificado",
    goSource: "Ir"
  },
  en: {
    title: "Literature Review & Context Analysis",
    colRank: "#",
    colRelevance: "Relevance%",
    colStatus: "Status",
    colKeyAreas: "Key areas",
    colTitle: "Title",
    colAuthors: "Authors",
    colYear: "Year of publication",
    colJournal: "Journal",
    colAccess: "Acceso, Link or DOI",
    colMainIdea: "Main idea",
    colContextRelevance: "Relevance to Research Context",
    colStrategicQuotes: "Strategic Quotes & Policy Alignment (2024+)",
    colApa: "APA citation",
    copy: "Copy",
    copied: "Copied!",
    exportCsv: "CSV",
    exportPdf: "PDF",
    exportExcel: "Excel",
    exportJson: "JSON",
    uploadedFile: "File",
    manualEntry: "Manual",
    searchEntry: "Search",
    verifiedSource: "Verified",
    goSource: "Go"
  }
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ papers, language, topic }) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const t = translations[language];

  useEffect(() => { setSelectedIndices(new Set()); }, [papers]);

  if (papers.length === 0) return null;

  const sanitizeFilename = (str: string) => str.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);

  const getStatusText = (p: Paper) => {
    if (p.isManualEntry) return t.manualEntry;
    if (p.isUploadedFile) return t.uploadedFile;
    return t.searchEntry;
  };

  const handleExportJSON = () => {
    const filename = `papers_${sanitizeFilename(topic)}.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(papers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportCSV = () => {
    const filename = `scholarseek_papers_${sanitizeFilename(topic)}.csv`;
    const headers = [
      t.colRank,
      t.colRelevance,
      t.colStatus,
      t.colKeyAreas,
      t.colTitle,
      t.colAuthors,
      t.colYear,
      t.colJournal,
      t.colAccess,
      t.colMainIdea,
      t.colContextRelevance,
      t.colStrategicQuotes,
      t.colApa
    ];

    const rows = papers.map(p => [
      p.rank,
      `${p.relevanceScore}%`,
      getStatusText(p),
      `"${(p.keyAreas || []).join(', ').replace(/"/g, '""')}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.authors.replace(/"/g, '""')}"`,
      p.year,
      `"${p.journal.replace(/"/g, '""')}"`,
      p.url,
      `"${p.mainIdea[language].replace(/"/g, '""')}"`,
      `"${p.contextRelevance[language].replace(/"/g, '""')}"`,
      `"${(p.strategicQuotes?.[language] || "").replace(/"/g, '""')}"`,
      `"${p.apaCitation.replace(/"/g, '""')}"`
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
    const filename = `scholarseek_papers_${sanitizeFilename(topic)}.xls`;
    const rows = papers.map(p => `
      <tr>
        <td>${p.rank}</td>
        <td>${p.relevanceScore}%</td>
        <td>${getStatusText(p)}</td>
        <td>${(p.keyAreas || []).join(', ')}</td>
        <td style="font-weight:bold">${p.title}</td>
        <td>${p.authors}</td>
        <td>${p.year}</td>
        <td>${p.journal}</td>
        <td>${p.url}</td>
        <td>${p.mainIdea[language]}</td>
        <td>${p.contextRelevance[language]}</td>
        <td>${p.strategicQuotes?.[language] || ""}</td>
        <td>${p.apaCitation}</td>
      </tr>
    `).join('');

    const template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: 'Arial', sans-serif; }
          th { background-color: #254877; color: #ffffff; border: 1px solid #ddd; padding: 5px; text-align: left; }
          td { border: 1px solid #ddd; padding: 5px; vertical-align: top; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>${t.colRank}</th>
              <th>${t.colRelevance}</th>
              <th>${t.colStatus}</th>
              <th>${t.colKeyAreas}</th>
              <th>${t.colTitle}</th>
              <th>${t.colAuthors}</th>
              <th>${t.colYear}</th>
              <th>${t.colJournal}</th>
              <th>${t.colAccess}</th>
              <th>${t.colMainIdea}</th>
              <th>${t.colContextRelevance}</th>
              <th>${t.colStrategicQuotes}</th>
              <th>${t.colApa}</th>
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

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a1' }); // Use larger format for 13 columns
    doc.setFontSize(16); doc.text(t.title, 14, 15);
    doc.setFontSize(11); doc.text(`Topic: ${topic}`, 14, 22);
    
    const tableData = papers.map(p => [
      p.rank,
      `${p.relevanceScore}%`,
      getStatusText(p),
      (p.keyAreas || []).join(', '),
      p.title,
      p.authors,
      p.year,
      p.journal,
      p.url,
      p.mainIdea[language],
      p.contextRelevance[language],
      p.strategicQuotes?.[language] || "",
      p.apaCitation
    ]);

    autoTable(doc, {
      startY: 28,
      head: [[
        t.colRank, 
        t.colRelevance, 
        t.colStatus, 
        t.colKeyAreas, 
        t.colTitle, 
        t.colAuthors, 
        t.colYear, 
        t.colJournal, 
        t.colAccess, 
        t.colMainIdea, 
        t.colContextRelevance, 
        t.colStrategicQuotes,
        t.colApa
      ]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [45, 90, 148], fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: {
        4: { cellWidth: 50 }, // Title
        5: { cellWidth: 30 }, // Authors
        9: { cellWidth: 50 }, // Main Idea
        10: { cellWidth: 50 }, // Relevance
        11: { cellWidth: 50 }, // Strategic Quotes
        12: { cellWidth: 40 }  // APA
      }
    });
    doc.save(`scholarseek_papers_${sanitizeFilename(topic)}.pdf`);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">{t.title}</h2>
        <div className="flex gap-2">
          <button onClick={handleExportJSON} className="px-3 py-2 border rounded-md text-sm bg-white border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors font-bold">{t.exportJson}</button>
          <button onClick={handleExportCSV} className="px-3 py-2 border rounded-md text-sm bg-white border-academic-200 text-academic-700 hover:bg-academic-50 transition-colors">{t.exportCsv}</button>
          <button onClick={handleExportExcel} className="px-3 py-2 border rounded-md text-sm bg-white border-green-200 text-green-700 hover:bg-green-50 transition-colors">{t.exportExcel}</button>
          <button onClick={handleExportPDF} className="px-3 py-2 bg-academic-600 text-white rounded-md text-sm hover:bg-academic-700 shadow-sm transition-colors">{t.exportPdf}</button>
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 w-10 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colRank}</th>
                <th className="px-3 py-3 w-20 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colRelevance}</th>
                <th className="px-3 py-3 w-16 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colStatus}</th>
                <th className="px-3 py-3 w-32 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colKeyAreas}</th>
                <th className="px-3 py-3 w-48 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colTitle}</th>
                <th className="px-3 py-3 w-32 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colAuthors}</th>
                <th className="px-3 py-3 w-24 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colYear}</th>
                <th className="px-3 py-3 w-24 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colJournal}</th>
                <th className="px-3 py-3 w-10 text-left font-bold text-gray-500 uppercase tracking-tighter">URL</th>
                <th className="px-3 py-3 w-56 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colMainIdea}</th>
                <th className="px-3 py-3 w-56 text-left font-bold text-gray-500 uppercase tracking-tighter bg-blue-50/50">{t.colContextRelevance}</th>
                <th className="px-3 py-3 w-64 text-left font-bold text-gray-500 uppercase tracking-tighter bg-indigo-50/50">{t.colStrategicQuotes}</th>
                <th className="px-3 py-3 w-48 text-left font-bold text-gray-500 uppercase tracking-tighter">{t.colApa}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {papers.map((p, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 transition-colors ${p.isManualEntry ? 'bg-indigo-50/30' : p.isUploadedFile ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-3 py-4 text-gray-500">{p.rank}</td>
                  <td className="px-3 py-4 font-bold text-academic-700">{p.relevanceScore}%</td>
                  <td className="px-3 py-4">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${p.isManualEntry ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : p.isUploadedFile ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {getStatusText(p)}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.keyAreas?.map((area, i) => (
                        <span key={i} className="px-1 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-medium uppercase">{area}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="font-bold text-gray-900 leading-tight">{p.title}</div>
                  </td>
                  <td className="px-3 py-4 text-gray-600 italic">{p.authors}</td>
                  <td className="px-3 py-4 text-gray-500">{p.year}</td>
                  <td className="px-3 py-4 text-gray-700 font-medium">{p.journal}</td>
                  <td className="px-3 py-4 text-center">
                    <a 
                      href={
                        p.url.startsWith('10.') ? `https://doi.org/${p.url}` : 
                        p.url.toLowerCase().startsWith('doi:') ? `https://doi.org/${p.url.substring(4)}` :
                        p.url
                      } 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center w-7 h-7 bg-academic-600 text-white rounded hover:bg-academic-700 transition-colors"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                    </a>
                  </td>
                  <td className="px-3 py-4 text-gray-700 leading-relaxed text-[11px]">{p.mainIdea[language]}</td>
                  <td className="px-3 py-4 bg-blue-50/20 text-indigo-900 leading-relaxed border-l border-blue-100 text-[11px]">
                    {p.contextRelevance[language]}
                  </td>
                  <td className="px-3 py-4 bg-indigo-50/20 text-academic-900 leading-relaxed border-l border-indigo-100 text-[11px] italic">
                    {p.strategicQuotes?.[language]}
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-[10px] text-gray-600 leading-normal bg-slate-50 p-2 rounded border border-slate-100 italic">
                      {p.apaCitation}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
