import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  const isAdminSubdomain = host.startsWith('admin.');

  if (pathname.startsWith('/admin') && !isAdminSubdomain) {
    if (!session) {
      return NextResponse.redirect(
        `${origin}/signin?callbackUrl=${origin}/admin/dashboard`
      );
    }

    if (session.role !== 'admin') {
      return NextResponse.redirect(`${origin}`);
    }

    return NextResponse.redirect(`https://admin.telejkam.uz${pathname}`);
  }

  if (isAdminSubdomain) {
    if (!session) {
      return NextResponse.redirect(
        'https://www.telejkam.uz/signin?callbackUrl=https://admin.telejkam.uz/dashboard'
      );
    }

    if (session.role !== 'admin') {
      return NextResponse.redirect('https://www.telejkam.uz');
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/profile') && !session) {
    return NextResponse.redirect(origin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/dashboard/:path*', '/profile/:path*'],
};
