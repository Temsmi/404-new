import { NextResponse } from "next/server";

export function middleware(req) {
  const session = req.cookies.get("session");


  if (!session && req.nextUrl.pathname !== "/authentication/sign-in") {
    return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protect specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard-president/:path*", "/member-dashboard/:path*", "/nonMember/:path*"],
};