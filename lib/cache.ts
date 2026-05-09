import { queryDB } from './db';
import crypto from 'crypto';

/**
 * Generates a consistent hash for a string
 */
function hashString(str: string): string {
  return crypto.createHash('md5').update(str.trim().toLowerCase()).digest('hex');
}

/**
 * Retrieves cached search results for a query and language
 */
export async function getCachedSearch(query: string, language: string) {
  const hash = hashString(query);
  try {
    const rows = await queryDB(
      'SELECT results FROM search_cache WHERE query_hash = $1 AND language = $2',
      [hash, language]
    );
    return rows.length > 0 ? rows[0].results : null;
  } catch (error) {
    console.warn('Cache fetch error (search):', error);
    return null;
  }
}

/**
 * Saves search results to cache
 */
export async function setCachedSearch(query: string, language: string, results: any) {
  const hash = hashString(query);
  try {
    await queryDB(
      `INSERT INTO search_cache (query_hash, language, results) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (query_hash, language) DO UPDATE SET results = EXCLUDED.results`,
      [hash, language, JSON.stringify(results)]
    );
  } catch (error) {
    console.warn('Cache save error (search):', error);
  }
}

/**
 * Retrieves cached articles for a specific law and range
 */
export async function getCachedArticles(lawName: string, start: number, end: number) {
  const hash = hashString(lawName);
  const range = `${start}-${end}`;
  try {
    const rows = await queryDB(
      'SELECT content FROM article_cache WHERE law_name_hash = $1 AND article_range = $2',
      [hash, range]
    );
    return rows.length > 0 ? rows[0].content : null;
  } catch (error) {
    console.warn('Cache fetch error (articles):', error);
    return null;
  }
}

/**
 * Saves extracted articles to cache
 */
export async function setCachedArticles(lawName: string, start: number, end: number, content: any) {
  const hash = hashString(lawName);
  const range = `${start}-${end}`;
  try {
    await queryDB(
      `INSERT INTO article_cache (law_name_hash, law_name, article_range, content) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (law_name_hash, article_range) DO UPDATE SET law_name = EXCLUDED.law_name, content = EXCLUDED.content`,
      [hash, lawName, range, JSON.stringify(content)]
    );
  } catch (error) {
    console.warn('Cache save error (articles):', error);
  }
}

/**
 * Retrieves metadata for all cached laws or a specific law
 */
export async function getLawMetadata(lawName?: string) {
  try {
    if (lawName) {
      const rows = await queryDB(
        'SELECT * FROM laws_meta WHERE law_name = $1',
        [lawName]
      );
      return rows.length > 0 ? rows[0] : null;
    } else {
      const rows = await queryDB(
        'SELECT * FROM laws_meta ORDER BY created_at DESC',
        []
      );
      return rows;
    }
  } catch (error) {
    console.warn('Cache fetch error (law metadata):', error);
    return [];
  }
}

/**
 * Saves or updates law metadata
 */
export async function setLawMetadata(lawName: string, metadata: any, category?: string) {
  try {
    await queryDB(
      `INSERT INTO laws_meta (law_name, title, official_number, gazette, citizen_summary, category) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (law_name) DO UPDATE SET 
        title = EXCLUDED.title,
        official_number = EXCLUDED.official_number,
        gazette = EXCLUDED.gazette,
        citizen_summary = EXCLUDED.citizen_summary,
        category = EXCLUDED.category`,
      [
        lawName, 
        JSON.stringify(metadata.title), 
        JSON.stringify(metadata.official_number), 
        JSON.stringify(metadata.gazette), 
        JSON.stringify(metadata.citizen_summary),
        category || metadata.category || 'all'
      ]
    );
  } catch (error) {
    console.warn('Cache save error (law metadata):', error);
  }
}
