import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  console.log(`Middleware called for path: ${pathname}`);
  console.log(`Session:`, session);
  console.log(`Origin: ${origin}`);
  console.log(`Host: ${host}`);
  console.log(`Pathname: ${pathname}`);

  const isAdminSubdomain = host.startsWith('admin.');

  if (isAdminSubdomain) {
    if (!session) {
      console.log(`User is not signed in, redirecting to signin`);
      return NextResponse.redirect(
        'https://www.telejkam.uz/signin?callbackUrl=https://admin.telejkam.uz/dashboard'
      );
    }

    if (session.role !== 'admin') {
      console.log(`User is not admin, redirecting to www.telejkam.uz`);
      return NextResponse.redirect('https://www.telejkam.uz');
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/profile') && !session) {
    console.log(`Redirecting to ${origin}`);
    return NextResponse.redirect(origin);
  }

  if (pathname.startsWith('/admin') && !session) {
    console.log(
      `Redirecting to https://www.telejkam.uz/signin?callbackUrl=https://admin.telejkam.uz/dashboard`
    );
    return NextResponse.redirect(
      'https://www.telejkam.uz/signin?callbackUrl=https://admin.telejkam.uz/dashboard'
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/dashboard/:path*', '/profile/:path*'],
};
