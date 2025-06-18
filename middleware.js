import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req) {
  const sessionToken = req.cookies.get("session")?.value;

  const url = req.nextUrl;

  if (!sessionToken && url.pathname !== "/authentication/sign-in") {
    return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  }

  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, encodedKey);

      const role = payload.role;

      if (url.pathname.startsWith("/dashboard-president")) {
        if (role !== "president") {
          return NextResponse.redirect(new URL("/not-found", req.url));
        }
      } else if (url.pathname.startsWith("/dashboard")) {
        if (role !== "admin") {
          return NextResponse.redirect(new URL("/not-found", req.url));
        }
      } else if (url.pathname.startsWith("/member-dashboard")) {
        if (role !== "member") {
          return NextResponse.redirect(new URL("/not-found", req.url));
        }
      } else if (url.pathname.startsWith("/nonMember")) {
        if (role !== "non-member") {
          return NextResponse.redirect(new URL("/not-found", req.url));
        }
      }           

    } catch (err) {
      console.error("Invalid session:", err);
      return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard-president/:path*",
    "/member-dashboard/:path*",
    "/nonMember/:path*",
  ],
};
