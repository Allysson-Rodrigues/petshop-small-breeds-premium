import type { ReactNode } from "react";
import { TabEmptyState } from "./TabState";

interface ResponsiveCollectionViewProps<T> {
	desktopHeaderRow: ReactNode;
	emptyLabel: string;
	isEditing?: boolean;
	items: T[];
	renderDesktopRow: (item: T) => ReactNode;
	renderMobileItem: (item: T) => ReactNode;
}

export function ResponsiveCollectionView<T>({
	desktopHeaderRow,
	emptyLabel,
	isEditing = false,
	items,
	renderDesktopRow,
	renderMobileItem,
}: ResponsiveCollectionViewProps<T>) {
	const shouldShowEmptyState = items.length === 0 && !isEditing;

	return (
		<>
			<div className="md:hidden divide-y divide-[#e5e5e5]">
				{items.map(renderMobileItem)}
				{shouldShowEmptyState ? <TabEmptyState label={emptyLabel} /> : null}
			</div>

			<div className="hidden md:block overflow-x-auto">
				<table className="w-full text-sm text-left">
					<thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
						{desktopHeaderRow}
					</thead>
					<tbody className="divide-y divide-[#e5e5e5]">
						{items.map(renderDesktopRow)}
					</tbody>
				</table>
				{shouldShowEmptyState ? <TabEmptyState label={emptyLabel} /> : null}
			</div>
		</>
	);
}
