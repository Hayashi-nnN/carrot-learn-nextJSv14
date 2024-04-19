import TabBar from "@/components/tab-bar"

export default function TapLayout({ children }) {
	return (
		<div>
			{children}
			<TabBar />
		</div>
	)
}
