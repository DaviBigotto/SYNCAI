import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')
  
  if (isDashboardRoute && !req.auth) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
