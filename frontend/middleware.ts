import { NextRequest, NextResponse } from "next/server"

const unprotectedRoutes = ["/", "/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("AUTH_TOKEN")?.value

  // if (pathname === "/" && token) {
  //   return NextResponse.redirect(new URL("/profile", request.url))
  // }

  if (!unprotectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}