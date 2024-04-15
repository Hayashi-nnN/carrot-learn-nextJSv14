import { NextResponse } from "next/server"
import getSession from "./lib/session"

const publicOnlyUrls = {
	"/": true,
	"/login": true,
	"/sms": true,
	"/create-account": true,
	"/github/start": true,
	"/github/complete": true
}

export async function middleware(request) {
	const session = await getSession()
	const logined = Boolean(session.id)

	const inPublic = publicOnlyUrls[request.nextUrl.pathname]
	const inPrivate = !inPublic

	if (!logined) {
		if (inPrivate) {
			return NextResponse.redirect(new URL("/", request.url))
		}
	}

	if (logined) {
		if (inPublic) {
			return NextResponse.redirect(new URL("/products", request.url))
		}
	}
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
