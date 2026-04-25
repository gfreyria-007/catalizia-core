import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Paper, InvestigationOpportunity, LiteratureReviewResponse, Language, SearchMode } from "../types";
import { searchAcademicPapers, formatPapersForGemini } from "./academicSearchService";

// Expanded High-Impact Journal List
const JOURNALS_LIST = `
1. Nature, Science, PNAS, Nature Communications, Science Advances, The Lancet, NEJM, JAMA, BMJ, 
Nature Climate Change, Global Environmental Change, Environmental Science & Technology, 
Journal of Cleaner Production, Ecological Economics, Water Research, Chemical Reviews, 
Academy of Management Journal, Harvard Business Review, Research Policy, American Economic Review,
IEEE TPAMI, ICML, NeurIPS, Information Systems Research, Sustainability (MDPI).
`;

const PHD_FRAMEWORK = `
PH.D. RESEARCH FRAMEWORK (Core Analytical Pillars):
1. GOVERNANCE & SYSTEMIC INTEGRATION: Methodological frameworks for complex systems.
2. STRATEGIC PRIORITIES & ACTION PATHWAYS: Identification of critical challenges and roadmaps.
3. DATA TRANSLATION: Bridging qualitative findings with quantitative modeling/policy.

UNIVERSAL RESEARCH QUESTIONS (Apply to each Opportunity):
A. Participatory processes: (1) Design Thinking Impact, (2) Collaborative Policy Value.
B. Science-Decision Bridge: (3) Data Actionability, (4) Academic Mediation.
C. Efficiency: (5) Sectoral vs. Integrated Effectiveness, (6) Multi-dimensional Co-Benefits.
`;

const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { mimeType: string; data: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({ inlineData: { data: base64String, mimeType: file.type } });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const fetchLiteratureReview = async (
  topic: string, 
  language: Language, 
  mode: SearchMode, 
  projectFiles: File[] = [], 
  externalFiles: File[] = [],
  additionalContext: string = '',
  manualPaperText: string = '',
  customKeywords: string = '',
  personalApiKey?: string,
  offset: number = 0
): Promise<LiteratureReviewResponse> => {
  const apiKey = personalApiKey || "AIzaSyDjzLtVLhTXh-uoMdErrbpwR2uPZfYB5qY";
  console.log("ScholarSeek Analytics - AI Core initialized. Key check pass."); 
  
  if (!apiKey || apiKey.length < 10) {
    throw new Error("API Key is missing or invalid. Please provide your own Gemini API key in Advanced Settings.");
  }

  const isDeep = mode === 'deep';
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using confirmed live models from the actual Google API response
  const modelName = isDeep ? "gemini-3.1-pro-preview" : "gemini-2.5-flash";
  const tools: any[] = [{ googleSearch: {} }]; // ALWAYS ENABLE GOOGLE WEB SEARCH TO PREVENT EMPTY DATA

  const systemInstruction = `
    You are an Elite Ph.D. Research Advisor. Your goal is to provide high-impact literature reviews and identify scientific opportunities for doctoral researchers.
    
    RESEARCHER PERSONA & BACKGROUND:
    - The user is a doctoral student or senior researcher seeking to identify gaps in current literature.
    - They require structured data, strategic insights, and alternative research directions.
    
    PRIMARY GOAL: Identify literature and gaps that help the researcher advance their specific topic, providing a holistic and strategic perspective.

    SEARCH & VERIFICATION PROTOCOL (SUPER MEGA CONFIRMED):
    1. EXCLUSIVE RELIANCE ON LIVE DATA: For the "papers" array, you MUST ONLY use the sources provided in the "LIVE SEARCH RESULTS" section.
    2. URL INTEGRITY: DO NOT alter, guess, or reformat the URLs or DOIs provided. Copy them EXACTLY.
    3. ZERO TOLERANCE FOR 404: If you are not 100% sure a link is from the verified live list, exclude it. 
    4. PRIORITIZE DOIs: Use direct DOI links (https://doi.org/[DOI_ID]) as the primary URL format when available in the live data.
    5. MANDATORY VOLUME: You must process and return a minimum of 15 HIGH-IMPACT papers in your JSON response depending on the provided data. Do not artificially truncate the list to 5 results. Process the maximum number of papers provided in the live list.
    6. SOURCE RIGOR: Deliver ONLY doctoral-level scientific papers from high-impact journals.
    7. VERIFICATION: Set "verificationStatus" based on your findings:
       - 'verified_search': Found via live search tool.
       - 'verified_source': Extracted from a user-uploaded file.
       - 'unverified': Avoid this at all costs; only use if a manual entry is provided and search fails to confirm.
    
    \${PHD_FRAMEWORK}
    
    USER-DEFINED RESEARCH CONTEXT:
    \${additionalContext ? additionalContext : "Focus on high-impact scientific contribution and identifying research gaps."}

    PRIMARY SOURCES PROTOCOL:
    1. LIVE SEARCH RESULTS: You will be provided with real papers from the Semantic Scholar API. You MUST prioritize these.
    2. PROJECT FILES: Attached files labeled as "RESEARCHER'S OWN RESEARCH".
    3. EXTERNAL REFERENCE PAPERS: Attached files labeled as "EXTERNAL REFERENCE". Extract full data from these.
    4. MANUAL PAPER TEXT: If provided, treat as the "Scientific Anchor".
    5. STRATEGIC QUOTES & 2024+ POLICY ALIGNMENT: Identify specific quotes or insights identifying global trends.
    6. ALTERNATIVE RESEARCH TITLES: Propose 5 alternative titles highlighting scalability and 2024+ priorities.

    OUTPUT FORMAT: JSON ONLY.
  `;

  const model = genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: systemInstruction,
    tools: tools
  }, { apiVersion: "v1beta" });

  const localizedStringSchema: any = {
    type: SchemaType.OBJECT,
    properties: { en: { type: SchemaType.STRING }, es: { type: SchemaType.STRING } },
    required: ["en", "es"]
  };

  const responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      papers: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            rank: { type: SchemaType.INTEGER },
            relevanceScore: { type: SchemaType.INTEGER },
            keyAreas: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            keywordsFound: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            title: { type: SchemaType.STRING },
            authors: { type: SchemaType.STRING },
            year: { type: SchemaType.INTEGER },
            journal: { type: SchemaType.STRING },
            url: { type: SchemaType.STRING },
            apaCitation: { type: SchemaType.STRING },
            mainIdea: localizedStringSchema,
            pillarAlignment: localizedStringSchema,
            contextRelevance: localizedStringSchema,
            strategicQuotes: localizedStringSchema,
            researchApproach: localizedStringSchema,
            isUploadedFile: { type: SchemaType.BOOLEAN },
            isManualEntry: { type: SchemaType.BOOLEAN },
            verificationStatus: { type: SchemaType.STRING, enum: ['verified_source', 'verified_search', 'unverified'] }
          },
          required: ["rank", "relevanceScore", "keyAreas", "keywordsFound", "title", "authors", "year", "journal", "url", "apaCitation", "mainIdea", "pillarAlignment", "contextRelevance", "strategicQuotes", "researchApproach", "verificationStatus"]
        }
      },
      opportunities: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            rank: { type: SchemaType.INTEGER },
            title: localizedStringSchema,
            theGap: localizedStringSchema,
            theNovelty: localizedStringSchema,
            highValueContext: localizedStringSchema,
            strategicAnalysis: {
              type: SchemaType.OBJECT,
              properties: {
                designThinking: localizedStringSchema,
                collaborativeValue: localizedStringSchema,
                qualitativeData: localizedStringSchema,
                academicRole: localizedStringSchema,
                nexusEfficiency: localizedStringSchema,
                coBenefits: localizedStringSchema
              },
              required: ["designThinking", "collaborativeValue", "qualitativeData", "academicRole", "nexusEfficiency", "coBenefits"]
            },
            userContextAnalysis: localizedStringSchema,
            basedOnTitles: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
          },
          required: ["rank", "title", "theGap", "theNovelty", "highValueContext", "strategicAnalysis", "basedOnTitles"]
        }
      },
      proposedTitles: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: localizedStringSchema,
            rationale: localizedStringSchema
          },
          required: ["title", "rationale"]
        }
      }
    },
    required: ["papers", "opportunities", "proposedTitles"]
  };

  const generationConfig: any = {
    responseMimeType: "application/json",
    responseSchema: responseSchema,
    temperature: 0.7,
  };

  try {
    // PHASE 1: SEARCH FOR LIVE DATA
    const livePapers = await searchAcademicPapers(topic, 20, offset);
    const livePapersContext = formatPapersForGemini(livePapers);

    // PHASE 2: CONSTRUCT PROMPT
    let userPrompt = `TOPIC: ${topic}\n`;
    if (manualPaperText) userPrompt += `PRIMARY SOURCE (MANUAL TEXT): """${manualPaperText}"""\n`;
    if (customKeywords) userPrompt += `PRIORITY KEYWORDS: [${customKeywords}]\n`;
    if (additionalContext) userPrompt += `USER CONTEXT: """${additionalContext}"""\n`;
    
    userPrompt += `
    ACTION:
    1. Analyze the provided LIVE SEARCH RESULTS below.
    2. Extract verified DOIs and metadata for these real papers. 
       *STRICT ZERO HALLUCINATION POLICY: If the LIVE SEARCH RESULTS say 'No live papers found via Semantic Scholar API', you MUST immediately formulate queries and use your Google Search Web tool to browse the internet for real, verifiable academic papers on the topic. Return only real papers you find online. Do not make anything up.*
    3. Identify 10 research opportunities/gaps based on the papers.
    4. Propose alternative titles.
    5. *ANTI-RECITATION PROTOCOL: You MUST synthesize and paraphrase all abstracts and findings in your own words to avoid copyright recitation filters.*

    LIVE SEARCH RESULTS FROM SEMANTIC SCHOLAR API:
    ${livePapersContext}

    Return the verified data in the specified JSON format.`;

    const parts: any[] = [{ text: userPrompt }];
    
    if (projectFiles.length > 0) {
      parts.push({ text: "### DOCUMENTS: RESEARCHER'S OWN RESEARCH / THESIS CONTEXT" });
      parts.push(...(await Promise.all(projectFiles.map(fileToPart))));
    }
    
    if (externalFiles.length > 0) {
      parts.push({ text: "### DOCUMENTS: EXTERNAL REFERENCE PAPERS (EXTRACT DATA FROM THESE)" });
      parts.push(...(await Promise.all(externalFiles.map(fileToPart))));
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    if (text) {
      let cleaned = text.trim().replace(/^```(json)?/, "").replace(/```$/, "").trim();
      return JSON.parse(cleaned);
    }
    throw new Error("Empty API response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};