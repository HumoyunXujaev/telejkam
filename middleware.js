import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;

  console.log(`Middleware called for path: ${pathname}`);

  const session = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  console.log(`Session:`, session);

  if (pathname.startsWith('/profile') && !session) {
    console.log(`Redirecting to ${origin}`);
    return NextResponse.redirect(`${origin}`);
  }

  if (pathname.startsWith('/admin')) {
    if (!session) {
      console.log(`User not authenticated, redirecting to ${origin}`);
      return NextResponse.redirect(`${origin}`);
    }
    if (session.role !== 'admin') {
      console.log(`User is not admin, redirecting to ${origin}`);
      return NextResponse.redirect(`${origin}`);
    }
  }
}
