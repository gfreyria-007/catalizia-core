import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = "AIzaSyDjzLtVLhTXh-uoMdErrbpwR2uPZfYB5qY";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  console.log("AVAILABLE MODELS:");
  data.models.forEach((m: any) => {
    if (m.supportedGenerationMethods.includes('generateContent') && m.name.includes("gemini")) {
      console.log(m.name);
    }
  });
}

listModels();
