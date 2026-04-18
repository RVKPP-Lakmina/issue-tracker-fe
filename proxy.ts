import { NextRequest, NextResponse } from 'next/server';

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'auth_token';
const PROTECTED_ROUTES = ['/issues'];
const PUBLIC_ROUTES = ['/signin', '/signup'];

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get(TOKEN_KEY)?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/issues', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};