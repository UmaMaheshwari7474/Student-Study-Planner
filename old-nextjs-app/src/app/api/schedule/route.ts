import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSchedules, addSchedule } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_token')?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  return NextResponse.json(getSchedules(userId));
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_token')?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const newSchedule = addSchedule({ ...body, userId });
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
