import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  const isAdminSubdomain = host.startsWith('admin.');

  if (isAdminSubdomain) {
    if (pathname === '/') {
      return NextResponse.redirect(`https://${host}/dashboard`);
    }

    if (!session) {
      return NextResponse.redirect(
        `https://${host.replace(
          'admin.',
          ''
        )}/signin?callbackUrl=${encodeURIComponent(req.nextUrl.href)}`
      );
    }

    if (session && session.role !== 'admin') {
      return NextResponse.redirect(`${origin}`);
    }
  } else {
    if (pathname.startsWith('/admin')) {
      const newPath = pathname.replace('/admin', '');
      return NextResponse.redirect(`https://admin.telejkam.uz${newPath}`);
    }

    if (pathname.startsWith('/profile') && !session) {
      return NextResponse.redirect(`${origin}`);
    }
  }

  return NextResponse.next();
}

// Enable the middleware for specific routes
export const config = {
  matcher: ['/profile/:path*', '/admin/:path*', '/dashboard/:path*', '/'], // Обрабатывайте как /admin, так и общий маршрут
};
