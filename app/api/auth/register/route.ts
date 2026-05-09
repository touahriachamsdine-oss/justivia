import { NextRequest, NextResponse } from "next/server";
import { queryDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'citizen' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const allowedRoles = ['citizen', 'lawyer', 'student', 'admin', 'enthusiast'];
    const finalRole = allowedRoles.includes(role) ? role : 'citizen';

    const existingUsers = await queryDB('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await queryDB(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, finalRole]
    );

    const newUser = result[0];

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
