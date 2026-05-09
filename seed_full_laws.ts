import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import groq, { JUSTIVIA_DEEP_EXTRACTION_PROMPT } from './lib/groq';
import { setCachedArticles, getCachedArticles } from './lib/cache';

async function seedLaws() {
  const lawsToSeed = [
    { name: 'Family Code', totalArticles: 224, queryPrefix: 'Algerian Family Code' },
    { name: 'Civil Code', totalArticles: 1001, queryPrefix: 'Algerian Civil Code' },
    { name: 'Commercial Code', totalArticles: 830, queryPrefix: 'Algerian Commercial Code' },
    { name: 'Civil and Administrative Procedure Code', totalArticles: 1065, queryPrefix: 'Algerian Civil and Administrative Procedure Code (CPCA)' },
    { name: 'Labor Law', totalArticles: 220, queryPrefix: 'Algerian Labor Law (Loi 90-11)' },
    { name: 'Penal Code', totalArticles: 468, queryPrefix: 'Algerian Penal Code' },
    { name: 'Investment Law', totalArticles: 45, queryPrefix: 'Algerian Investment Law (Loi 22-18)' },
    { name: 'Consumer Protection Law', totalArticles: 81, queryPrefix: 'Algerian Consumer Protection Law (Loi 09-03)' },
    { name: 'Insurance Law', totalArticles: 270, queryPrefix: 'Algerian Insurance Law (Ordonnance 95-07)' },
    { name: 'Real Estate Promotion Law', totalArticles: 81, queryPrefix: 'Algerian Real Estate Promotion Law (Loi 11-04)' },
    { name: 'Leasing Law', totalArticles: 37, queryPrefix: 'Algerian Leasing Law (Ordonnance 96-09)' },
    { name: 'Copyright Law', totalArticles: 161, queryPrefix: 'Algerian Copyright Law (Ordonnance 03-05)' },
    { name: 'Patent Law', totalArticles: 65, queryPrefix: 'Algerian Patent Law (Ordonnance 03-07)' },
    { name: 'Trademark Law', totalArticles: 40, queryPrefix: 'Algerian Trademark Law (Ordonnance 03-06)' },
    { name: 'Competition Law', totalArticles: 65, queryPrefix: 'Algerian Competition Law (Ordonnance 03-03)' },
    { name: 'Land Orientation Law', totalArticles: 89, queryPrefix: 'Algerian Land Orientation Law (Loi 90-25)' },
    { name: 'Town Planning Law', totalArticles: 81, queryPrefix: 'Algerian Town Planning Law (Loi 90-29)' },
    { name: 'Monetary and Banking Law', totalArticles: 163, queryPrefix: 'Algerian Monetary and Banking Law (Loi 23-09)' }
  ];

  const SEGMENT_SIZE = 10;

  for (const law of lawsToSeed) {
    console.log(`\n=== Seeding ${law.name} ===`);
    
    for (let start = 1; start <= law.totalArticles; start += SEGMENT_SIZE) {
      const end = Math.min(start + SEGMENT_SIZE - 1, law.totalArticles);
      const range = `${start}-${end}`;
      
      console.log(`Checking ${law.name} Articles ${range}...`);
      
      try {
        // Check if already cached
        const existing = await getCachedArticles(law.name, start, end);
        if (existing) {
          console.log(`Skipping ${law.name} Articles ${range} (already cached)`);
          continue;
        }

        let response;
        let retries = 3;
        while (retries > 0) {
          try {
            console.log(`Fetching ${law.name} Articles ${range} from AI (8B)...`);
            response = await groq.chat.completions.create({
              model: "llama-3.1-8b-instant",
              messages: [
                { role: "system", content: JUSTIVIA_DEEP_EXTRACTION_PROMPT },
                { role: "user", content: `EXTRACT VERBATIM: ${law.queryPrefix} articles ${start} to ${end}. 
                Every article MUST be unique and contain the EXACT legal text.
                DO NOT summarize. DO NOT skip any articles in the range ${start} to ${end}.
                If an article is short, include it anyway. 
                If you only provide a few articles, the result will be REJECTED.` }
              ],
              response_format: { type: "json_object" },
              temperature: 0,
            });
            break;
          } catch (err: any) {
            if (err.status === 429) {
              console.warn(`Rate limit hit, waiting 60s... (${retries} retries left)`);
              await new Promise(resolve => setTimeout(resolve, 60000));
              retries--;
            } else {
              throw err;
            }
          }
        }

        if (!response) continue;

        const data = JSON.parse(response.choices[0].message.content || '{}');
        
        // Quality Check: Ensure articles are unique and sufficient count
        if (data.articles && data.articles.length >= 8) { // Allow some slack but not much
          const firstText = data.articles[0].text.ar;
          const isRepetitive = data.articles.length > 1 && data.articles.every((a: any) => a.text.ar === firstText);
          const isLazy = data.articles.some((a: any) => a.text.ar.includes("غير متوفر") || a.text.ar.length < 15);

          if (isRepetitive || isLazy) {
            console.error(`Rejected ${law.name} Articles ${range} due to lazy/repetitive AI output.`);
            await new Promise(resolve => setTimeout(resolve, 30000)); 
            continue;
          }

          await setCachedArticles(law.name, start, end, data);
          console.log(`Successfully cached ${law.name} Articles ${range} (Verified Quality, Count: ${data.articles.length})`);
        } else {
          console.warn(`Rejected ${law.name} Articles ${range}: Only ${data.articles?.length || 0} articles returned.`);
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
        // Rate limit buffer (Increased to avoid TPM limits)
        await new Promise(resolve => setTimeout(resolve, 45000));
      } catch (error) {
        console.error(`Error seeding ${law.name} Articles ${range}:`, error);
        // Wait longer on error
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  }
  
  console.log('\nAll seeding operations completed.');
  process.exit(0);
}

seedLaws();
