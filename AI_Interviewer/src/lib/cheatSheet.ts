import { STUDY_MODULES, MASTER_GLOSSARY } from '../constants';

export function generateCheatSheetHTML(): string {
  const glossaryByCategory = MASTER_GLOSSARY.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof MASTER_GLOSSARY>);

  const modulesHTML = STUDY_MODULES.map(m => `
    <div class="module-card">
      <h3>${m.title}</h3>
      <p class="concept"><strong>Core Concept:</strong> ${m.concept}</p>
      <div class="acronym-grid">
        ${Object.entries(m.acronyms).map(([term, def]) => `
          <div class="acronym-item">
            <strong>${term}:</strong> ${def}
          </div>
        `).join('')}
      </div>
      <div class="takeaway">"${m.executiveTakeaway}"</div>
    </div>
  `).join('');

  const glossaryHTML = Object.entries(glossaryByCategory).map(([category, items]) => `
    <div class="glossary-section">
      <h2 class="category-title">${category}</h2>
      <div class="glossary-grid">
        ${items.map(item => `
          <div class="glossary-item">
            <span class="term">${item.term}</span>
            <span class="definition">${item.definition}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Executive AI QA Architect Cheat Sheet</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          color: #1a1a1a;
          line-height: 1.5;
          padding: 40px;
          max-width: 1000px;
          margin: 0 auto;
          background: white;
        }

        header {
          border-bottom: 4px solid #f27d26;
          padding-bottom: 20px;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        h1 {
          margin: 0;
          font-size: 28px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #000;
        }

        .subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #f27d26;
          font-weight: bold;
        }

        h2.section-title {
          background: #f27d26;
          color: white;
          padding: 8px 16px;
          text-transform: uppercase;
          font-size: 16px;
          letter-spacing: 0.1em;
          margin-top: 50px;
        }

        h2.category-title {
          border-bottom: 2px solid #eee;
          padding-bottom: 8px;
          margin-top: 30px;
          font-size: 14px;
          text-transform: uppercase;
          color: #666;
          letter-spacing: 0.05em;
        }

        .module-card {
          border: 1px solid #eee;
          padding: 20px;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }

        .module-card h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          color: #f27d26;
        }

        .concept {
          font-size: 13px;
          margin-bottom: 15px;
          color: #444;
        }

        .acronym-grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }

        .acronym-item {
          font-size: 11px;
          background: #f9f9f9;
          padding: 6px 10px;
          border-radius: 4px;
        }

        .takeaway {
          font-style: italic;
          font-size: 12px;
          color: #000;
          border-left: 3px solid #f27d26;
          padding-left: 15px;
          margin-top: 10px;
          font-weight: 500;
        }

        .glossary-grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 10px;
        }

        .glossary-item {
          display: flex;
          flex-direction: column;
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          page-break-inside: avoid;
        }

        .term {
          font-weight: bold;
          font-size: 13px;
          color: #f27d26;
          font-family: 'JetBrains Mono', monospace;
        }

        .definition {
          font-size: 11px;
          color: #555;
        }

        .kpi-section {
          background: #000;
          color: #fff;
          padding: 30px;
          margin-top: 40px;
          border-radius: 8px;
        }

        .kpi-grid {
          display: grid;
          grid-template-cols: repeat(3, 1fr);
          gap: 20px;
        }

        .kpi-box h4 {
          color: #f27d26;
          margin: 0 0 5px 0;
          text-transform: uppercase;
          font-size: 12px;
        }

        .kpi-box p {
          font-size: 11px;
          margin: 0;
          color: #ccc;
        }

        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <header>
        <div>
          <h1>AI QA ARCHITECT DIRECTOR</h1>
          <div class="subtitle">EXECUTIVE GAUNTLET CHEAT SHEET // PERFICIENT V1.02</div>
        </div>
        <div class="no-print">
          <button onclick="window.print()" style="background: #f27d26; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">PRINT / SAVE AS PDF</button>
        </div>
      </header>

      <section>
        <h2 class="section-title">Critical Capability Modules</h2>
        ${modulesHTML}
      </section>

      <section>
        <h2 class="section-title">Master Executive Glossary</h2>
        ${glossaryHTML}
      </section>

      <div class="kpi-section">
        <h2 style="color: #f27d26; margin-top: 0; text-transform: uppercase; font-size: 16px;">Core Delivery metrics (The Sam Davitt Pillars)</h2>
        <div class="kpi-grid">
          <div class="kpi-box">
            <h4>TAT (Turnaround Time)</h4>
            <p>Total time from code commit to verified production readiness via Agentic QA.</p>
          </div>
          <div class="kpi-box">
            <h4>ROI (Return on Investment)</h4>
            <p>Efficiency gains: (Human Cost - AI Cost) / Implementation Cost. Target: >10x.</p>
          </div>
          <div class="kpi-box">
            <h4>SLA (Service Level Agreement)</h4>
            <p>Commitment to uptime and precision. Mandatory 99.9% for high-stakes enterprise AI.</p>
          </div>
        </div>
      </div>

      <footer style="margin-top: 50px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 10px; color: #999; font-family: 'JetBrains Mono', monospace;">
        CONFIDENTIAL // FOR GABRIEL FREYRIA PREPARATION ONLY // PROPRIETARY GAUNTLET ARCHITECTURE
      </footer>
    </body>
    </html>
  `;
}
