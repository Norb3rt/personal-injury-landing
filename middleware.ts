import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/dashboard/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/lawyer', req.url))
      }
    }

    // Check if user is trying to access lawyer routes
    if (pathname.startsWith('/dashboard/lawyer')) {
      if (token?.role !== 'lawyer' && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to auth pages without token
        if (pathname.startsWith('/auth/')) {
          return true
        }

        // Require token for dashboard routes
        if (pathname.startsWith('/dashboard/')) {
          return !!token
        }

        // Allow access to all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}
