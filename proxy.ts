import { NextRequest, NextResponse } from 'next/server';

const TOKEN_FOOTPRINT_COOKIE = 'token_fp';
const PROTECTED_ROUTES = ['/issues'];
const PUBLIC_ROUTES = ['/signin', '/signup'];

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const tokenFootprint = request.cookies.get(TOKEN_FOOTPRINT_COOKIE)?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute && !tokenFootprint) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    if (isPublicRoute && tokenFootprint) {
        return NextResponse.redirect(new URL('/issues', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};