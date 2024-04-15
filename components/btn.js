"use client"

import { useFormStatus } from "react-dom"

export default function FormBtn({ text }) {
	const { pending } = useFormStatus()
	return (
		<button
			disabled={pending}
			className="primary-btn
		h-10 disabled:bg-neutral-400 disabled:cursor-not-allowed"
		>
			{pending ? `로딩 중` : text}
		</button>
	)
}
