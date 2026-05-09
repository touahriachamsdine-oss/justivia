import groq, { JUSTIVIA_SYSTEM_PROMPT, JUSTIVIA_SEARCH_PROMPT } from '@/lib/groq';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, incrementQueryCount } from '@/lib/rateLimit';
import { logQuery } from '@/lib/queryLogger';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getCachedSearch, setCachedSearch, setLawMetadata } from '@/lib/cache';

export const maxDuration = 60; // Max 60 seconds for deep legal analysis

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  // Get unique identifier for rate limiting (session ID or IP)
  const userId = session?.user ? (session.user as any).id : req.headers.get('x-forwarded-for') || 'guest-ip';
  const userRole = session?.user ? (session.user as any).role || 'user' : 'guest';

  const { query, language } = await req.json();

  // Rate limiting by role - set to Infinity as requested by the user for all roles
  const limits: Record<string, number> = { 
    guest: Infinity, 
    user: Infinity,
    citizen: Infinity, 
    student: Infinity, 
    lawyer: Infinity, 
    admin: Infinity 
  };
  const limit = limits[userRole] ?? Infinity;
  
  const allowed = await checkRateLimit(userId, limit);
  if (!allowed) {
    console.warn(`Search Rate Limit Triggered: User ${userId} (${userRole}), Limit: ${limit}`);
    return NextResponse.json({
      error: {
        ar: "لقد تجاوزت حد الاستفسارات اليومي. يرجى الترقية أو الانتظار حتى الغد",
        fr: "Limite quotidienne atteinte. Veuillez mettre à niveau ou réessayer demain",
        en: "Daily query limit reached. Please upgrade or try again tomorrow"
      }
    }, { status: 429 });
  }

  const isExhaustiveRequest = query.includes('كل') || query.includes('جميع') || query.toLowerCase().includes('all') || query.toLowerCase().includes('every');

  const userPrompt = `
    Query: "${query}"
    Target Language: ${language}
    
    INSTRUCTIONS:
    1. Provide a "laws" array containing relevant Algerian legal documents.
    2. IMPORTANT: For EVERY field (title, official_number, citizen_summary, explanation, articles), you MUST provide translations for ALL THREE languages: "ar", "fr", and "en".
    3. Each law MUST have:
       - "id": string
       - "title": { "ar": string, "fr": string, "en": string }
       - "official_number": { "ar": string, "fr": string, "en": string }
       - "gazette": { "issue_number": string, "publication_date": { "ar": string, "fr": string, "en": string, "iso": string } }
       - "citizen_summary": { "ar": string, "fr": string, "en": string }
       - "explanation": { "ar": string, "fr": string, "en": string }
       - "relevant_articles": Array of { 
           "number": string, 
           "heading": { "ar": string, "fr": string, "en": string }, 
           "text": { "ar": string, "fr": string, "en": string } 
         }
    4. Strictly limit results to Algerian Private Law.
    5. Context Language: ${language}.
  `;

  // 1. Check Cache First
  const cachedResults = await getCachedSearch(query, language);
  if (cachedResults) {
    console.info(`Serving cached results for query: ${query}`);
    return NextResponse.json(cachedResults);
  }

  const startTime = Date.now();

  async function getAICompletion(model: string, maxTokens: number) {
    return await groq.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: `${JUSTIVIA_SYSTEM_PROMPT}\n\n${JUSTIVIA_SEARCH_PROMPT}` },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.0,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' }
    });
  }

  try {
    let completion;

    try {
      // 1. Primary: 70B (High quality, high token usage)
      console.info("Trying Llama 3.3 70B...");
      completion = await getAICompletion('llama-3.3-70b-versatile', 8192);
    } catch (err: any) {
      console.warn("Llama 3.3 70B failed:", err.message);
      
      try {
        // 2. Secondary: Mixtral (Good balance, usually higher daily limits)
        console.info("Trying Mixtral 8x7B fallback...");
        completion = await getAICompletion('mixtral-8x7b-32768', 4096);
      } catch (mixErr: any) {
        console.warn("Mixtral fallback failed:", mixErr.message);
        
        try {
          // 3. Tertiary: 8B (Fastest, but very strict TPM limits)
          // We limit maxTokens to 3000 to stay under the 6000 TPM limit
          console.info("Trying Llama 3.1 8B deep fallback...");
          completion = await getAICompletion('llama-3.1-8b-instant', 3000);
        } catch (fallbackErr: any) {
          console.error("All AI Engines exhausted.");
          throw new Error(`Service temporarily overloaded. Please try a more specific query or wait a few minutes.`);
        }
      }
    }

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("AI returned an empty response.");
    }

    const responseTime = Date.now() - startTime;
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content);
      
      // Safety fallback for relevance_score to avoid NaN% in UI
      if (result.laws && Array.isArray(result.laws)) {
        result.laws = result.laws.map((law: any, index: number) => {
          // Normalize articles key
          const articles = law.relevant_articles || law.articles || [];
          
          return {
            ...law,
            relevant_articles: articles,
            relevance_score: law.relevance_score ?? (1 - index * 0.05)
          };
        });
      }
    } catch (parseErr) {
      console.error("Failed to parse AI JSON:", completion.choices[0].message.content);
      throw new Error("The legal AI returned a malformed response. Please try a more specific query.");
    }

    // Log every query for admin analytics
    try {
      await logQuery({
        userId, userRole, query, language,
        lawsReturned: result.laws?.length ?? 0,
        responseTime,
        timestamp: new Date().toISOString()
      });
      await incrementQueryCount(userId);
      
      // 2. Save to Cache
      await setCachedSearch(query, language, result);

      // 3. Persist Law Metadata for the Index
      if (result.laws && Array.isArray(result.laws)) {
        for (const law of result.laws) {
          // Determine a consistent law name
          const lawName = law.id || law.title?.en || law.official_number?.en || "Unknown Law";
          await setLawMetadata(lawName, law);
        }
      }
    } catch (logErr) {
      console.warn("Non-critical logging failure:", logErr);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("JUSTIVIA Search Pipeline Error:", error);
    
    return NextResponse.json({ 
      error: {
        ar: "حدث خطأ أثناء البحث في القوانين. يرجى المحاولة مرة أخرى لاحقاً.",
        fr: "Une erreur s'est produite lors de la recherche. Veuillez réessayer plus tard.",
        en: `Search System Error: ${error.message || "Unknown error"}`
      }
    }, { status: 500 });
  }
}
