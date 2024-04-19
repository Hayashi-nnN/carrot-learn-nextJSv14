import Link from "next/link"
import Image from "next/image"
import { formatToTimeAgo, formatToWon } from "@/lib/utils"

export default function ListProduct({ title, price, create_at, photo, id }) {
	return (
		<Link href={`/products/${id}`} className="flex gap-5">
			<div className="relative size-28 rounded-md overflow-hidden">
				<Image
					fill
					sizes={112}
					src={photo}
					alt={title}
					priority={true}
					className="object-cover"
				/>
			</div>
			<div className="flex flex-col gap-2 *:rounded-md text-white">
				<span className="text-lg">{title}</span>
				<span className="text-sm text-neutral-500">
					{formatToTimeAgo(create_at.toString())}
				</span>
				<span className="text-lg font-semibold">{formatToWon(price)}원</span>
			</div>
		</Link>
	)
}
