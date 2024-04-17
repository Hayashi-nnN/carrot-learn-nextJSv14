"use client"

import Input from "@/components/input"
import Button from "@/components/btn"
import { useFormState } from "react-dom"
import { smsLogin } from "./actions"

const initialState = {
	token: false,
	error: undefined
}

export default function smsLoginPage() {
	const [state, dispatch] = useFormState(smsLogin, initialState)
	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="flex flex-col gap-2 *:font-medium">
				<h1 className="text-2xl">SMS Login</h1>
				<h2 className=" text-xl">Verify your phone number.</h2>
			</div>

			<form action={dispatch} className="flex flex-col gap-3">
				{state.token ? (
					<Input
						key="token"
						name="token"
						required
						placeholder="Verification code"
						min={100000}
						max={999999}
						displayerror="true"
						errors={state.error?.formErrors}
					/>
				) : (
					<Input
						key="phone"
						name="phoneNumber"
						displayerror="true"
						errors={state.error?.formErrors}
						required
						placeholder="Phone number"
					/>
				)}
				<Button
					loading={false}
					text={state.token ? "Verify" : "Send Verification SMS"}
				/>
			</form>
		</div>
	)
}
