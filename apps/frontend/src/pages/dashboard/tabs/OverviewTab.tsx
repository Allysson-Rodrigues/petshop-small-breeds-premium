import { useAuth } from "../../../hooks/useAuth";
import NotionAvatar from "../components/NotionAvatar";
import { useOverviewData } from "../hooks/useDashboardData";

interface OverviewTabProps {
	showToast: (message: string) => void;
	setActiveTab: (tab: string) => void;
}

const activityToneClassNames = {
	info: "border-blue-100 bg-blue-50 text-blue-700",
	success: "border-emerald-100 bg-emerald-50 text-emerald-700",
	warning: "border-amber-100 bg-amber-50 text-amber-700",
} as const;

const activityToneDotClassNames = {
	info: "bg-blue-500",
	success: "bg-emerald-500",
	warning: "bg-amber-500",
} as const;

const activityKindLabels = {
	appointment: "Agenda",
	client: "Cliente",
} as const;

function formatDateLabel(date: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
	}).format(new Date(`${date}T12:00:00`));
}

function formatDateTimeLabel(date: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
	}).format(new Date(date));
}

function getHistoryBarHeight(value: number, maxValue: number) {
	if (value <= 0 || maxValue <= 0) {
		return "0%";
	}

	return `${Math.max((value / maxValue) * 100, 12)}%`;
}

export default function OverviewTab({
	showToast,
	setActiveTab,
}: OverviewTabProps) {
	const { isAdmin } = useAuth();
	const { adminData, data, loading } = useOverviewData(isAdmin, showToast);

	const adminOverview = adminData ?? {
		lowStockProducts: [],
		operationalHistory: [],
		recentActivity: [],
		recentPets: [],
		stats: {
			completedAppointments: 0,
			lowStockItems: 0,
			newClientsThisMonth: 0,
			todayAppointments: 0,
			totalAppointments: 0,
			totalClients: 0,
			totalPets: 0,
			totalProducts: 0,
			upcomingAppointments: 0,
		},
	};

	const customerOverview = data ?? {
		appointments: [],
		pets: [],
		stats: {
			nextAppointment: null,
			totalAppointments: 0,
			totalPets: 0,
		},
	};

	const stats = isAdmin
		? {
				lowStock: adminOverview.stats.lowStockItems,
				totalAppointments: adminOverview.stats.totalAppointments,
				totalClients: adminOverview.stats.totalClients,
				totalPets: adminOverview.stats.totalPets,
				totalProducts: adminOverview.stats.totalProducts,
			}
		: {
				lowStock: 0,
				nextAppointment: customerOverview.stats.nextAppointment,
				totalAppointments: customerOverview.stats.totalAppointments,
				totalClients: 0,
				totalPets: customerOverview.stats.totalPets,
				totalProducts: 0,
			};

	const maxHistoryValue = Math.max(
		1,
		...adminOverview.operationalHistory.flatMap((historyPoint) => [
			historyPoint.appointments,
			historyPoint.newClients,
		]),
	);
	const visibleLowStockProducts = adminOverview.lowStockProducts.slice(0, 3);
	const hiddenLowStockProductsCount = Math.max(
		adminOverview.lowStockProducts.length - visibleLowStockProducts.length,
		0,
	);
	const visibleRecentActivity = adminOverview.recentActivity.slice(0, 3);
	const hiddenRecentActivityCount = Math.max(
		adminOverview.recentActivity.length - visibleRecentActivity.length,
		0,
	);

	return (
		<div className="mx-auto flex max-w-7xl flex-col gap-6 md:gap-8">
			<div>
				<h1 className="text-xl font-bold tracking-tight text-primary md:text-2xl">
					{isAdmin ? "Painel Administrativo" : "Visão Geral do Painel"}
				</h1>
				<p className="mt-1 text-xs text-gray-500 md:text-sm">
					{isAdmin
						? "Gestão global do Petshop com leitura operacional do painel."
						: "Bem-vindo de volta, veja o que está acontecendo hoje."}
				</p>
			</div>

			{loading ? (
				<div className="flex h-40 items-center justify-center text-sm text-gray-400 animate-pulse">
					Carregando indicadores...
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
						{!isAdmin ? (
							<>
								<Card icon="pets" label="Meus Pets" value={stats.totalPets} />
								<Card
									icon="event_available"
									label="Agendamentos"
									value={stats.totalAppointments}
								/>
								<div className="relative h-28 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white p-5 shadow-sm transition-shadow group hover:shadow-md md:h-32 md:p-6 sm:col-span-2 lg:col-span-2">
									<div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
										<span className="material-symbols-outlined text-5xl text-primary md:text-6xl">
											schedule
										</span>
									</div>
									<p className="text-xs font-medium text-gray-500 md:text-sm">
										Próximo Agendamento
									</p>
									<h2 className="text-lg font-bold tracking-tight text-primary md:text-xl">
										{"nextAppointment" in stats && stats.nextAppointment
											? new Date(stats.nextAppointment.date).toLocaleDateString(
													"pt-BR",
													{
														day: "2-digit",
														hour: "2-digit",
														minute: "2-digit",
														month: "short",
													},
												)
											: "Nenhum"}
									</h2>
								</div>
							</>
						) : (
							<>
								<Card icon="group" label="Total Clientes" value={stats.totalClients} />
								<Card icon="pets" label="Pets Totais" value={stats.totalPets} />
								<Card
									icon="inventory_2"
									label="Itens em Estoque"
									value={stats.totalProducts}
								/>
								<div
									className={`relative flex h-28 flex-col justify-between overflow-hidden rounded-xl border p-5 transition-all group hover:shadow-md md:h-32 md:p-6 ${
										stats.lowStock > 0
											? "border-red-100 bg-red-50"
											: "border-[#e5e5e5] bg-white"
									}`}
								>
									<div className="absolute right-0 top-0 p-4 opacity-10">
										<span
											className={`material-symbols-outlined text-5xl md:text-6xl ${
												stats.lowStock > 0 ? "text-red-500" : "text-primary"
											}`}
										>
											warning
										</span>
									</div>
									<p
										className={`text-xs font-medium md:text-sm ${
											stats.lowStock > 0 ? "text-red-600" : "text-gray-500"
										}`}
									>
										Alerta de Estoque
									</p>
									<h2
										className={`text-2xl font-bold tracking-tight md:text-3xl ${
											stats.lowStock > 0 ? "text-red-700" : "text-primary"
										}`}
									>
										{stats.lowStock}{" "}
										<span className="text-xs font-normal">críticos</span>
									</h2>
								</div>
							</>
						)}
					</div>

					{isAdmin ? (
						<div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
							<div className="space-y-6 xl:col-span-2">
								<section className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
										<div>
											<h2 className="text-lg font-bold text-primary">
												Indicadores operacionais
											</h2>
											<p className="text-xs text-gray-500">
												Métricas reais derivadas da agenda, base de clientes e
												estoque.
											</p>
										</div>
										<span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
											Dados do painel
										</span>
									</div>

									<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
										<AdminMetricCard
											description="Compromissos com data de hoje."
											icon="today"
											label="Hoje na agenda"
											value={adminOverview.stats.todayAppointments}
										/>
										<AdminMetricCard
											description="Pendentes ou confirmados a partir de agora."
											icon="upcoming"
											label="Próximos"
											value={adminOverview.stats.upcomingAppointments}
										/>
										<AdminMetricCard
											description="Serviços já marcados como concluídos."
											icon="task_alt"
											label="Concluídos"
											value={adminOverview.stats.completedAppointments}
										/>
										<AdminMetricCard
											description="Cadastros do mês corrente."
											icon="person_add"
											label="Novos clientes"
											value={adminOverview.stats.newClientsThisMonth}
										/>
									</div>
								</section>

								<section className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
										<div>
											<h2 className="text-lg font-bold text-primary">
												Histórico operacional
											</h2>
											<p className="text-xs text-gray-500">
												Últimos 7 dias de agenda e entrada de clientes.
											</p>
										</div>
										<div className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
											<span className="flex items-center gap-1">
												<span className="h-2 w-2 rounded-full bg-primary" />
												Agenda
											</span>
											<span className="flex items-center gap-1">
												<span className="h-2 w-2 rounded-full bg-emerald-500" />
												Clientes
											</span>
										</div>
									</div>

									{adminOverview.operationalHistory.length > 0 ? (
										<div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-7">
											{adminOverview.operationalHistory.map((historyPoint) => (
												<div
													key={historyPoint.date}
													className="rounded-xl border border-[#e5e5e5] bg-gray-50/60 p-4"
												>
													<p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
														{formatDateLabel(historyPoint.date)}
													</p>
													<div className="mt-4 flex h-28 items-end gap-2">
														<div className="flex flex-1 items-end">
															<div
																className="w-full rounded-t-md bg-primary"
																style={{
																	height: getHistoryBarHeight(
																		historyPoint.appointments,
																		maxHistoryValue,
																	),
																}}
															/>
														</div>
														<div className="flex flex-1 items-end">
															<div
																className="w-full rounded-t-md bg-emerald-500"
																style={{
																	height: getHistoryBarHeight(
																		historyPoint.newClients,
																		maxHistoryValue,
																	),
																}}
															/>
														</div>
													</div>
													<div className="mt-3 space-y-1 text-xs">
														<div className="flex items-center justify-between text-gray-500">
															<span>Agenda</span>
															<span className="font-semibold text-primary">
																{historyPoint.appointments}
															</span>
														</div>
														<div className="flex items-center justify-between text-gray-500">
															<span>Clientes</span>
															<span className="font-semibold text-emerald-600">
																{historyPoint.newClients}
															</span>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="mt-5 rounded-xl border border-dashed border-[#e5e5e5] px-4 py-6 text-center text-sm text-gray-400">
											Sem volume suficiente para montar histórico ainda.
										</div>
									)}
								</section>

								<div>
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-lg font-bold text-primary">
											Pets Recentes
										</h2>
										<button
											className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-all hover:text-primary"
											onClick={() => setActiveTab("pets")}
										>
											Ver todos{" "}
											<span className="material-symbols-outlined text-[16px]">
												arrow_forward
											</span>
										</button>
									</div>
									<div className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-sm">
										{adminOverview.recentPets.length > 0 ? (
											<div className="overflow-x-auto">
												<table className="w-full text-left text-sm">
													<thead className="border-b border-[#e5e5e5] bg-gray-50 text-xs font-medium uppercase text-gray-500">
														<tr>
															<th className="px-4 py-4 md:px-6">Pet</th>
															<th className="px-4 py-4 md:px-6">Raça</th>
															<th className="px-4 py-4 text-right md:px-6">
																Idade
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-[#e5e5e5]">
														{adminOverview.recentPets.map((pet) => (
															<tr
																key={pet.id}
																className="transition-all hover:bg-gray-50/50"
															>
																<td className="flex items-center gap-2 px-4 py-4 md:px-6">
																	<NotionAvatar
																		breed={pet.breed}
																		name={pet.name}
																		size="sm"
																		type="pet"
																	/>
																	<span className="font-medium text-primary">
																		{pet.name}
																	</span>
																</td>
																<td className="px-4 py-4 text-gray-600 md:px-6">
																	{pet.breed}
																</td>
																<td className="px-4 py-4 text-right font-mono text-[10px] text-gray-600 md:px-6 md:text-sm">
																	{pet.age} {pet.age === 1 ? "ano" : "anos"}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										) : (
											<div className="p-8 text-center text-gray-400">
												Nenhum pet encontrado.
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="space-y-6 xl:self-start">
								<section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
									<h3 className="mb-4 flex items-center gap-2 font-bold text-primary">
										<span className="material-symbols-outlined text-primary">
											bolt
										</span>
										Atalhos
									</h3>
									<div className="space-y-3">
										<button
											className="group w-full rounded-xl border border-[#e5e5e5] p-4 text-left transition-all hover:border-primary/30 hover:bg-gray-50"
											onClick={() => setActiveTab("inventory")}
										>
											<p className="text-sm font-bold group-hover:text-primary">
												Inventário
											</p>
											<p className="text-xs text-gray-500">
												Gestão de estoque e itens críticos.
											</p>
										</button>
										<button
											className="group w-full rounded-xl border border-[#e5e5e5] p-4 text-left transition-all hover:border-primary/30 hover:bg-gray-50"
											onClick={() => setActiveTab("clients")}
										>
											<p className="text-sm font-bold group-hover:text-primary">
												Clientes
											</p>
											<p className="text-xs text-gray-500">
												Base cadastral e acompanhamento comercial.
											</p>
										</button>
										<button
											className="group w-full rounded-xl border border-[#e5e5e5] p-4 text-left transition-all hover:border-primary/30 hover:bg-gray-50"
											onClick={() => setActiveTab("appointments")}
										>
											<p className="text-sm font-bold group-hover:text-primary">
												Agenda
											</p>
											<p className="text-xs text-gray-500">
												Operação diária e solicitações públicas.
											</p>
										</button>
									</div>
								</section>

								<section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
									<div className="mb-4 flex items-start justify-between gap-3">
										<div>
											<h3 className="font-bold text-primary">
												Estoque em atenção
											</h3>
											<p className="text-xs text-gray-500">
												Itens abaixo do limite seguro.
											</p>
										</div>
										<span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
											{adminOverview.stats.lowStockItems} crítico(s)
										</span>
									</div>

									{adminOverview.lowStockProducts.length > 0 ? (
										<div className="space-y-3">
											{visibleLowStockProducts.map((product) => (
												<div
													key={product.id}
													className="rounded-xl border border-red-100 bg-red-50/70 p-4"
												>
													<div className="flex items-center justify-between gap-3">
														<div>
															<p className="font-semibold text-red-900">
																{product.name}
															</p>
															<p className="text-xs uppercase tracking-[0.18em] text-red-500">
																{product.category}
															</p>
														</div>
														<span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-red-700">
															{product.stock} un.
														</span>
													</div>
												</div>
											))}
											{hiddenLowStockProductsCount > 0 ? (
												<button
													className="w-full rounded-xl border border-dashed border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
													onClick={() => setActiveTab("inventory")}
												>
													Ver mais {hiddenLowStockProductsCount} item(ns) no
													inventário
												</button>
											) : null}
										</div>
									) : (
										<div className="rounded-xl border border-dashed border-[#e5e5e5] px-4 py-6 text-center text-sm text-gray-400">
											Estoque estável no momento.
										</div>
									)}
								</section>

								<section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
									<div className="mb-4 flex items-start justify-between gap-3">
										<div>
											<h3 className="font-bold text-primary">Atividade recente</h3>
											<p className="text-xs text-gray-500">
												Eventos reais do fluxo operacional mais recente.
											</p>
										</div>
										<span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
											{adminOverview.recentActivity.length} item(ns)
										</span>
									</div>

									{adminOverview.recentActivity.length > 0 ? (
										<div className="space-y-2">
											{visibleRecentActivity.map((activityItem) => (
												<div
													key={activityItem.id}
													className={`rounded-lg border p-3 ${
														activityToneClassNames[activityItem.tone]
													}`}
												>
													<div className="flex items-start gap-3">
														<span
															className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
																activityToneDotClassNames[activityItem.tone]
															}`}
															aria-hidden="true"
														/>
														<div className="min-w-0 flex-1">
															<div className="flex flex-wrap items-start justify-between gap-2">
																<div className="min-w-0">
																	<p className="text-sm font-semibold leading-snug">
																		{activityItem.title}
																	</p>
																	<p
																		className="mt-1 truncate text-xs opacity-90"
																		title={activityItem.description}
																	>
																		{activityItem.description}
																	</p>
																</div>
																<span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
																	{activityKindLabels[activityItem.kind]}
																</span>
															</div>
															<p className="mt-2 text-[11px] font-medium opacity-80">
																{formatDateTimeLabel(activityItem.occurredAt)}
															</p>
														</div>
													</div>
												</div>
											))}
											{hiddenRecentActivityCount > 0 ? (
												<button
													className="w-full rounded-xl border border-dashed border-[#d9e6ff] px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-blue-50"
													onClick={() => setActiveTab("appointments")}
												>
													Ver mais {hiddenRecentActivityCount} evento(s) na agenda
												</button>
											) : null}
										</div>
									) : (
										<div className="rounded-xl border border-dashed border-[#e5e5e5] px-4 py-6 text-center text-sm text-gray-400">
											A atividade operacional aparecerá aqui conforme o uso do
											painel.
										</div>
									)}
								</section>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-bold text-primary">Pets Recentes</h2>
								<button
									className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-all hover:text-primary"
									onClick={() => setActiveTab("pets")}
								>
									Ver todos{" "}
									<span className="material-symbols-outlined text-[16px]">
										arrow_forward
									</span>
								</button>
							</div>
							<div className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-sm">
								{customerOverview.pets.length > 0 ? (
									<div className="overflow-x-auto">
										<table className="w-full text-left text-sm">
											<thead className="border-b border-[#e5e5e5] bg-gray-50 text-xs font-medium uppercase text-gray-500">
												<tr>
													<th className="px-4 py-4 md:px-6">Pet</th>
													<th className="px-4 py-4 md:px-6">Raça</th>
													<th className="px-4 py-4 text-right md:px-6">
														Idade
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-[#e5e5e5]">
												{customerOverview.pets.slice(0, 5).map((pet) => (
													<tr
														key={pet.id}
														className="transition-all hover:bg-gray-50/50"
													>
														<td className="flex items-center gap-2 px-4 py-4 md:px-6">
															<NotionAvatar
																breed={pet.breed}
																name={pet.name}
																size="sm"
																type="pet"
															/>
															<span className="font-medium text-primary">
																{pet.name}
															</span>
														</td>
														<td className="px-4 py-4 text-gray-600 md:px-6">
															{pet.breed}
														</td>
														<td className="px-4 py-4 text-right font-mono text-[10px] text-gray-600 md:px-6 md:text-sm">
															{pet.age} {pet.age === 1 ? "ano" : "anos"}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<div className="p-8 text-center text-gray-400">
										Nenhum pet encontrado.
									</div>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function AdminMetricCard({
	description,
	icon,
	label,
	value,
}: {
	description: string;
	icon: string;
	label: string;
	value: number;
}) {
	return (
		<div className="rounded-xl border border-[#e5e5e5] bg-gray-50/70 p-4">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
						{label}
					</p>
					<p className="mt-3 text-3xl font-bold tracking-tight text-primary">
						{value}
					</p>
				</div>
				<span className="material-symbols-outlined text-2xl text-primary/80">
					{icon}
				</span>
			</div>
			<p className="mt-3 text-xs text-gray-500">{description}</p>
		</div>
	);
}

function Card({
	icon,
	label,
	value,
}: {
	icon: string;
	label: string;
	value: string | number;
}) {
	return (
		<div className="relative flex h-28 flex-col justify-between overflow-hidden rounded-xl border border-[#e5e5e5] bg-white p-5 shadow-sm transition-shadow group hover:shadow-md md:h-32 md:p-6">
			<div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
				<span className="material-symbols-outlined text-5xl text-primary md:text-6xl">
					{icon}
				</span>
			</div>
			<p className="text-xs font-medium text-gray-500 md:text-sm">{label}</p>
			<h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
				{value}
			</h2>
		</div>
	);
}
