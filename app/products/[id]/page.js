import { notFound, redirect } from "next/navigation"
import db from "@/lib/db"
import getSession from "@/lib/session"
import Image from "next/image"
import { formatToWon } from "@/lib/utils"
import Link from "next/link"
import { UserIcon } from "@heroicons/react/24/solid"

async function getIsOwner(userId) {
	const session = await getSession()
	if (session.id) {
		return session.id === userId
	}
	return false
}

async function getProduct(id) {
	const product = await db.product.findUnique({
		where: {
			id: id
		},
		include: {
			user: {
				select: {
					username: true,
					avatar: true
				}
			}
		}
	})
	return product
}

export default async function ProductDetailPage({ params }) {
	const id = Number(params.id) //product id
	if (isNaN(id)) {
		return notFound()
	}

	const product = await getProduct(id)
	if (!product) {
		return notFound()
	}

	const isOwner = await getIsOwner(product.userId)

	const deleteItem = async () => {
		"use server"
		await db.product.delete({
			where: {
				id: product.id
			}
		})
		return redirect("/products")
	}

	return (
		<div className="flex flex-col">
			<div className="relative aspect-square">
				<Image
					fill
					alt={product.title}
					src={product.photo}
					className="object-cover"
				/>
			</div>
			<div className="flex gap-2 items-center p-5 border-b border-neutral-700">
				<div className="size-10 rounded-full overflow-hidden">
					{product.user.avatar !== null ? (
						<Image
							width={40}
							height={40}
							src={product.user.avatar}
							alt={product.user.username}
							className="object-cover"
						/>
					) : (
						<UserIcon />
					)}
				</div>
				<div className="flex flex-col gap-1">
					<h3>{product.user.username}</h3>
				</div>
			</div>
			<div className="p-5">
				<h1 className="text-2xl font-semibold">{product.title}</h1>
				<p>{product.description}</p>
			</div>
			<form
				action={deleteItem}
				className="fixed w-full bottom-0 left-0 p-5 bg-neutral-800 flex justify-between items-center"
			>
				<span className="font-semibold text-xl">
					{formatToWon(product.price)}원
				</span>
				
				{isOwner ? (
					<button
						className="bg-red-500 text-white px-5 py-2.5 rounded-md font-semibold"
						href={""}
					>
						Delete Item
					</button>
				) : (
					<Link
						className="bg-orange-500 text-white px-5 py-2.5 rounded-md font-semibold"
						href={""}
					>
						채팅하기
					</Link>
				)}
			</form>
		</div>
	)
}
