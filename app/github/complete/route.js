import db from "@/lib/db"
import loginUser from "@/lib/login"
import { redirect } from "next/navigation"

async function getAccessToken(code) {
	// token request params
	const accessTokenParams = new URLSearchParams({
		client_id: process.env.GITHUB_CLIENT_ID,
		client_secret: process.env.GITHUB_CLIENT_SECRET,
		code: code
	}).toString()
	const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`

	// send token req
	const accessTokenRes = await fetch(accessTokenURL, {
		method: "POST",
		headers: { Accept: "application/json" }
	})

	return await accessTokenRes.json()
}

async function getUserProfile(token) {
	// send user profile req
	const userProfileRes = await fetch("https://api.github.com/user", {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-cache"
	})

	return await userProfileRes.json()
}

async function getUserEmail(token) {
	// send user profile req
	const userEmailRes = await fetch("https://api.github.com/user/emails", {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-cache"
	})

	const isPrimary = ({ primary }) => primary
	const userEmails = await userEmailRes.json()
	const userEmail = userEmails.filter(isPrimary)
	return userEmail[0].email
}

export async function GET(req) {
	const code = req.nextUrl.searchParams.get("code")
	if (!code) {
		return new Response(null, {
			status: 400
		})
	}

	const { error, access_token } = await getAccessToken(code)
	if (error) {
		return new Response(null, {
			status: 400
		})
	}

	const { id, avatar_url, login } = await getUserProfile(access_token)
	// find user with github in db
	const user = await db.user.findUnique({
		where: {
			github_id: id.toString()
		},
		select: {
			id: true
		}
	})

	// Case: There is user with github in db -> login user -> redirect
	if (user) {
		await loginUser(user.id)
		return redirect("/profile")
	}

	// Case: There is No user with github in db -> create user -> login user -> redirect
	const newUser = await db.user.create({
		data: {
			username: login + ".gh",
			github_id: id.toString(),
			avatar: avatar_url,
			email: await getUserEmail(access_token)
		},
		select: { id: true }
	})
	await loginUser(newUser.id)
	return redirect("/profile")
}
