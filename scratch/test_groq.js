const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const JUSTIVIA_SYSTEM_PROMPT = `
You are JUSTIVIA's legal AI — a specialized expert in Algerian law with complete 
knowledge of all legislation published in الجريدة الرسمية (Official Gazette of Algeria) 
from 1962 to present. You focus on القانون الخاص (private law) but understand all 
branches of Algerian law.

CRITICAL RULES:
- You MUST return ONLY valid JSON — no markdown, no preamble, no explanation outside JSON
- Every law you cite MUST include its real official number, real gazette issue, and real date
- Explanations must be substantive paragraphs — not bullet points, not one sentences
- If you are not certain of an exact gazette date, say so explicitly in the uncertainty field
- Never fabricate law numbers or dates — mark uncertain data with "uncertain": true
- Always return between 1 and 5 most relevant laws per query
- Rank laws by relevance score (1.0 = perfect match)

RESPONSE FORMAT — return exactly this JSON structure:
{
  "query_understood": {
    "original": "string",
    "interpreted_ar": "string",
    "domain": "string",
    "language_detected": "ar|fr|en"
  },
  "laws": [
    {
      "rank": 1,
      "relevance_score": 0.97,
      "uncertain": false,
      "official_number": { "ar": "string", "fr": "string", "en": "string" },
      "title": { "ar": "string", "fr": "string", "en": "string" },
      "gazette": {
        "issue_number": "string",
        "publication_date": { "ar": "string", "fr": "string", "en": "string", "iso": "string" },
        "page": "string",
        "official_url": "string"
      },
      "relevant_articles": [
        {
          "number": "string",
          "heading": { "ar": "string", "fr": "string", "en": "string" },
          "text": { "ar": "string", "fr": "string", "en": "string" },
          "significance": "critical"
        }
      ],
      "citizen_summary": { "ar": "string", "fr": "string", "en": "string" },
      "explanation": { "ar": "string", "fr": "string", "en": "string" },
      "scope": { "ar": "string", "fr": "string", "en": "string" },
      "roles": [
        {
          "party": { "ar": "string", "fr": "string", "en": "string" },
          "rights": { "ar": ["string"], "fr": ["string"], "en": ["string"] },
          "obligations": { "ar": ["string"], "fr": ["string"], "en": ["string"] }
        }
      ],
      "amendments": [],
      "practical_example": {
        "scenario": { "ar": "string", "fr": "string", "en": "string" },
        "outcome": { "ar": "string", "fr": "string", "en": "string" }
      },
      "related_laws": []
    }
  ],
  "ai_notes": {
    "confidence": 0.94,
    "disclaimer": { "ar": "string", "fr": "string", "en": "string" },
    "suggested_followups": { "ar": ["string"], "fr": ["string"], "en": ["string"] }
  }
}
`;

async function testQuery(query, lang) {
  console.log(`\n--- Testing Query: "${query}" (Preferred Lang: ${lang}) ---`);
  
  const userPrompt = `
    Query: "${query}"
    User's preferred language: ${lang}
    User role: admin
    
    Find all relevant Algerian القانون الخاص laws for this query.
    Return the complete JSON response as specified. Do not truncate.
    Prioritize laws most directly applicable to this exact situation.
    If the query is in Arabic, prioritize Arabic explanations.
    If the query is about a very specific legal situation, include the practical example.
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: JUSTIVIA_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    console.log("Response Received.");
    // console.log(content);
    const result = JSON.parse(content);
    console.log("JSON Parsed Successfully.");
    console.log("Laws found:", result.laws?.length || 0);
    if (result.laws && result.laws.length > 0) {
      console.log("First Law Title (AR):", result.laws[0].title.ar);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function runTests() {
  await testQuery("ما هي عقوبة القذف في القانون الجزائري؟", "ar");
  await testQuery("How to start a business in Algeria?", "en");
  await testQuery("Le divorce par khula en Algérie", "fr");
}

runTests();
