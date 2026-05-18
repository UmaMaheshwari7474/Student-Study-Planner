import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSubjects, addSubject } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_token')?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  return NextResponse.json(getSubjects(userId));
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_token')?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const newSubject = addSubject({ ...body, userId });
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
