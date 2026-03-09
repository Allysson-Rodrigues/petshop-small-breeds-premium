import { useState } from "react";
import { Helmet } from "../components/seo/HelmetCompat";
import RevealSection from "../components/ui/RevealSection";
import { isApiError } from "../services/api";
import { publicService } from "../services/publicService";
import type { BookingRequestInput, BookingRequestResponse } from "../types/api";

type BookingFormState = {
	petName: string;
	petBreed: string;
	serviceType: string;
	preferredDate: string;
	preferredPeriod: "" | "manha" | "tarde";
	ownerName: string;
	ownerEmail: string;
	ownerPhone: string;
	notes: string;
};

type BookingFieldErrors = Partial<Record<keyof BookingFormState, string>> & {
	form?: string;
};

const pickFirstFieldErrors = (
	errors?: Record<string, string[]>,
): BookingFieldErrors => {
	if (!errors) {
		return {};
	}

	return Object.fromEntries(
		Object.entries(errors).map(([key, messages]) => [key, messages[0] ?? ""]),
	) as BookingFieldErrors;
};

const initialFormState: BookingFormState = {
	petName: "",
	petBreed: "",
	serviceType: "",
	preferredDate: "",
	preferredPeriod: "",
	ownerName: "",
	ownerEmail: "",
	ownerPhone: "",
	notes: "",
};

export default function Agendamento() {
	const [form, setForm] = useState<BookingFormState>(initialFormState);
	const [submitting, setSubmitting] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<BookingFieldErrors>({});
	const [successPayload, setSuccessPayload] =
		useState<BookingRequestResponse | null>(null);

	const setFieldValue = <K extends keyof BookingFormState>(
		field: K,
		value: BookingFormState[K],
	) => {
		setForm((currentForm) => ({
			...currentForm,
			[field]: value,
		}));
	};

	const validateForm = (): BookingFieldErrors => {
		const errors: BookingFieldErrors = {};

		if (!form.petName.trim()) {
			errors.petName = "Informe o nome do pet.";
		}
		if (!form.petBreed.trim()) {
			errors.petBreed = "Informe a raça do pet.";
		}
		if (!form.serviceType.trim()) {
			errors.serviceType = "Selecione um serviço.";
		}
		if (!form.preferredDate) {
			errors.preferredDate = "Selecione uma data preferida.";
		}
		if (!form.preferredPeriod) {
			errors.preferredPeriod = "Selecione um período.";
		}
		if (!form.ownerName.trim()) {
			errors.ownerName = "Informe o nome do tutor.";
		}
		if (!form.ownerEmail.trim()) {
			errors.ownerEmail = "Informe o e-mail do tutor.";
		}

		return errors;
	};

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFieldErrors({});
		setSuccessPayload(null);

		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setFieldErrors(validationErrors);
			return;
		}

		const bookingPayload: BookingRequestInput = {
			petName: form.petName.trim(),
			petBreed: form.petBreed.trim(),
			serviceType: form.serviceType,
			preferredDate: new Date(`${form.preferredDate}T12:00:00`).toISOString(),
			preferredPeriod: form.preferredPeriod as "manha" | "tarde",
			ownerName: form.ownerName.trim(),
			ownerEmail: form.ownerEmail.trim(),
			ownerPhone: form.ownerPhone.trim() || undefined,
			notes: form.notes.trim() || undefined,
		};

		setSubmitting(true);
		try {
			const response = await publicService.createBookingRequest(bookingPayload);
			setSuccessPayload(response);
			setForm(initialFormState);
		} catch (error) {
			if (isApiError(error)) {
				setFieldErrors({
					form: error.message,
					...pickFirstFieldErrors(error.errors),
				});
			} else {
				setFieldErrors({
					form: "Não foi possível enviar sua solicitação. Tente novamente.",
				});
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-white font-sans text-charcoal">
			<Helmet>
				<title>Agendamento | Small Breeds</title>
				<meta
					name="description"
					content="Reserve um horário exclusivo para seu pet de raça pequena. Atendimento premium com conforto e atenção total."
				/>
				<meta property="og:title" content="Agendamento — Small Breeds" />
			</Helmet>

			<section className="border-b border-border-grey bg-light-grey pb-20 pt-32">
				<div className="mx-auto max-w-3xl px-6 text-center">
					<RevealSection>
						<h2 className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-medium-grey">
							Concierge
						</h2>
						<h1 className="mb-6 text-4xl font-display font-light tracking-tight text-black md:text-5xl">
							Agendamento Exclusivo
						</h1>
						<p className="text-lg font-light leading-relaxed text-medium-grey">
							Reserve um momento de cuidado premium para seu cão de pequeno porte.
							Nossos horários são desenhados para garantir que seu companheiro
							receba atenção total, sem pressa e com o máximo de conforto.
						</p>
					</RevealSection>
				</div>
			</section>

			<section className="mx-auto flex w-full max-w-3xl flex-1 px-6 py-20">
				<div className="w-full">
					{successPayload ? (
						<div
							className="mb-10 flex flex-col items-center gap-4 border border-neutral-800 bg-black p-6 text-center text-white"
							role="status"
						>
							<span className="material-symbols-outlined text-4xl font-light">
								check_circle
							</span>
							<div>
								<h3 className="mb-1 text-lg font-medium tracking-tight">
									Reserva Solicitada
								</h3>
								<p className="text-sm font-light text-neutral-400">
									Sua solicitação foi enviada com sucesso. Protocolo{" "}
									<strong className="text-white">{successPayload.protocol}</strong>.
									Nossa equipe retornará em até 24h.
								</p>
							</div>
						</div>
					) : null}

					{fieldErrors.form ? (
						<div
							className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
							role="alert"
						>
							{fieldErrors.form}
						</div>
					) : null}

					<form className="space-y-10" onSubmit={handleFormSubmit} noValidate>
						<RevealSection>
							<div className="border-b border-border-grey pb-10">
								<h3 className="mb-8 border-l-2 border-black pl-3 text-lg font-medium tracking-tight text-black">
									Informações do Companheiro
								</h3>
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
									<Field
										id="petName"
										label="Nome do Pet"
										placeholder="Ex: Duque"
										value={form.petName}
										error={fieldErrors.petName}
										onChange={(value) => setFieldValue("petName", value)}
									/>
									<Field
										id="petBreed"
										label="Raça"
										placeholder="Ex: Yorkshire Terrier"
										value={form.petBreed}
										error={fieldErrors.petBreed}
										onChange={(value) => setFieldValue("petBreed", value)}
									/>
								</div>
							</div>
						</RevealSection>

						<RevealSection delay={100}>
							<div className="border-b border-border-grey pb-10">
								<h3 className="mb-8 border-l-2 border-black pl-3 text-lg font-medium tracking-tight text-black">
									Detalhes do Serviço
								</h3>
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
									<div className="space-y-3 md:col-span-2">
										<label
											htmlFor="serviceType"
											className="block text-[10px] font-bold uppercase tracking-widest text-medium-grey"
										>
											Serviço Desejado
										</label>
										<div className="relative">
											<select
												id="serviceType"
												className="w-full cursor-pointer appearance-none border-b border-medium-grey/40 bg-transparent py-3 text-black outline-none transition-colors focus:border-black"
												value={form.serviceType}
												onChange={(event) =>
													setFieldValue("serviceType", event.target.value)
												}
												aria-invalid={Boolean(fieldErrors.serviceType)}
												aria-describedby={
													fieldErrors.serviceType ? "serviceType-error" : undefined
												}
											>
												<option value="">Selecione um pacote de cuidado...</option>
												<option value="banho">
													Banho de Luxo com Cromoterapia
												</option>
												<option value="tosa_artesanal">
													Tosa Artesanal na Tesoura
												</option>
												<option value="spa">
													Spa Day Completo (Banho, Tosa e Ozonioterapia)
												</option>
												<option value="vet">
													Consulta Veterinária Preventiva
												</option>
											</select>
											<span className="pointer-events-none absolute right-0 top-3 text-medium-grey material-symbols-outlined">
												expand_more
											</span>
										</div>
										{fieldErrors.serviceType ? (
											<p id="serviceType-error" className="text-sm text-red-600">
												{fieldErrors.serviceType}
											</p>
										) : null}
									</div>
									<Field
										id="preferredDate"
										label="Data Preferida"
										type="date"
										value={form.preferredDate}
										error={fieldErrors.preferredDate}
										onChange={(value) => setFieldValue("preferredDate", value)}
									/>
									<div className="space-y-3">
										<label
											htmlFor="preferredPeriod"
											className="block text-[10px] font-bold uppercase tracking-widest text-medium-grey"
										>
											Período
										</label>
										<div className="relative">
											<select
												id="preferredPeriod"
												className="w-full cursor-pointer appearance-none border-b border-medium-grey/40 bg-transparent py-3 text-black outline-none transition-colors focus:border-black"
												value={form.preferredPeriod}
												onChange={(event) =>
													setFieldValue(
														"preferredPeriod",
														event.target.value as BookingFormState["preferredPeriod"],
													)
												}
												aria-invalid={Boolean(fieldErrors.preferredPeriod)}
												aria-describedby={
													fieldErrors.preferredPeriod
														? "preferredPeriod-error"
														: undefined
												}
											>
												<option value="">Selecione o turno...</option>
												<option value="manha">Manhã (09h - 12h)</option>
												<option value="tarde">Tarde (13h - 18h)</option>
											</select>
											<span className="pointer-events-none absolute right-0 top-3 text-medium-grey material-symbols-outlined">
												expand_more
											</span>
										</div>
										{fieldErrors.preferredPeriod ? (
											<p
												id="preferredPeriod-error"
												className="text-sm text-red-600"
											>
												{fieldErrors.preferredPeriod}
											</p>
										) : null}
									</div>
								</div>
							</div>
						</RevealSection>

						<RevealSection delay={160}>
							<div className="border-b border-border-grey pb-10">
								<h3 className="mb-8 border-l-2 border-black pl-3 text-lg font-medium tracking-tight text-black">
									Dados do Tutor
								</h3>
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
									<Field
										id="ownerName"
										label="Nome do Tutor"
										placeholder="Seu nome completo"
										value={form.ownerName}
										error={fieldErrors.ownerName}
										onChange={(value) => setFieldValue("ownerName", value)}
									/>
									<Field
										id="ownerEmail"
										label="E-mail"
										type="email"
										placeholder="nome@exemplo.com"
										value={form.ownerEmail}
										error={fieldErrors.ownerEmail}
										onChange={(value) => setFieldValue("ownerEmail", value)}
									/>
									<Field
										id="ownerPhone"
										label="Telefone"
										placeholder="(11) 99999-9999"
										value={form.ownerPhone}
										error={fieldErrors.ownerPhone}
										onChange={(value) => setFieldValue("ownerPhone", value)}
									/>
									<div className="space-y-3 md:col-span-2">
										<label
											htmlFor="notes"
											className="block text-[10px] font-bold uppercase tracking-widest text-medium-grey"
										>
											Observações
										</label>
										<textarea
											id="notes"
											className="min-h-28 w-full border border-medium-grey/30 px-4 py-3 text-black outline-none transition-colors focus:border-black"
											placeholder="Conte detalhes relevantes sobre rotina, cuidados ou restrições."
											value={form.notes}
											onChange={(event) => setFieldValue("notes", event.target.value)}
											aria-invalid={Boolean(fieldErrors.notes)}
											aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
										/>
										{fieldErrors.notes ? (
											<p id="notes-error" className="text-sm text-red-600">
												{fieldErrors.notes}
											</p>
										) : null}
									</div>
								</div>
							</div>
						</RevealSection>

						<RevealSection delay={220}>
							<div className="pt-8">
								<button
									type="submit"
									disabled={submitting}
									className={`flex w-full items-center justify-center gap-3 py-5 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors ${
										submitting
											? "cursor-wait bg-black opacity-70"
											: "btn-magnetic border border-charcoal bg-black"
									}`}
									aria-busy={submitting}
								>
									{submitting ? (
										<>
											<span className="material-symbols-outlined animate-spin text-sm">
												autorenew
											</span>
											Enviando Solicitação...
										</>
									) : (
										"Confirmar Solicitação de Reserva"
									)}
								</button>
								<p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-medium-grey">
									*Atendimentos sujeitos à aprovação da diretoria clínica.
								</p>
							</div>
						</RevealSection>
					</form>
				</div>
			</section>
		</div>
	);
}

function Field({
	id,
	label,
	value,
	onChange,
	error,
	placeholder,
	type = "text",
}: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	placeholder?: string;
	type?: "text" | "email" | "date";
}) {
	return (
		<div className="space-y-3">
			<label
				htmlFor={id}
				className="block text-[10px] font-bold uppercase tracking-widest text-medium-grey"
			>
				{label}
			</label>
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				className="w-full border-b border-medium-grey/40 bg-transparent py-3 text-black transition-colors placeholder:text-neutral-300 focus:border-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${id}-error` : undefined}
			/>
			{error ? (
				<p id={`${id}-error`} className="text-sm text-red-600">
					{error}
				</p>
			) : null}
		</div>
	);
}
