import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('itemId');
  const itemType = searchParams.get('itemType');

  try {
    if (itemId && itemType) {
      const rows = await queryDB(
        'SELECT * FROM favorites WHERE user_id = $1 AND item_id = $2 AND item_type = $3',
        [userId, itemId, itemType]
      );
      return NextResponse.json({ isFavorited: rows.length > 0 });
    }

    const favorites = await queryDB(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return NextResponse.json(favorites);
  } catch (error: any) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { itemId, itemType, itemData } = await req.json();

  if (!itemId || !itemType || !itemData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await queryDB(
      'INSERT INTO favorites (user_id, item_id, item_type, item_data) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, item_id, item_type) DO NOTHING',
      [userId, itemId, itemType, itemData]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { itemId, itemType } = await req.json();

  if (!itemId || !itemType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await queryDB(
      'DELETE FROM favorites WHERE user_id = $1 AND item_id = $2 AND item_type = $3',
      [userId, itemId, itemType]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
