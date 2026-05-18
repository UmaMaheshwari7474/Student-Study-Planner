import { NextResponse } from "next/server";
import { getUser } from "@/lib/store";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = getUser(email);
    
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = await encrypt({ userId: user.id, email: user.email });

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    
    // Set a JWT cookie for authentication
    response.cookies.set({
      name: 'auth_token',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
