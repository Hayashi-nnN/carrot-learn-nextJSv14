import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: {
		template: "%s | Karrot Market",
		default: "Karrot Market"
	},
	description: "Sell and buy all the things",
	link: {
		rel: "stylesheet",
		href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
	}
}

export default function RootLayout({ children }) {
	return (
		<html>
			<body
				className={`${inter.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
			>
				{children}
			</body>
		</html>
	)
}
