const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const JUSTIVIA_SYSTEM_PROMPT = `You are Justivia, a specialized legal AI assistant for Algerian Law.
Focus ONLY on Algerian law (Civil, Commercial, Labor, Family, Real Estate).
Always respond in a professional tone.`;

const JUSTIVIA_SEARCH_PROMPT = `
Output MUST be a JSON object with a "laws" array.
Each law object must contain:
- id: string
- title: { ar: string, fr: string, en: string }
- official_number: { ar: string, fr: string, en: string }
- gazette: { issue_number: string, publication_date: { ar: string, fr: string, en: string, iso: string } }
- citizen_summary: { ar: string, fr: string, en: string }
- explanation: { ar: string, fr: string, en: string }
- relevant_articles: Array of { number: string, heading: { ar: string, fr: string, en: string }, text: { ar: string, fr: string, en: string } }
`;

async function testSearch() {
  const query = "قانون الاستثمار";
  const language = "ar";
  
  const userPrompt = `
    Query: "${query}"
    Target Language: ${language}
    
    INSTRUCTIONS:
    1. Provide a "laws" array containing the most relevant Algerian legal documents.
    2. Each law MUST have:
       - "id": string
       - "title": { "ar": string, "fr": string, "en": string }
       - "official_number": { "ar": string, "fr": string, "en": string }
       - "gazette": { "issue_number": string, "publication_date": { "ar": string, "fr": string, "en": string, "iso": string } }
       - "citizen_summary": { "ar": string, "fr": string, "en": string }
       - "explanation": { "ar": string, "fr": string, "en": string }
       - "relevant_articles": Array of { "number": string, "heading": { "ar": string, "fr": string, "en": string }, "text": { "ar": string, "fr": string, "en": string } }
    3. Strictly limit results to Algerian Private Law (Civil, Commercial, Labor, Family, Real Estate).
    4. Current detected language for search context is ${language}.
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: 'system', content: `${JUSTIVIA_SYSTEM_PROMPT}\n\n${JUSTIVIA_SEARCH_PROMPT}` },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    console.log("Response Received:");
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

testSearch();
