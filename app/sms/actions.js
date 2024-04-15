"use server"

import { z } from "zod"
import validator from "validator"
import { redirect } from "next/navigation"

const phoneSchema = z
	.string()
	.trim()
	.refine(
		phone => validator.isMobilePhone(phone, "ko-KR"),
		"Wrong phone number format"
	)
// const phoneSchema = z.string().trim().refine(validator.isMobilePhone);
const tokenSchema = z.coerce.number().min(100000).max(999999)
// z.coerce try to converting a string data to number data

export async function smsLogin(prevState, formData) {
	const phoneNumber = formData.get("phoneNumber")
	const token = formData.get("token")

	if (!prevState.token) {
		const result = phoneSchema.safeParse(phoneNumber)
		if (!result.success) {
			return {
				token: false,
				error: result.error.flatten()
			}
		} else {
			return { token: true }
		}
	}

	if (prevState.token) {
		const result = tokenSchema.safeParse(token)
		if (!result.success) {
			return {
				token: true
				// return errors
			}
		} else {
			redirect("/")
		}
	}
}
