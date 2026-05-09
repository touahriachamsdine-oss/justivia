import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Set the webSocketConstructor to the ws package for Node.js environment
neonConfig.webSocketConstructor = ws;

// Initialize the neon client with the database connection string
const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === 'production') {
  console.warn('DATABASE_URL is missing in production environment!');
}

const pool = new Pool({ 
  connectionString: connectionString || 'postgresql://dummy:password@localhost:5432/dummy' 
});

/**
 * Executes a query against the Neon PostgreSQL database.
 */
export async function queryDB(query: string, params: any[] = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
}

/**
 * Optional legacy wrappers (temporary) to ease transition from JSON,
 * though we should update callers to use queryDB directly.
 */
export async function readDB<T>(filename: string): Promise<T | null> {
  console.warn(`readDB called for ${filename} - This is deprecated. Migrate to PostgreSQL queries.`);
  return null;
}

export async function writeDB<T>(filename: string, data: T): Promise<boolean> {
  console.warn(`writeDB called for ${filename} - This is deprecated. Migrate to PostgreSQL queries.`);
  return false;
}

