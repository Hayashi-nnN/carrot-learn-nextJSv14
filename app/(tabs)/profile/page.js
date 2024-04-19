import getSession from "@/lib/session"
import db from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Script from "next/script"

async function getUser() {
	const session = await getSession()
	if (session.id) {
		const user = await db.user.findUnique({
			where: { id: session.id }
		})
		if (user) {
			return user
		}
	}
	notFound()
}

export default async function ProfilePage() {
	const user = await getUser()
	const logOut = async () => {
		"use server"
		const session = await getSession()
		await session.destroy()
		redirect("/")
	}

	/*const sendToMe = async () => {
		"use server"
		Kakao.API.request({
			url: "/v2/api/talk/memo/send",
			data: {
				template_id: 82775,
				template_args: {
					title: "라이언이 즐겨먹던 바로 그 틴케이스 치즈볼",
					description:
						"바라만 봐도 즐거워지는 힐링 패키지에는 시크릿 스토리가 숨어있어요."
				}
			}
		})
			.then(function (res) {
				alert("success: " + JSON.stringify(res))
			})
			.catch(function (err) {
				alert("error: " + JSON.stringify(err))
			})
	}*/
	return (
		<div>
			<h1>Welcome {user.username}!</h1>
			<form action={logOut}>
				<button>log out</button>
			</form>
		</div>
	)
}
