export default function Input({ errors = [], name, ...rest }) {
	return (
		<div className="flex flex-col gap-2">
			<input
				autoComplete="off"
				className="p-3 bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 ring-neutral-200 focus:ring-4 focus:ring-orange-500 border-none transition"
				name={name}
				{...rest}
			/>
			{rest.displayerror === "true"
				? errors.map((error, index) => (
						<span key={index} className="text-red-500 font-medium select-none">
							{error}
						</span>
				  ))
				: null}
		</div>
	)
}
