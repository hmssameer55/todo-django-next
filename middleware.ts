// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const token = req.cookies.get('token');

	if (!token) {
		return NextResponse.redirect(new URL('/auth', req.url));
	}

	// Allow the request to continue
	return NextResponse.next();
}

// Apply middleware to the base URL
export const config = {
	matcher: ['/'], // Apply only to the home page
};
