import { NextRequest, NextResponse } from 'next/server';
import { getLawMetadata } from '@/lib/cache';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const law = await getLawMetadata(id);
    if (!law) {
      return NextResponse.json({ error: "Law not found" }, { status: 404 });
    }

    // Transform for frontend
    const formattedLaw = {
      ...law,
      title: typeof law.title === 'string' ? JSON.parse(law.title) : law.title,
      official_number: typeof law.official_number === 'string' ? JSON.parse(law.official_number) : law.official_number,
      gazette: typeof law.gazette === 'string' ? JSON.parse(law.gazette) : law.gazette,
      citizen_summary: typeof law.citizen_summary === 'string' ? JSON.parse(law.citizen_summary) : law.citizen_summary,
    };

    return NextResponse.json(formattedLaw);
  } catch (error: any) {
    console.error("Fetch Law Error:", error);
    return NextResponse.json({ error: "Failed to fetch law", details: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
