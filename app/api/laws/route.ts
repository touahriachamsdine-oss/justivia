import { NextResponse } from 'next/server';
import { getLawMetadata } from '@/lib/cache';

export async function GET() {
  try {
    const laws = await getLawMetadata();
    
    // Transform to the format expected by the frontend
    const formattedLaws = laws.map((law: any) => {
      // Normalize category to match translation keys
      let category = law.category || 'all';
      if (category.includes('Acts') || category.includes('Decisions')) category = 'adminActs';
      else if (category.includes('Service') || category.includes('Officials')) category = 'civilService';
      else if (category.includes('Contracts') || category.includes('Procurement')) category = 'publicContracts';
      else if (category.includes('Justice') || category.includes('Litigation') || category.includes('Procedure')) category = 'adminJustice';
      else if (category === 'Real Estate' || category === 'Investment' || category === 'Commercial') category = 'adminActs'; // Fallback for related administrative domains

      return {
        ...law,
        category,
        // Ensure the structure matches what LawCard expects
        title: typeof law.title === 'string' ? JSON.parse(law.title) : law.title,
        official_number: typeof law.official_number === 'string' ? JSON.parse(law.official_number) : law.official_number,
        gazette: typeof law.gazette === 'string' ? JSON.parse(law.gazette) : law.gazette,
        citizen_summary: typeof law.citizen_summary === 'string' ? JSON.parse(law.citizen_summary) : law.citizen_summary,
      };
    });

    return NextResponse.json({ laws: formattedLaws });
  } catch (error: any) {
    console.error("Laws API Error:", error);
    return NextResponse.json({ 
      error: "حدث خطأ أثناء تحميل فهرس القوانين", 
      details: error.message 
    }, { status: 500 });
  }
}
