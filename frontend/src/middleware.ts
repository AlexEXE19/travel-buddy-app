import { NextRequest, NextResponse } from "next/server"

const unprotectedRoutes = ["/", "/login", "/register", "/admin/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("AUTH_TOKEN")?.value

  if (unprotectedRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    // The admin area has its own login; everything else uses the user login.
    const loginUrl = pathname.startsWith("/admin") ? "/admin/login" : "/login"
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Run on all routes EXCEPT:
     * - api routes
     * - Next internals (_next/static, _next/image)
     * - favicon
     * - any public asset with a file extension (e.g. /images/*.png) — this is
     *   what was previously redirecting the homepage images to /login.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}
