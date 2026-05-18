import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTasks, addTask } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_token')?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  return NextResponse.json(getTasks(userId));
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_token')?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const newTask = addTask({ ...body, userId });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
