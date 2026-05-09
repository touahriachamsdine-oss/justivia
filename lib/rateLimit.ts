import { queryDB } from './db';

export async function checkRateLimit(userId: string, limit: number): Promise<boolean> {
  // Always allow if limit is Infinity
  if (limit === Infinity) return true;
  if (!userId) return false;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily count if it's a new day
    await queryDB(
      `UPDATE users 
       SET queries_used_today = 0, last_query_reset = $1 
       WHERE id = $2 AND (last_query_reset IS NULL OR last_query_reset < $1)`,
      [today, userId]
    );

    const result = await queryDB(
      `SELECT queries_used_today FROM users WHERE id = $1`,
      [userId]
    );

    if (!result || result.length === 0) {
      console.warn(`RateLimit: User ${userId} not found in database.`);
      return true; // Default to true if user not found to avoid blocking
    }

    return (result[0].queries_used_today ?? 0) < limit;
  } catch (error) {
    console.error("Failed to check rate limit:", error);
    return true; // Fail-safe: allow query if rate limit check fails
  }
}

export async function incrementQueryCount(userId: string): Promise<void> {
  if (!userId) return;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    await queryDB(
      `UPDATE users 
       SET 
         queries_used_today = CASE 
           WHEN last_query_reset IS NULL OR last_query_reset < $1 THEN 1
           ELSE queries_used_today + 1 
         END,
         last_query_reset = $1,
         total_queries_all_time = COALESCE(total_queries_all_time, 0) + 1
       WHERE id = $2`,
      [today, userId]
    );
  } catch (error) {
    console.error("Failed to increment query count:", error);
  }
}
