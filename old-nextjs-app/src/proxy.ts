import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/signup')

  if (isAuthPage) {
    if (token) {
      try {
        await decrypt(token);
        if (pathname.startsWith('/api')) return NextResponse.next();
        return NextResponse.redirect(new URL('/', request.url));
      } catch (err) {
        // invalid token
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await decrypt(token);
    return NextResponse.next();
  } catch (err) {
    const response = pathname.startsWith('/api') 
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
