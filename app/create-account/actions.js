"use server"

import {
	PASSWORD_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_REGEX
} from "@/lib/constants"
import db from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation"
import getSession from "@/lib/session"

// Check password is same with password confirmation
const checkPassword = ({ password, confirmPassword }) =>
	password === confirmPassword

// Validation username db
const checkUniqueUsername = async username => {
	const user = await db.user.findUnique({
		where: {
			username: username
		},
		select: {
			id: true
		}
	})

	return !Boolean(user)
}

// Validation email db
const checkUniqueEmail = async email => {
	const user = await db.user.findUnique({
		where: {
			email: email
		},
		select: {
			id: true
		}
	})

	return !Boolean(user)
}

// Validation main
const formSchema = z
	.object({
		username: z.string().trim(),
		//.refine(checkUniqueUsername, 'This username is already taken'),
		email: z.string().email().toLowerCase(),
		//.refine(checkUniqueEmail, 'This email is already taken'),
		password: z
			.string()
			.min(PASSWORD_MIN_LENGTH, "Password should be at least 5 characters")
			.max(PASSWORD_MAX_LENGTH, "Password is too long"),
		/*.regex(
        passwordRegex,
        'A password must have a-z, A-Z, 0-9 and special characters[#?!@$%^&*-]'
      )*/ confirmPassword: z.string()
	})
	.superRefine(async ({ username }, ctx) => {
		const user = await db.user.findUnique({
			where: { username: username },
			select: { id: true }
		})
		if (user) {
			ctx.addIssue({
				code: "custom",
				message: "This username already taken",
				path: ["username"],
				fatal: true
			})
			return z.NEVER
		}
	})
	.superRefine(async ({ email }, ctx) => {
		const user = await db.user.findUnique({
			where: { email: email },
			select: { id: true }
		})
		if (user) {
			ctx.addIssue({
				code: "custom",
				message: "This email already taken",
				path: ["email"],
				fatal: true
			})
			return z.NEVER
		}
	})
	.refine(checkPassword, {
		message: "Both passwords should be the same!",
		path: ["confirmPassword"]
	})

// Form main
export async function createAccount(prevState, formData) {
	// user form data
	const data = {
		username: formData.get("username"),
		email: formData.get("email"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword")
	}

	// validation result
	const result = await formSchema.safeParseAsync(data)
	//result.success ? null : console.log('here:', result.error.flatten());

	// Case: Validation deny
	if (!result.success) {
		return result.error.flatten()
	}

	// Case: Validation pass
	if (result.success) {
		// Generate hashed password
		const hashedPassword = await bcrypt.hash(result.data.password, 12)

		// Save user data in db
		const user = await db.user.create({
			data: {
				username: result.data.username,
				email: result.data.email,
				password: hashedPassword
			},
			select: {
				id: true
			}
		})

		// Session check, redirect
		const session = await getSession()
		session.id = user.id
		await session.save()
		redirect("/profile")
	}
}
