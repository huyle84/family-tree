import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "super-secret-family-tree-key-for-local-dev";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  // Bảo vệ route /admin
  if (path.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
      });
      
      const role = payload.role as string;
      if (role !== "Admin" && role !== "Moderator") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
       // Token sai hoặc hết hạn
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect users who are already logged in away from login/register
  if (path === "/login" || path === "/register") {
    if (session) {
      try {
        await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/", request.url));
      } catch(err) {} 
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
