import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  console.log(`Middleware called for path: ${pathname}`);
  console.log(`Session:`, session);

  const isAdminSubdomain = host.startsWith('admin.');

  if (isAdminSubdomain) {
    // Логика для субдомена admin.telejkam.uz
    if (pathname.startsWith('/')) {
      if (!session) {
        console.log(`User is not signed in, redirecting to signin`);
        return NextResponse.redirect(
          `https://${host}/signin?callbackUrl=${encodeURIComponent(
            req.nextUrl.href
          )}`
        );
      }
      if (session.role !== 'admin') {
        console.log(`User is not admin, redirecting to home`);
        return NextResponse.redirect(`https://${host.replace('admin.', '')}`);
      }
    }
  } else {
    // Логика для основного домена
    if (pathname.startsWith('/profile') && !session) {
      console.log(`Redirecting to ${origin}`);
      return NextResponse.redirect(origin);
    }
  }

  return NextResponse.next();
}

// Enable the middleware for specific routes
export const config = {
  matcher: ['/profile/:path*', '/:path*'], // `/admin/:path*` теперь должен быть на субдомене
};
