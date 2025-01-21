import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        // Pozwól na dostęp do strony ustawień tylko dla zalogowanych użytkowników
        if (pathname.startsWith('/settings')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/profile/:path*', '/settings/:path*'],
};
