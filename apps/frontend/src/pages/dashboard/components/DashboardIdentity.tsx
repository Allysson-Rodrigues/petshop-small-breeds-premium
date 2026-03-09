import NotionAvatar from "./NotionAvatar";

interface DashboardIdentityProps {
	avatarType: "human" | "pet";
	breed?: string;
	gender?: "male" | "female";
	name: string;
	size: "md" | "sm";
	subtitle?: string;
}

export function DashboardIdentity({
	avatarType,
	breed,
	gender,
	name,
	size,
	subtitle,
}: DashboardIdentityProps) {
	return (
		<div className="flex items-center gap-3">
			<NotionAvatar
				name={name}
				breed={breed}
				gender={gender}
				type={avatarType}
				size={size}
			/>
			<div>
				<div className="font-bold text-primary">{name}</div>
				{subtitle ? <div className="text-xs text-gray-500">{subtitle}</div> : null}
			</div>
		</div>
	);
}
