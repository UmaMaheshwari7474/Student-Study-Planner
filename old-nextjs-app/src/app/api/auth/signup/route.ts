import { NextResponse } from "next/server";
import { createUser, getUser } from "@/lib/store";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (getUser(email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = createUser({ name, email, password: hashedPassword });
    
    const sessionToken = await encrypt({ userId: newUser.id, email: newUser.email });

    const response = NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } }, { status: 201 });
    
    response.cookies.set({
      name: 'auth_token',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
