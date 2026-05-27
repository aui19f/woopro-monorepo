import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@repo/auth/middleware";

const PROTECTED_PATHS = ["/write"];
const PUBLIC_PATHS = ["/login", "/signup", "/feed", "/recipe", "/offline"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabaseResponse, user } = await updateSession(request);

  const isProtected =
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) ||
    // /[id] (mypage) — anything not matching known public routes
    (!PUBLIC_PATHS.some((p) => pathname.startsWith(p)) &&
      pathname !== "/" &&
      /^\/[a-z0-9_]+$/.test(pathname));

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
