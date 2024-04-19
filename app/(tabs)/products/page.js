"usr server"

import db from "@/lib/db"
import ProductList from "@/components/product-list"

async function getInitialProducts() {
	const products = await db.product.findMany({
		select: {
			title: true,
			price: true,
			create_at: true,
			photo: true,
			id: true
		},
		take: 1,
		orderBy: {
			create_at: "desc"
		}
	})
	return products
}

export default async function ProductsPage() {
	const initialProducts = await getInitialProducts()
	return (
		<div>
			<ProductList initialProducts={initialProducts} />
		</div>
	)
}
