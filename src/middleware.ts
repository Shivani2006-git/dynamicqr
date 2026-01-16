import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const userId = request.cookies.get('user_id')?.value

    // Protected routes - redirect to login if not authenticated
    const protectedPaths = ['/dashboard']
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath && !userId) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // Auth routes - redirect to dashboard if already authenticated
    const authPaths = ['/login', '/register']
    const isAuthPath = authPaths.some(path =>
        request.nextUrl.pathname === path
    )

    if (isAuthPath && userId) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|pay/|api/).*)',
    ],
}
