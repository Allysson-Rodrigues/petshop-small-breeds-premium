import type { MouseEventHandler } from "react";

type DashboardActionButtonVariant =
	| "desktop-danger"
	| "desktop-muted"
	| "desktop-strong"
	| "mobile-muted"
	| "mobile-strong";

interface DashboardActionButtonProps {
	icon: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
	title?: string;
	variant: DashboardActionButtonVariant;
}

const variantClasses: Record<DashboardActionButtonVariant, string> = {
	"desktop-danger":
		"text-gray-400 hover:text-red-500 transition-all p-1 ml-2",
	"desktop-muted":
		"text-gray-400 hover:text-primary transition-all p-1",
	"desktop-strong":
		"text-neutral-900 hover:text-blue-700 transition-all p-1",
	"mobile-muted":
		"w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100",
	"mobile-strong":
		"w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 text-white border border-neutral-900",
};

const iconClasses: Record<DashboardActionButtonVariant, string> = {
	"desktop-danger": "material-symbols-outlined text-[18px]",
	"desktop-muted": "material-symbols-outlined text-[18px]",
	"desktop-strong": "material-symbols-outlined text-[18px]",
	"mobile-muted": "material-symbols-outlined text-lg",
	"mobile-strong": "material-symbols-outlined text-lg",
};

export function DashboardActionButton({
	icon,
	onClick,
	title,
	variant,
}: DashboardActionButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={variantClasses[variant]}
			title={title}
		>
			<span className={iconClasses[variant]}>{icon}</span>
		</button>
	);
}
