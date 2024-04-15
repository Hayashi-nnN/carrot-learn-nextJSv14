export const PASSWORD_MIN_LENGTH = 5
export const PASSWORD_MAX_LENGTH = 20
export const PASSWORD_REGEX = new RegExp(
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
)
