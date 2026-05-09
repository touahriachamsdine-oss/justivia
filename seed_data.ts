import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import groq, { JUSTIVIA_DEEP_EXTRACTION_PROMPT } from './lib/groq';
import { setCachedArticles } from './lib/cache';

async function seedLaws() {
  const lawsToSeed = [
    { name: 'Civil Code', query: 'Algerian Civil Code articles 1 to 10 verbatim' },
    { name: 'Commercial Code', query: 'Algerian Commercial Code articles 1 to 10 verbatim' },
    { name: 'Family Code', query: 'Algerian Family Code articles 1 to 10 verbatim' },
    { name: 'Labor Law', query: 'Algerian Labor Law articles 1 to 10 verbatim' }
  ];

  for (const law of lawsToSeed) {
    console.log(`Seeding ${law.name}...`);
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: JUSTIVIA_DEEP_EXTRACTION_PROMPT },
          { role: "user", content: `Extract the following: ${law.query}. Ensure Arabic and French are verbatim from the official gazette.` }
        ],
        response_format: { type: "json_object" },
        temperature: 0,
      });

      const data = JSON.parse(response.choices[0].message.content || '{}');
      if (data.articles && data.articles.length > 0) {
        await setCachedArticles(law.name, 1, 10, data);
        console.log(`Successfully seeded ${law.name} (Articles 1-10)`);
      } else {
        console.warn(`No articles returned for ${law.name}`);
      }
    } catch (error) {
      console.error(`Error seeding ${law.name}:`, error);
    }
  }
  process.exit(0);
}

seedLaws();
