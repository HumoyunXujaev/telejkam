import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  console.log(`Middleware called for path: ${pathname}`);
  console.log(`Session:`, session);

  // Redirect to home if not authenticated and trying to access profile
  if (pathname.startsWith('/profile') && !session) {
    console.log(`Redirecting to ${origin}`);
    return NextResponse.redirect(origin);
  }

  // Redirect to signin if not authenticated or not admin and trying to access admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      console.log(`User is not signed in, redirecting to signin`);
      return NextResponse.redirect(
        `${origin}/signin?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`
      );
    }
    if (session.role !== 'admin') {
      console.log(`User is not admin, redirecting to home`);
      return NextResponse.redirect(origin);
    }
  }

  return NextResponse.next();
}

// Enable the middleware for specific routes
export const config = {
  matcher: ['/profile/:path*', '/admin/:path*'],
};
