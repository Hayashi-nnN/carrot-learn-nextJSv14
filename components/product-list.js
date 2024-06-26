"use client"

import { useEffect, useRef, useState } from "react"
import ListProduct from "./list-product"
import { getMoreProduct } from "@/app/(tabs)/products/actions"

export default function ProductList({ initialProducts }) {
	const [products, setProducts] = useState(initialProducts)
	const [isLoading, setIsLoading] = useState(false)
	const [page, setPage] = useState(0)
	const [isLastPage, setIsLastPage] = useState(false)

	// scroll
	const trigger = useRef(null)
	useEffect(() => {
		// declare observer
		const observer = new IntersectionObserver(
			async (entries, observer) => {
				const element = entries[0]

				// When start trigger is be showed
				if (element.isIntersecting && trigger.current) {
					observer.unobserve(trigger.current)
					setIsLoading(true)
					const newProducts = await getMoreProduct(page + 1)
					if (newProducts.length !== 0) {
						setPage(prev => prev + 1)
						setProducts(prev => [...prev, ...newProducts])
					} else {
						setIsLastPage(true)
					}
					setIsLoading(false)
				}
			},
			{ threshold: 1.0, rootMargin: "0px 0px -100px 0px" }
		)
		// regist observe target to observer
		if (trigger.current) {
			observer.observe(trigger.current)
		}
		// when this page is be unload
		return () => {
			observer.disconnect()
		}
	}, [page])

	/*const onGetMoreProduct = async () => {
		setIsLoading(true)
		const newProducts = await getMoreProduct(page + 1)
		if (newProducts.length !== 0) {
			setPage(prev => prev + 1)
			setProducts(prev => [...prev, ...newProducts])
		} else {
			setIsLastPage(true)
		}
		setIsLoading(false)
	}*/

	return (
		<div className="p-5 flex flex-col gap-5">
			{products.map(product => (
				<ListProduct key={product.id} {...product} />
			))}
			{isLastPage ? null : (
				<span
					ref={trigger}
					className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
				>
					{isLoading ? "Loading..." : "Load more"}
				</span>
			)}
		</div>
	)
}
