import type { ReactNode } from "react";

export function TabSectionHeader({
	title,
	description,
	action,
}: {
	title: string;
	description: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
			<div>
				<h1 className="text-xl font-bold tracking-tight text-primary md:text-2xl">
					{title}
				</h1>
				<p className="mt-1 text-xs text-gray-500 md:text-sm">{description}</p>
			</div>
			{action}
		</div>
	);
}
