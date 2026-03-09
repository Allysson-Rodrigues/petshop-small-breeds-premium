import type { PropsWithChildren, ReactNode } from "react";

export const dashboardInputClassName =
	"w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/30";

export const dashboardSelectClassName =
	"w-full border border-[#e5e5e5] rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all bg-white";

interface DashboardCollectionPanelProps extends PropsWithChildren {
	isEditing?: boolean;
}

interface DashboardInlineFormProps {
	actionsClassName?: string;
	children: ReactNode;
	minHeightClassName?: string;
	onCancel: () => void;
	onClose: () => void;
	onSubmit: () => void;
	submitLabel: string;
	title: string;
}

interface DashboardFormGridProps extends PropsWithChildren {
	className?: string;
}

interface DashboardFormFieldProps extends PropsWithChildren {
	className?: string;
	label: string;
}

function joinClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

export function DashboardCollectionPanel({
	children,
	isEditing = false,
}: DashboardCollectionPanelProps) {
	return (
		<div
			className={joinClassNames(
				"bg-white rounded-2xl border border-[#e5e5e5] shadow-sm relative transition-all duration-300",
				isEditing ? "border-primary/20 shadow-md" : "overflow-hidden",
			)}
		>
			{children}
		</div>
	);
}

export function DashboardInlineForm({
	actionsClassName = "mt-4",
	children,
	minHeightClassName = "min-h-[400px]",
	onCancel,
	onClose,
	onSubmit,
	submitLabel,
	title,
}: DashboardInlineFormProps) {
	return (
		<div
			className={joinClassNames(
				"bg-white/98 z-10 flex flex-col p-6 md:p-8 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300 rounded-2xl",
				minHeightClassName,
			)}
		>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold text-primary">{title}</h2>
				<button
					type="button"
					onClick={onClose}
					className="text-gray-400 hover:text-primary transition-colors"
					title="Fechar"
				>
					<span className="material-symbols-outlined">close</span>
				</button>
			</div>

			{children}

			<div
				className={joinClassNames(
					"flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100",
					actionsClassName,
				)}
			>
				<button
					type="button"
					onClick={onCancel}
					className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors order-2 sm:order-1"
				>
					Cancelar
				</button>
				<button
					type="button"
					onClick={onSubmit}
					className="bg-neutral-900 text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-black/10 order-1 sm:order-2 active:scale-[0.98]"
				>
					{submitLabel}
				</button>
			</div>
		</div>
	);
}

export function DashboardFormGrid({
	children,
	className,
}: DashboardFormGridProps) {
	return (
		<div className={joinClassNames("grid gap-5 mb-8", className)}>
			{children}
		</div>
	);
}

export function DashboardFormField({
	children,
	className,
	label,
}: DashboardFormFieldProps) {
	return (
		<div className={joinClassNames("space-y-1.5", className)}>
			<label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
				{label}
			</label>
			{children}
		</div>
	);
}
