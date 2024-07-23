import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  console.log(`Path: ${pathname}, Origin: ${origin}, Host: ${host}`);

  const isAdminSubdomain = host.startsWith('admin.');

  if (isAdminSubdomain) {
    if (!session) {
      console.log(`Redirecting to signin from admin subdomain`);
      return NextResponse.redirect(
        `https://www.telejkam.uz/signin?callbackUrl=https://admin.telejkam.uz${pathname}`
      );
    }

    if (session.role !== 'admin') {
      console.log(
        `Redirecting to https://www.telejkam.uz from admin subdomain`
      );
      return NextResponse.redirect('https://www.telejkam.uz');
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!session) {
      console.log(`Redirecting to signin from ${origin}${pathname}`);
      return NextResponse.redirect(
        `https://www.telejkam.uz/signin?callbackUrl=${origin}${pathname}`
      );
    }

    if (session.role !== 'admin') {
      console.log(`Redirecting to ${origin} from non-admin role`);
      return NextResponse.redirect(origin);
    }
  }

  if (pathname.startsWith('/profile') && !session) {
    console.log(`Redirecting to ${origin} from profile path`);
    return NextResponse.redirect(origin);
  }

  return NextResponse.next();
}
