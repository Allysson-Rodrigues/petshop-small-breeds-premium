export function TabLoadingState({ label = "Carregando..." }: { label?: string }) {
	return <div className="p-8 text-center text-sm text-gray-400">{label}</div>;
}

export function TabEmptyState({ label }: { label: string }) {
	return <div className="p-8 text-center text-gray-500">{label}</div>;
}
