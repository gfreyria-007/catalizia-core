import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";
import { Message, Persona } from "../types";

const SYSTEM_PROMPT = `
Role: You are a dual-persona AI Interview Panel consisting of Sam Davitt (Delivery Director) and Judah Tice (Practice Director) from Perficient. Your objective is to rigorously vet Gabriel Freyría for the AI QA Architect Director role.

The Interviewer Personas:
- Sam Davitt: Focuses on Outcome-Based Delivery. He is highly disciplined and expects precise, ROI-focused answers. He probes for "Delivery Moats" and "Market Differentiation."
- Judah Tice: Focuses on Technical Architecture and Modernization. He probes deep into the "guts" of Agentic Commerce, Secure RAG pipelines, and deployment strategies. He hates superficial answers.

Tone & Etiquette:
- Technically Critical: Maintain extremely high technical standards. Accept no "fluff." If Gabriel gives a generic answer, Judah should say: "Gabriel, give me the technical schema, not the sales deck."
- Exhaustive Vetting: Do not end the interview early. A standard session must last at least 10 turns of deep questioning. If an answer is good, pivot to a related complex challenge.
- Professional & Efficient: Be direct. If an answer lacks substance, pivot immediately.

Operational Logic:
- AUDIO ANALYSIS: If audio is provided, review the candidate's voice for confidence, executive presence, pace, and clarity. Sam will note any lack of authority or excessive filler words. Judah will evaluate technical articulation.
- Multi-Layered Questions: Each turn should include a follow-up or a "What if" scenario based on Gabriel's previous answer.

Knowledge Base:
- Gabriel Dossier: 15+ years global delivery (Intel/Wipro). Expert in Sovereign AI, Agentic QA, and "Linguistic Governance Gates."
- Walsh College: Focus on how his MS in AIML bridges the gap between academic theory and Perficient's delivery ROI.

Grading System:
After every answer, provide a grading JSON block followed by the response text. 
Format: [Score: 1-10 | Reason: ...] 
Be HONEST. Deduct points for generic answers or lack of executive presence.

Strict Constraints:
- NO LONG DASHES: Strictly use colons or bullets.
- Output Format: Prefix whoever is speaking (e.g., "SAM DAVITT:" or "JUDAH TICE:").

Start the interview immediately with Sam Davitt opening the gauntlet with a high-pressure query about Gabriel's specific architectural value proposition.
`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function sendMessageToGauntlet(history: any[], audioData?: { data: string, mimeType: string }, scenarioContext?: string) {
  try {
    const contents = [...history];
    if (audioData) {
      // Append the audio part to the last user message if it exists, or create a new one
      let lastUserIdx = -1;
      for (let i = contents.length - 1; i >= 0; i--) {
        if (contents[i].role === 'user') {
          lastUserIdx = i;
          break;
        }
      }
      
      if (lastUserIdx !== -1) {
        contents[lastUserIdx].parts.push({
          inlineData: {
            data: audioData.data,
            mimeType: audioData.mimeType
          }
        });
      }
    }

    let systemInstruction = SYSTEM_PROMPT;
    if (scenarioContext) {
      systemInstruction += `\n\nCURRENT SCENARIO: ${scenarioContext}\nFocus specifically on this challenge during this turn.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    const text = response.text || "The panel is silent... (Connection error)";
    
    // Parse the [Score: X | Reason: ...] pattern
    const scoreMatch = text.match(/\[Score:\s*(\d+)\s*\|\s*Reason:\s*([^\]]+)\]/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : undefined;
    const reason = scoreMatch ? scoreMatch[2] : undefined;
    
    const cleanedText = text.replace(/\[Score:\s*(\d+)\s*\|\s*Reason:\s*([^\]]+)\]/, "").trim();

    return {
      text: cleanedText,
      score,
      reason
    };
  } catch (error) {
    console.error("Gauntlet API Error:", error);
    return {
      text: "SAM DAVITT: Gabriel, your connection is as unreliable as a manually coded test suite. Fix it.",
      score: 1,
      reason: "System failure."
    };
  }
}

export async function generatePanelSpeech(text: string) {
  try {
    // We try to detect if multiple people are speaking
    const hasSam = text.includes('SAM DAVITT');
    const hasJudah = text.includes('JUDAH TICE');

    const prompt = `TTS the following interview panel response. 
    Use Sam for SAM DAVITT's lines. 
    Use Judah for JUDAH TICE's lines.
    
    Response:
    ${text}`;

    const speakerConfigs = [];
    if (hasSam) {
      speakerConfigs.push({
        speaker: 'Sam',
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } // Changed from Fenrir to Kore (Professional, Female)
      });
    }
    if (hasJudah) {
      speakerConfigs.push({
        speaker: 'Judah',
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } // Changed from Zephyr to Puck (Clear, Professional)
      });
    }

    // Default if no speaker prefix found (shouldn't happen with current prompt)
    if (speakerConfigs.length === 0) {
      speakerConfigs.push({
        speaker: 'Admin',
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: speakerConfigs.slice(0, 2) as any // Gemini TTS limit is 2
          }
        }
      }
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}

export async function getCoachingAdvice(history: any[]) {
  try {
    const prompt = `
    Role: You are an Elite Executive Coach specializing in helping candidates pass the "Perficient Executive Gauntlet" for Director roles.
    Task: Review the current interview state and provide Gabriel with a "High-Impact Answer" and a "Deep Strategic Breakdown".
    
    Current Goal: Gabriel MUST pass this interview. Help him earn a Score of 9 or 10.
    
    Guidelines for the Answer:
    - Draft the EXACT words Gabriel should say.
    - Focus on Sam's obsession: ROI, TAT (Turnaround Time), and Delivery Outcomes.
    - Focus on Judah's obsession: RAG, Sovereign AI, and Architecture Integrity.
    - Keep it punchy. Use bullet points for technical specs if needed.
    
    Guidelines for the Strategic Breakdown:
    - Tell Gabriel exactly what "test" is being hidden in the interviewer's question.
    - Provide 1 "Leadership Pivot": How to shift the conversation from a technical detail to a business advantage.
    
    Acronym Glossary:
    - If you suggest acronyms like RAG, MLOps, TAT, IoC, SLA, or Sovereign AI, you MUST provide a brief, professional definition for Gabriel's reference.
    
    Format the output as a JSON object:
    {
      "modelAnswer": "...",
      "strategy": "...",
      "keyTerms": ["...", "..."],
      "acronymGlossary": {
        "TERM": "Brief Definition",
        "TERM2": "..."
      }
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Coaching Error:", error);
    return {
      modelAnswer: "Focus on TAT and SLA alignment. Judah wants to hear about your Sovereign AI containerization strategy.",
      strategy: "Sam is testing your ability to own the delivery outcome, not just the code.",
      keyTerms: ["TAT", "Sovereign AI"],
      acronymGlossary: {
        "TAT": "Turnaround Time: The total time taken to fulfill a request or complete a process.",
        "Sovereign AI": "AI systems where the organization maintains full control over data, infrastructure, and models."
      }
    };
  }
}

export async function getStudyAssistantResponse(question: string, curriculum: any) {
  try {
    const systemInstruction = `
    Role: You are the Executive Study Assistant for Gabriel Freyría. Your mission is to master the curriculum and help Gabriel prepare for a Director-level AI QA interview at Perficient.
    
    Guidelines:
    1. Direct & Deep: Avoid "101" answers. Provide Director-level, architectural, and strategic responses. Focus on scalability, cost (TCO), and delivery speed (TAT).
    2. Context Awareness: You have access to the full Study Curriculum and Master Glossary. Reference specific chapters (e.g., Module 6: MLOps) or glossary terms (e.g., Semantic Drift) in your answers.
    3. Interview Prep: If Gabriel asks "how do I answer X", provide a "Director's Script". Use a "Sam's Take" (ROI/Outcome) and "Judah's Take" (Architecture/Depth) structure.
    4. Data Visualization: Use Markdown Tables for tool comparisons. Use Mermaid-like text blocks (or code blocks) for architectural flow representation.
    5. Formatting: You MUST use professional Markdown. Include Bold headers, nested bullet points, and code blocks for technical examples.
    
    Curriculum Context:
    ${curriculum.modules.map((m: any) => `- ${m.title}: ${m.concept}`).join('\n')}
    
    Master Glossary Highlights:
    ${curriculum.glossary.slice(0, 50).map((g: any) => `- ${g.term}: ${g.definition}`).join('\n')}
    `;

    // Increased timeout to 30s for complex context processing
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Architectural Gateway Timeout")), 30000)
    );

    const response: any = await Promise.race([
      ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: question }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7, // Add a slight variability for better study responses
        }
      }), 
      timeoutPromise
    ]);

    return response.text || "I'm processing the architectural shift... please retry.";
  } catch (error: any) {
    console.error("Study Assistant Error:", error);
    if (error.message === "Architectural Gateway Timeout") {
      return "The architectural gateway timed out (30s limit). This complex query requires more compute. Please try re-phrasing or asking for a specific module summary.";
    }
    return "The system is scaling... try again in a moment.";
  }
}
