"use client"

import Input from "@/components/input"
import Button from "@/components/btn"
import SocialLogin from "@/components/social-login"
import { useFormState } from "react-dom"
import { createAccount } from "./actions"
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/constants"

export default function CreateAccPage() {
	const [state, dispatch] = useFormState(createAccount, null)
	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="flex flex-col gap-2 *:font-medium">
				<h1 className="text-2xl">안녕하세요!</h1>
				<h2 className=" text-xl">Fill in the form below to join!</h2>
			</div>

			<form action={dispatch} className="flex flex-col gap-3">
				<Input
					name="username"
					type="text"
					required
					placeholder="Username"
					errors={state?.fieldErrors.username}
					displayerror="true"
				/>
				<Input
					name="email"
					type="email"
					required
					placeholder="Email"
					errors={state?.fieldErrors.email}
					displayerror="true"
				/>
				<Input
					name="password"
					type="password"
					required
					placeholder="Password"
					errors={state?.fieldErrors.password}
					minLength={PASSWORD_MIN_LENGTH}
					maxLength={PASSWORD_MAX_LENGTH}
					displayerror="true"
				/>
				<Input
					name="confirmPassword"
					type="password"
					required
					placeholder="Confirm Password"
					errors={state?.fieldErrors.confirmPassword}
					displayerror="true"
				/>
				<Button text="Create account" />
			</form>

			<SocialLogin />
		</div>
	)
}
