import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSchedule } from "@/lib/store";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_token')?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  deleteSchedule(id, userId);
  return new NextResponse(null, { status: 204 });
}
