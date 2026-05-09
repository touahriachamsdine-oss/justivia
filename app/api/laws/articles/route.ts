import { NextRequest, NextResponse } from 'next/server';
import groq, { JUSTIVIA_DEEP_EXTRACTION_PROMPT } from '@/lib/groq';
import { getCachedArticles, setCachedArticles } from '@/lib/cache';

export async function POST(req: NextRequest) {
  try {
    const { lawName, startArticle, count } = await req.json();

    if (!lawName) {
      return NextResponse.json({ error: "Law name is required" }, { status: 400 });
    }

    const SEGMENT_SIZE = 10;
    const requestedStart = startArticle || 1;
    const requestedCount = Math.min(count || 10, 30); // Max 30 articles in one aggregate request
    const requestedEnd = requestedStart + requestedCount - 1;

    // Calculate segments needed
    // e.g. start 3, end 22 -> segments 1-10, 11-20, 21-30
    const firstSegmentStart = Math.floor((requestedStart - 1) / SEGMENT_SIZE) * SEGMENT_SIZE + 1;
    
    let allExtractedArticles: any[] = [];
    const segmentsNeeded = [];
    
    for (let sStart = firstSegmentStart; sStart <= requestedEnd; sStart += SEGMENT_SIZE) {
      segmentsNeeded.push({ start: sStart, end: sStart + SEGMENT_SIZE - 1 });
    }

    for (const segment of segmentsNeeded) {
      // 1. Check Cache
      let segmentData = await getCachedArticles(lawName, segment.start, segment.end);
      
      if (!segmentData) {
        console.info(`Cache miss for ${lawName} (${segment.start}-${segment.end}), fetching from AI...`);
        
        async function getExtraction(model: string, maxTokens: number) {
          return await groq.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: JUSTIVIA_DEEP_EXTRACTION_PROMPT },
              { role: 'user', content: `Extract articles ${segment.start} to ${segment.end} of the ${lawName} verbatim. Ensure unique verbatim text for each.` }
            ],
            temperature: 0,
            max_tokens: maxTokens,
            response_format: { type: 'json_object' }
          });
        }

        let completion;
        try {
          completion = await getExtraction('llama-3.1-8b-instant', 4000); // 8B is faster and safer for small 10-article segments
        } catch (err: any) {
          console.warn(`Extraction failed for ${segment.start}-${segment.end}:`, err.message);
          continue; // Skip this segment if AI fails
        }

        segmentData = JSON.parse(completion.choices[0].message.content ?? '{}');
        
        if (segmentData.articles && Array.isArray(segmentData.articles)) {
          // 2. Save to Cache
          await setCachedArticles(lawName, segment.start, segment.end, segmentData);
        }
      } else {
        console.info(`Cache hit for ${lawName} (${segment.start}-${segment.end})`);
      }

      if (segmentData && segmentData.articles) {
        allExtractedArticles = [...allExtractedArticles, ...segmentData.articles];
      }
    }

    // Filter to exact requested range and de-duplicate
    const seenNumbers = new Set();
    const finalArticles = allExtractedArticles
      .filter(art => {
        const n = parseInt(String(art.number).replace(/[^0-9]/g, '')) || 0;
        const isInRange = n >= requestedStart && n <= requestedEnd;
        if (isInRange && !seenNumbers.has(n)) {
          seenNumbers.add(n);
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        const numA = parseInt(String(a.number).replace(/[^0-9]/g, '')) || 0;
        const numB = parseInt(String(b.number).replace(/[^0-9]/g, '')) || 0;
        return numA - numB;
      });

    return NextResponse.json({ 
      articles: finalArticles,
      range: `${requestedStart}-${requestedEnd}`,
      source: "segment_aggregator"
    });

  } catch (error: any) {
    console.error("Deep Extraction Error:", error);
    return NextResponse.json({ 
      error: "حدث خطأ أثناء تحميل المزيد من المواد", 
      details: error.message 
    }, { status: 500 });
  }
}
