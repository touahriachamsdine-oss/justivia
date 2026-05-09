import { queryDB } from './db';

export interface QueryLog {
  id?: string;
  userId: string;
  userRole: string;
  query: string;
  language: "ar" | "fr" | "en";
  lawsReturned: number;
  responseTime: number;
  timestamp: string;
  flagged?: boolean;
}

export async function logQuery(log: Omit<QueryLog, 'id'>): Promise<void> {
  try {
    await queryDB(
      `INSERT INTO queries 
       (user_id, user_role, query, language, laws_returned, response_time_ms, timestamp, flagged) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        log.userId || null,
        log.userRole || 'guest',
        log.query,
        log.language,
        log.lawsReturned,
        log.responseTime,
        log.timestamp,
        false
      ]
    );
  } catch (error) {
    console.error("Failed to log query to PostgreSQL:", error);
  }
}
