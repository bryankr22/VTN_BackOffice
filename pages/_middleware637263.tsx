import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req, ev) {
    const cookies = req.cookies.admin_token;
    const { pathname } = req.nextUrl
    if (pathname != '/' && pathname != '/login' && !pathname.includes('/images/') && !cookies) {
        return NextResponse.redirect('/login')
    }
    return NextResponse.next()
}