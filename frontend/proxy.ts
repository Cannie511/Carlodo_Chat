import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // const {pathname} = request.nextUrl;
    // const accessToken = request.cookies.get('accessToken')?.value;
    // if(pathname === '/' && !accessToken){
    //   return NextResponse.redirect(new URL('/signin', request.url));
    // }
    // if ((pathname === "/signin" || pathname === "/signup") && accessToken) {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
}

 
export const config = {
  matcher: [
    '/', 
    '/signin',
    '/signup'
  ],
}