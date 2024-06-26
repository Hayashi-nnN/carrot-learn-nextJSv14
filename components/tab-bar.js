"use client"

import {
	NewspaperIcon as OutlineNewspaperIcon,
	HomeIcon as OutlineHomeIcon,
	ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
	VideoCameraIcon as OutlineLiveIcon,
	UserIcon as OutlineUserIcon
} from "@heroicons/react/24/outline"
import {
	NewspaperIcon as SolidNewspaperIcon,
	HomeIcon as SolidHomeIcon,
	ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
	VideoCameraIcon as SolidLiveIcon,
	UserIcon as SolidUserIcon
} from "@heroicons/react/24/solid"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TabBar() {
	const pathName = usePathname()
	return (
		<div className="bg-neutral-800 fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white">
			<Link href="/products" className="flex flex-col items-center gap-px">
				{pathName === "/products" ? (
					<SolidHomeIcon className="w-7 h-7" />
				) : (
					<OutlineHomeIcon className="w-7 h-7" />
				)}
				<span>home</span>
			</Link>
			<Link href="/life" className="flex flex-col items-center gap-px">
				{pathName === "/life" ? (
					<SolidNewspaperIcon className="w-7 h-7" />
				) : (
					<OutlineNewspaperIcon className="w-7 h-7" />
				)}
				<span>life</span>
			</Link>
			<Link href="/chat" className="flex flex-col items-center gap-px">
				{pathName === "/chat" ? (
					<SolidChatIcon className="w-7 h-7" />
				) : (
					<OutlineChatIcon className="w-7 h-7" />
				)}
				<span>chat</span>
			</Link>
			<Link href="/live" className="flex flex-col items-center gap-px">
				{pathName === "/live" ? (
					<SolidLiveIcon className="w-7 h-7" />
				) : (
					<OutlineLiveIcon className="w-7 h-7" />
				)}
				<span>live</span>
			</Link>
			<Link href="/profile" className="flex flex-col items-center gap-px">
				{pathName === "/profile" ? (
					<SolidUserIcon className="w-7 h-7" />
				) : (
					<OutlineUserIcon className="w-7 h-7" />
				)}
				<span>profile</span>
			</Link>
		</div>
	)
}
