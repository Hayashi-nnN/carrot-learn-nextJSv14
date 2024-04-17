"use server"

import twilio from "twilio"
import crypto from "crypto"
import { z } from "zod"
import validator from "validator"
import { redirect } from "next/navigation"
import db from "@/lib/db"
import loginUser from "@/lib/login"

const phoneSchema = z
	.string()
	.trim()
	.refine(
		phone => validator.isMobilePhone(phone, "ko-KR"),
		"Wrong phone number format"
	)
// const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

async function isTokenExists(token) {
	const exists = await db.sMSToken.findUnique({
		where: {
			token: token.toString()
		}
	})
	return Boolean(exists)
}
const tokenSchema = z.coerce
	.number()
	.min(100000)
	.max(999999)
	.refine(isTokenExists, "Wrong Verification code")
// z.coerce try to converting a string data to number data

async function getToken() {
	const token = crypto.randomInt(100000, 999999).toString()
	const exist = await db.sMSToken.findUnique({
		where: {
			token
		},
		select: {
			id: true
		}
	})

	if (exist) {
		return getToken()
	} else {
		return token
	}
}

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
			// IF user input correct phone number format
			// delete all sms token
			await db.sMSToken.deleteMany({
				where: {
					user: {
						phone: result.data
					}
				}
			})
			// create new sms token
			const token = await getToken()
			await db.sMSToken.create({
				data: {
					token,
					user: {
						connectOrCreate: {
							where: {
								phone: result.data
							},
							create: {
								username: crypto.randomBytes(10).toString("hex"),
								phone: result.data
							}
						}
					}
				}
			})
			// Send sms message
			const client = twilio(
				process.env.TWILIO_ACCOUNT_SID,
				process.env.TWILIO_AUTH_TOKEN
			)
			await client.messages.create({
				body: `Your karrot verification code is: ${token}`,
				from: process.env.TWILIO_PHONE_NUMBER,
				to: process.env.MY_PHONE_NUMBER
			})
			// Show token input UI
			return { token: true }
		}
	}

	if (prevState.token) {
		const result = await tokenSchema.spa(token)
		if (!result.success) {
			console.log(result.error.flatten())
			return {
				token: true,
				error: result.error.flatten()
			}
		} else {
			const token = await db.sMSToken.findUnique({
				where: {
					token: result.data.toString()
				},
				select: {
					id: true,
					userId: true
				}
			})
			await loginUser(token.userId)
			await db.sMSToken.delete({
				where: { id: token.id }
			})
			return redirect("/profile")
		}
	}
}
