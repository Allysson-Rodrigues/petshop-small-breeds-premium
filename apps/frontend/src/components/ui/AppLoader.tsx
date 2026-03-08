export default function AppLoader({ label = "Carregando..." }: { label?: string }) {
	return (
		<div className="min-h-screen bg-background-light flex items-center justify-center px-6">
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="w-12 h-12 rounded-full border-2 border-neutral-200 border-t-black animate-spin" />
				<p className="text-xs font-semibold uppercase tracking-[0.3em] text-medium-grey">
					{label}
				</p>
			</div>
		</div>
	);
}
