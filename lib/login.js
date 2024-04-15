import getSession from "./session"

export default async function loginUser(id) {
	const session = await getSession()
	session.id = id
	return await session.save()
}
