import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  console.log(`Middleware called for path: ${pathname}`);
  console.log(`Session:`, session);

  const isAdminSubdomain = host.startsWith('admin.');

  if (isAdminSubdomain) {
    if (!session) {
      console.log(`User is not signed in, redirecting to signin`);
      return NextResponse.redirect(
        `${origin.replace(
          'admin.',
          ''
        )}/signin?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`
      );
    }

    if (session.role !== 'admin') {
      console.log(`User is not admin, redirecting to www.telejkam.uz`);
      return NextResponse.redirect('https://www.telejkam.uz');
    }

    if (pathname === '/' || pathname === '/admin') {
      console.log(`Admin accessing root, redirecting to /dashboard`);
      return NextResponse.redirect(`${origin}/dashboard`);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/profile') && !session) {
    console.log(`Redirecting to ${origin}`);
    return NextResponse.redirect(origin);
  }

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

    console.log(`Redirecting to admin subdomain`);
    return NextResponse.redirect('https://admin.telejkam.uz/dashboard');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/signin',
  ],
};
