"use server"

export async function handleForm(prevState, formData) {
	return {
		errors: ['wrong password', 'password too short']
	};
}

