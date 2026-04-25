import { fetchLiteratureReview } from './services/geminiService';

async function runTest() {
  console.log("🚀 Starting backend integration test...");
  try {
    const result = await fetchLiteratureReview(
      "what will be the impact because ai in research and education in latin america by 2030",
      "en",
      "deep"
    );
    console.log("✅ Success! Found papers:", result.papers.length);
  } catch (error) {
    console.error("❌ Test Failed with Error:", error);
  }
}

runTest();
