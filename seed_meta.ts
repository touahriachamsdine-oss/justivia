import groq, { JUSTIVIA_SEARCH_PROMPT, JUSTIVIA_SYSTEM_PROMPT } from './lib/groq';
import { setLawMetadata } from './lib/cache';

async function seedMetadata() {
  const lawsToSeed = [
    { id: 'Family Code', query: 'Algerian Family Code (قانون الأسرة)' },
    { id: 'Investment Law', query: 'Algerian Investment Law (قانون الاستثمار)' },
    { id: 'Civil Code', query: 'Algerian Civil Code (القانون المدني)' },
    { id: 'Commercial Code', query: 'Algerian Commercial Code (القانون التجاري)' },
    { id: 'Labor Law', query: 'Algerian Labor Law (قانون العمل)' },
    { id: 'Consumer Protection Law', query: 'Algerian Consumer Protection Law (قانون حماية المستهلك)' },
    { id: 'Insurance Law', query: 'Algerian Insurance Law (قانون التأمينات)' },
    { id: 'Copyright Law', query: 'Algerian Copyright Law (قانون حقوق المؤلف)' },
    { id: 'Patent Law', query: 'Algerian Patent Law (قانون براءات الاختراع)' },
    { id: 'Trademark Law', query: 'Algerian Trademark Law (قانون العلامات التجارية)' },
    { id: 'Competition Law', query: 'Algerian Competition Law (قانون المنافسة)' },
    { id: 'Land Orientation Law', query: 'Algerian Land Orientation Law (قانون التوجيه العقاري)' },
    { id: 'Town Planning Law', query: 'Algerian Town Planning Law (قانون التهيئة والتعمير)' },
    { id: 'Monetary and Banking Law', query: 'Algerian Monetary and Banking Law (القانون النقدي والمصرفي)' }
  ];

  console.log('Starting Metadata Seeding...');

  for (const lawConfig of lawsToSeed) {
    console.log(`Fetching metadata for: ${lawConfig.query}`);
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: `${JUSTIVIA_SYSTEM_PROMPT}\n\n${JUSTIVIA_SEARCH_PROMPT}` },
          { role: "user", content: `Provide the full metadata for: ${lawConfig.query}. Ensure translations for ar, fr, en.` }
        ],
        response_format: { type: "json_object" },
        temperature: 0,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      if (result.laws && result.laws.length > 0) {
        const law = result.laws[0];
        // Override the law id to match our internal naming for article cache lookup
        const lawName = lawConfig.id;
        await setLawMetadata(lawName, law);
        console.log(`Successfully cached metadata for ${lawName}`);
      }
    } catch (error) {
      console.error(`Error seeding metadata for ${lawConfig.query}:`, error);
    }
    // Rate limit buffer
    await new Promise(resolve => setTimeout(resolve, 15000));
  }

  console.log('Metadata seeding completed.');
  process.exit(0);
}

seedMetadata();
