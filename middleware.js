import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, origin, host } = req.nextUrl;
  const session = await getToken({ req, secret: process.env.JWT_SECRET });

  const isAdminSubdomain = host.startsWith('admin.');
  // https://admin.telejkam.uz/dashboard/product/67138b50710599da7cde125b
  // Set CORS headers for requests coming from 'https://admin.telejkam.uz'
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://admin.telejkam.uz',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Handle OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers: corsHeaders });
  }

  // Check if it's the admin subdomain, and redirect to admin if necessary
  if (pathname.startsWith('/admin') && !isAdminSubdomain) {
    if (!session) {
      return NextResponse.redirect(
        `${origin}/signin?callbackUrl=${origin}${pathname}`
      );
    }

    if (session.role !== 'admin') {
      return NextResponse.redirect(origin);
    }

    return NextResponse.redirect(
      `https://admin.telejkam.uz${pathname.replace('/admin', '')}`
    );
  }

  // Protect admin subdomain routes
  if (isAdminSubdomain) {
    if (!session) {
      return NextResponse.redirect(
        `https://www.telejkam.uz/signin?callbackUrl=${req.nextUrl.href}`
      );
    }

    if (session.role !== 'admin') {
      return NextResponse.redirect('https://www.telejkam.uz');
    }

    // Add CORS headers to the response
    const response = NextResponse.next();
    Object.keys(corsHeaders).forEach((key) => {
      response.headers.set(key, corsHeaders[key]);
    });
    return response;
  }

  // Protect the profile route
  if (pathname.startsWith('/profile') && !session) {
    return NextResponse.redirect(
      `${origin}/signin?callbackUrl=${origin}${pathname}`
    );
  }

  // Add CORS headers to the response for all other routes
  const response = NextResponse.next();
  Object.keys(corsHeaders).forEach((key) => {
    response.headers.set(key, corsHeaders[key]);
  });

  return response;
}
