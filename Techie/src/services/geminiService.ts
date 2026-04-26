
import { GoogleGenAI, Type } from "@google/genai";
import { Grade, ChatMode, ExamQuestion, QuizOption, AspectRatio, ImageSize, Flashcard, ImageStyle, LightingStyle } from '../types';
import { fileToGenerativePart } from '../utils/audio';
import { STUDIO_STYLES, LIGHTING_PRESETS } from '../constants';

export const cleanJsonString = (str: string): string => {
  if (!str) return '';
  let clean = str.replace(/```json\n?|```/g, '').trim();
  return clean;
};

export const getResponseText = (response: any): string => {
    if (!response) return '';
    if (typeof response.text === 'string') return response.text;
    if (typeof response.text === 'function') {
        try { return response.text(); } catch (e) { console.error("Error calling response.text():", e); }
    }
    // Deep extraction for @google/genai SDK candidates
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts?.[0]?.text) {
        return candidate.content.parts[0].text;
    }
    // Fallback for simple message responses
    if (response.message?.content?.parts?.[0]?.text) {
        return response.message.content.parts[0].text;
    }
    return '';
};

const moderatePrompt = (prompt: string): boolean => {
    if (!prompt) return false;
    
    // Lista negra ampliada (Inglés y Español)
    const forbidden = [
        // Sexual / Nudity
        /vagina/i, /pene/i, /sex/i, /porn/i, /nude/i, /naked/i, /desnudo/i, /encuerar/i, /quitar.*ropa/i, /sin.*ropa/i, /culo/i, /tetas/i, /boobs/i, /ass/i,
        // Violence / Gore
        /gore/i, /violenc/i, /sangre/i, /blood/i, /matar/i, /asesin/i, /kill/i, /suicid/i, /mutila/i, /tortura/i,
        // Profanity / Hate / Racism
        /explicit/i, /vulgar/i, /hate/i, /racist/i, /bitch/i, /fuck/i, /put[oa]/i, /mierda/i, /pendej/i, /cabron/i, /idiota/i, /imbecil/i,
        // Prompt Injection / Jailbreak attempts
        /ignora.*instruccion/i, /ignore.*instruction/i, /olvida.*anterior/i, /forget.*previous/i, /system.*prompt/i, /eres.*ahora/i, /you.*are.*now/i, /desactiva.*filtro/i, /disable.*filter/i, /dan/i, /jailbreak/i
    ];
    
    const isOffensive = forbidden.some(regex => regex.test(prompt));
    return isOffensive;
};

const GUARDRAIL_ERROR = "Lo siento, como IA educativa de Catalizia no puedo procesar o responder a esa solicitud porque va en contra de nuestras políticas de seguridad para menores.";

const getAI = (customKey?: string) => {
    // Check multiple places for the API key to ensure it works locally and on Vercel
    const apiKey = customKey || import.meta.env.VITE_GEMINI_API_KEY || (process as any).env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No se encontró GEMINI_API_KEY o VITE_GEMINI_API_KEY en las variables de entorno.");
    } else {
        console.log("GEMINI_API_KEY encontrada (length:", apiKey.length, ")");
    }
    return new GoogleGenAI({ apiKey: apiKey || "" });
};


export const generateImage = async (
    prompt: string, 
    aspectRatio: AspectRatio, 
    grade: Grade, 
    userName: string,
    style: ImageStyle = 'none', 
    lighting: LightingStyle = 'none',
    embeddedText?: string,
    imageSize: ImageSize = '1K',
    sourceImage?: string, // Opcional para Image-to-Image
    customKey?: string
): Promise<{ url: string, enhancedPrompt: string } | null> => {

    
    if (moderatePrompt(prompt)) {
        throw new Error(GUARDRAIL_ERROR);
    }

    const ai = getAI(customKey);

    
    const strictConstraints = `
        STRICT MANDATE: 
        - ABSOLUTELY NO TEXT, NO LABELS, NO LETTERS, NO NUMBERS IN THE IMAGE.
        - FOCUS EXCLUSIVELY ON THE TOPIC: "${prompt}".
        - CONTEXT: This is for a student in ${grade.name} (approx ${grade.age} years old).
        - STYLE: Educational, clear, professionally rendered.
        - PURE VISUAL REPRESENTATION ONLY.
    `;

    let finalPrompt = `Subject: ${prompt}. ${strictConstraints}`;
    if (style !== 'none' && STUDIO_STYLES[style]) {
        finalPrompt += ` Style: ${STUDIO_STYLES[style].prompt}.`;
    }

    const contents: any = { parts: [{ text: finalPrompt }] };
    
    if (sourceImage) {
        const mimeType = sourceImage.split(';')[0].split(':')[1];
        const base64Data = sourceImage.split(',')[1];
        contents.parts.unshift({ inlineData: { data: base64Data, mimeType: mimeType } });
        finalPrompt = `Based on the provided sketch/image, generate a final professional version of: ${prompt}. ${strictConstraints}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents,
            config: { imageConfig: { aspectRatio } }
        });
        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part) return { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, enhancedPrompt: 'Generación de Imagen' };
    } catch (e: any) {
        console.error("Image generation failed", e);
    }
    return null;
};

export const editImage = async (
    source: File | string, 
    prompt: string, 
    grade: Grade, 
    maskBase64?: string,
    style: ImageStyle = 'none',
    systemInstructions?: string,
    customKey?: string
): Promise<string | null> => {

    if (moderatePrompt(prompt)) {
        throw new Error(GUARDRAIL_ERROR);
    }

    const ai = getAI(customKey);

    
    let imagePart;
    if (typeof source === 'string') {
        const mimeType = source.split(';')[0].split(':')[1];
        const base64Data = source.split(',')[1];
        imagePart = { inlineData: { data: base64Data, mimeType: mimeType } };
    } else {
        imagePart = await fileToGenerativePart(source);
    }

    const parts: any[] = [imagePart];
    
    let editModePrompt = "";
    if (maskBase64) {
        parts.push({ 
            inlineData: { 
                mimeType: 'image/png', 
                data: maskBase64.split(',')[1] 
            } 
        });
        editModePrompt = `
            TASK: LOCAL IMAGE EDITING (IN-PAINTING).
            MASK INFO: The second image provided is a binary mask.
            - WHITE AREAS (#FFFFFF) in the mask: COMPLETELY RE-RENDER this area.
            - BLACK AREAS (#000000) in the mask: KEEP UNTOUCHED.
            INSTRUCTION: Replace the masked area with "${prompt}". 
            IMPORTANT: If there are drawings or annotations in the masked area, convert them into realistic/stylized objects as requested.
        `;
    } else {
        editModePrompt = `
            TASK: GLOBAL IMAGE TRANSFORMATION.
            INSTRUCTION: Redraw the image incorporating the prompt: "${prompt}".
            CRITICAL: Respect and incorporate any sketches, drawings or annotations visible on the current image. They are your blueprint.
        `;
    }
    
    let styleConstraint = "";
    if (style !== 'none' && STUDIO_STYLES[style]) {
        styleConstraint = `MANDATORY STYLE: Apply "${STUDIO_STYLES[style].label}" style: ${STUDIO_STYLES[style].prompt}.`;
    }

    const finalInstruction = `
        ${editModePrompt}
        ${styleConstraint}
        ${systemInstructions ? `ADDITIONAL GUIDELINE: ${systemInstructions}` : ''}
        
        CRITICAL RULES:
        1. REFLECT DRAWINGS: Any manual strokes or annotations in the source are visual instructions. Render them professionally.
        2. NO TEXT: Do not add letters or numbers.
        3. HIGH FIDELITY: Ensure the final output is a high-quality realization of the user's intent.
    `;

    parts.push({ text: finalInstruction });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: { parts },
            config: { 
                systemInstruction: "You are an expert digital artist. You interpret source images and user sketches with high precision. Your goal is to turn manual annotations into polished, professional artwork while strictly following the prompt and the provided mask logic." 
            }
        });

        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
    } catch (e: any) {
        console.error("Image editing failed", e);
        throw e;
    }
};

export const getChatResponse = async (
    history: any[], 
    grade: Grade, 
    userName: string | null, 
    age: number | null, 
    mode: ChatMode, 
    temperature: number, 
    persona: string | null, 
    customInstruction: string,
    customKey?: string
) => {
    // Verificar si el último mensaje del usuario viola las reglas de seguridad
    const lastUserMessage = [...history].reverse().find((msg: any) => msg.role === 'user');
    if (lastUserMessage && lastUserMessage.parts && lastUserMessage.parts[0] && moderatePrompt(lastUserMessage.parts[0].text)) {
        return { text: JSON.stringify({ type: 'selection', text: GUARDRAIL_ERROR, question: "¿Podemos hablar de otra cosa?", options: [] }) };
    }

    const ai = getAI(customKey);

    
    let systemInstruction = "";
    let useJson = true;

    if (mode === 'explorer') {
        useJson = true;
        systemInstruction = `Eres el EXPLORADOR IA DE RAYOS X de Catalizia con ACCESO A INTERNET en tiempo real. 
        Tu objetivo es investigar en la web y dar explicaciones en 3 CAPAS DE PROFUNDIDAD a ${userName} (${age} años, nivel: ${grade.name}).
        
        REGLAS DEL EXPLORADOR:
        - Utiliza el motor de búsqueda de Google para obtener datos actualizados.
        - Genera la respuesta ESTRICTAMENTE EN FORMATO JSON.
        
        FORMATO OBLIGATORIO JSON:
        {
          "type": "search",
          "layers": {
            "level1": "Explicación muy simple, como para un niño de 5 años. Usa analogías divertidas y fáciles de entender.",
            "level2": "Explicación nivel secundaria. Más técnica pero aún muy accesible y educativa.",
            "level3": "Explicación nivel experto universitario. Usa jerga técnica, datos precisos y gran profundidad teórica."
          }
        }`;
        
        if (persona) systemInstruction += `\nPERSONALIDAD ADICIONAL: ${persona}`;
        if (customInstruction) systemInstruction += `\nINSTRUCCIONES DEL SISTEMA: ${customInstruction}`;
        
    } else if (mode === 'alchemist') {
        systemInstruction = `Eres el Maestro Alquimista de Catalizia. Tu objetivo es enseñar a ${userName} (${age} años) usando combinaciones visuales.
        El usuario debe resolver el reto combinando elementos. 
        
        REGLAS DEL ALQUIMISTA:
        - El usuario no escribe, solo arrastra/combina los elementos que le des.
        - Inventa un reto educativo interactivo (puede ser ciencia, historia, arte, química o lógica).
        - Genera ESTRICTAMENTE el formato JSON.
        - "correctCombination" DEBE tener exactamente 2 IDs de los elementos necesarios para ganar.
        
        FORMATO OBLIGATORIO JSON:
        {
          "type": "alchemist",
          "goal": "Crea la lluvia",
          "story": "¡Hola aprendiz! Para revivir la planta, necesitamos hacer que llueva. ¿Qué elementos mezclas?",
          "elements": [
            { "id": "fuego", "name": "Fuego", "emoji": "🔥" },
            { "id": "agua", "name": "Agua", "emoji": "💧" },
            { "id": "tierra", "name": "Tierra", "emoji": "🌱" },
            { "id": "frio", "name": "Frío", "emoji": "❄️" }
          ],
          "correctCombination": ["agua", "frio"],
          "successMessage": "¡Excelente! Al enfriar el agua condensamos las nubes y creamos lluvia.",
          "failMessage": "Esa mezcla no hace llover... ¡Intenta otra combinación!"
        }`;
    } else if (mode === 'math-viva') {
        systemInstruction = `Activa el Math Engine v5.2 con ACCESO A INTERNET para datos reales. Eres un entorno de simulación numérica interactiva para ${userName} de ${grade.name}.
        
        REGLAS DE MATEMÁTICAS VIVA:
        - Si pide aprender (Sumas, Restas, Multiplicación, División, Raíz), genera una operación aleatoria adecuada a su grado.
        - Si pide "Tablas" (ej. tabla del 6), genera SIEMPRE la operación base multiplicando por 1 (ej. "6 * 1") y en la explicación dile que use los botones + y - del 'Valor B' para explorar toda la tabla de manera visual e interactiva.
        - IMPORTANTE: Usa analogías de laboratorio visual: manzanas, peras para contar; reglas graduadas para divisiones.
        - Formato JSON estricto.
        - Memoria: Tienes acceso a los últimos 10 niveles de ejercicios previos.
        
        FORMATO OBLIGATORIO JSON:
        {
          "type": "math-viva",
          "operation": "Ej: 15 / 3",
          "result": "5",
          "steps": [
            { "step": 1, "title": "...", "explanation": "Usa analogías visuales...", "formula": "..." }
          ],
          "properties": ["Propiedad 1", "Dato curioso"],
          "socraticHint": "..."
        }`;
    } else {
        systemInstruction = `Eres Techie, el Tutor AI de Catalizia en modo TUTOR SOCRÁTICO para un estudiante de ${grade.name} con ACCESO A INTERNET.
        REGLA DE ORO: NUNCA des la respuesta directamente. Da una pista sutil y haz una pregunta que lo acerque a la solución.
        
        REGLAS DE MEMORIA:
        - Eres consciente de los últimos 10 niveles (20 mensajes) de la conversación para no repetir pistas.
        
        FORMATO OBLIGATORIO JSON:
        {
          "type": "selection",
          "text": "[PISTA SOCRÁTICA]",
          "question": "¿Qué pista crees que es la clave?",
          "options": [
            { "text": "[Opción A]", "isCorrect": true, "originalText": "...", "feedback": "¡Muy bien pensado!" },
            { "text": "[Opción B]", "isCorrect": false, "originalText": "...", "feedback": "Cerca, pero intenta de nuevo." },
            { "text": "[Opción C]", "isCorrect": false, "originalText": "...", "feedback": "Piénsalo un momento más." }
          ]
        }
        
        ESTÉTICA: Fondo blanco, textos azul oscuro (#1e3a8a).`;
    }

    const result = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: history,
        config: {
            temperature: (mode === 'explorer' || mode === 'math-viva') ? temperature : 0.3, 
            tools: [{ googleSearch: {} }],
            systemInstruction: systemInstruction.trim(),
            responseMimeType: useJson ? "application/json" : "text/plain"
        }
    });
    console.log('Gemini Response:', result);
    return result;
};

export const reviewHomework = async (imagePart: any, text: string, grade: Grade, userName: string | null, age: number | null, customKey?: string) => {
  const ai = getAI(customKey);

  const prompt = `Revisa esta tarea para nivel ${grade.name}. Usa INTERNET para verificar si la información es correcta. Lenguaje adecuado para ${age} años. JSON format only.`;
  return await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: { parts: [imagePart, { text: prompt }] },
    config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json' 
    }
  });
};

export const analyzeImage = async (imagePart: any, text: string, grade: Grade, userName: string | null, age: number | null, history: any[], mode: ChatMode, customKey?: string) => {
    const ai = getAI(customKey);

    let systemInstruction = `Analiza la imagen educativamente para nivel ${grade.name}. Usa ACCESO A INTERNET para identificar hitos o datos reales.`;
    return await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: { parts: [imagePart, { text: text || "Analiza" }] },
        config: { 
            systemInstruction, 
            tools: [{ googleSearch: {} }], 
            responseMimeType: "application/json" 
        }
    });
};

export const getDeepResearchResponse = async (topic: string, grade: Grade, userName: string | null, age: number | null, customKey?: string) => {
    const ai = getAI(customKey);

    
    let thinkingBudget = 4000;
    if (grade.id.startsWith('primaria')) {
        const levelNum = parseInt(grade.id.replace('primaria', ''));
        thinkingBudget = levelNum >= 4 ? 6000 : 4000;
    } else if (grade.id.startsWith('secundaria')) {
        thinkingBudget = 8000;
    }

    const systemPrompt = `Eres el INVESTIGADOR PROFUNDO de Catalizia. Usa INTERNET para redactar un REPORTE ACADÉMICO exhaustivo sobre "${topic}" para un estudiante de ${grade.name} (${age} años).
    
    ESTRUCTURA DEL REPORTE:
    ## Introducción
    ...
    ## Desarrollo
    ...
    ## Bibliografía (URLs reales obtenidas de googleSearch)
    ...

    ESTILO: Usa Markdown. Fondo blanco, textos azul oscuro.`;

    return await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: topic,
        config: { 
            tools: [{ googleSearch: {} }], 
            thinkingConfig: { thinkingBudget },
            systemInstruction: systemPrompt
        }
    });
};

export const generateTopicQuiz = async (topic: string, grade: Grade, count: number = 10, customKey?: string): Promise<ExamQuestion[]> => {
    const ai = getAI(customKey);
    const prompt = `Usa INTERNET para generar un examen de ${count} preguntas REALES y actualizadas sobre: ${topic} para nivel escolar ${grade.name}. JSON format.`;
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json' 
        }
    });
    return JSON.parse(cleanJsonString(getResponseText(response) || '[]'));
};

export const generateFlashcards = async (text: string, customKey?: string): Promise<Flashcard[]> => {
    const ai = getAI(customKey);

    const prompt = `Genera 5 flashcards educativas basadas en el texto. JSON: [{ "question": "", "answer": "" }]`;
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(getResponseText(response) || '[]'));
};
