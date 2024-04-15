import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function testToken() {
	const token = await db.sMSToken.create({
		data: {
			token: "123123",
			user: {
				connect: {
					id: 1
				}
			}
		}
	})
	console.log(token)
}

async function testUser() {
	const user = await db.user.create({
		data: {
			username: "test"
		}
	})
	console.log(user)
}

export default db
