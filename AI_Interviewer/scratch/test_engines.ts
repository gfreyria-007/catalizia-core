import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function testEngines() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ ENGINE FAILURE: GEMINI_API_KEY missing in .env");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  console.log("⚡ IGNITING ENGINES...");
  
  try {
    console.log("🔍 Checking Flash Engine...");
    const flashResult = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: "Respond with 'FLASH_ACTIVE'" }] }]
    });
    console.log(`✅ Flash: ${flashResult.text.trim()}`);

    console.log("🔍 Checking Pro Engine...");
    const proResult = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [{ role: 'user', parts: [{ text: "Respond with 'PRO_ACTIVE'" }] }]
    });
    console.log(`✅ Pro: ${proResult.text.trim()}`);

    console.log("\n🚀 ALL ENGINES FULLY OPERATIONAL. GAUNTLET INITIALIZED.");
  } catch (error) {
    console.error("💥 ENGINE STALL:", error.message);
    process.exit(1);
  }
}

testEngines();
