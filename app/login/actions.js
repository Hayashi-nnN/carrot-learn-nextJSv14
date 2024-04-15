"use server"

import { z } from "zod"
import db from "@/lib/db"
import bcrypt from "bcrypt"
import getSession from "@/lib/session"
import { redirect } from "next/navigation"

// email db
const checkEmailExists = async email => {
	const user = await db.user.findUnique({
		where: {
			email: email
		},
		select: {
			id: true
		}
	})

	return Boolean(user)
}

const loginFormSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email()
		.toLowerCase()
		.refine(checkEmailExists, "There are no account with this email."),
	password: z.string().min(1, "Password is required")
})

// main
export async function login(prevState, formData) {
	const data = {
		email: formData.get("email"),
		password: formData.get("password")
	}

	const result = await loginFormSchema.safeParseAsync(data)

	// Case: Validation deny
	if (!result.success) {
		return result.error.flatten()
	}

	// Case: Validation pass
	if (result.success) {
		const user = await db.user.findUnique({
			where: {
				email: result.data.email
			},
			select: {
				id: true,
				password: true
			}
		})

		const checkPasswordResult = await bcrypt.compare(
			result.data.password,
			user.password
		)

		if (checkPasswordResult) {
			const session = await getSession()
			session.id = user.id
			await session.save()
			redirect("profile")
		} else {
			return {
				fieldErrors: {
					email: [],
					password: ["Wrong password"]
				}
			}
		}
	}
}
