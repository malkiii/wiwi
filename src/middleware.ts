import { NextResponse } from 'next/server';
import authConfig from '~/auth.config';
import NextAuth from 'next-auth';

const middleware = NextAuth(authConfig).auth;

export default middleware(request => {
  const url = request.nextUrl;

  const isHomePage = url.pathname === '/';
  const isAuthenticated = !!request.auth?.user;
  const isAuthRoute = ['/login', '/register'].includes(url.pathname);

  if (isAuthenticated && (isHomePage || isAuthRoute)) {
    return NextResponse.redirect(new URL('/app', url.origin));
  }

  if (!isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }
});

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: ['/', '/login', '/register', '/app/:path*'],
};
