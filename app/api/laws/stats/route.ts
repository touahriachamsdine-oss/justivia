import { NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';

export async function GET() {
  try {
    const rows = await queryDB(`
      SELECT law_name, count(*) as segment_count 
      FROM article_cache 
      GROUP BY law_name
    `);

    const stats = rows.reduce((acc: any, row: any) => {
      acc[row.law_name] = parseInt(row.segment_count) * 10; // Approx articles
      return acc;
    }, {});

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
