import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  const isAdminSubdomain = host.startsWith('admin.');

  if (isAdminSubdomain) {
    if (!session) {
      return NextResponse.redirect(
        `${origin.replace(
          'admin.',
          ''
        )}/signin?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`
      );
    }

    if (session.role !== 'admin') {
      return NextResponse.redirect(origin.replace('admin.', ''));
    }

    if (pathname === '/') {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  } else {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(
        `https://admin.telejkam.uz${pathname.replace('/admin', '')}`
      );
    }

    if (!session && pathname.startsWith('/profile')) {
      return NextResponse.redirect(
        `${origin}/signin?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`
      );
    }
  }

  return NextResponse.next();
}

// Enable the middleware for specific routes
export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/signin',
  ],
};
