import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "../components/seo/HelmetCompat";
import Toast from "../components/ui/Toast";
import { authService } from "../services/authService";

const isDemoCredentialsEnabled =
	import.meta.env.VITE_ENABLE_DEMO_CREDENTIALS === "true";

type LoginFieldErrors = {
	email?: string;
	password?: string;
	form?: string;
};

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [notice, setNotice] = useState(() => authService.consumeNotice());
	const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
	const [toastMessage, setToastMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswordRecoveryHint, setShowPasswordRecoveryHint] = useState(false);
	const redirectTarget =
		typeof location.state === "object" &&
		location.state !== null &&
		"from" in location.state &&
		typeof location.state.from === "string"
			? location.state.from
			: "/dashboard";

	const showToast = (message: string) => {
		setToastMessage(message);
		window.setTimeout(() => setToastMessage(""), 3000);
	};

	const copyToClipboard = async (value: string, label: string) => {
		try {
			await navigator.clipboard.writeText(value);
			showToast(`${label} copiado.`);
		} catch {
			showToast("Não foi possível copiar. Selecione e copie manualmente.");
		}
	};

	const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFieldErrors({});
		setShowPasswordRecoveryHint(false);

		const nextErrors: LoginFieldErrors = {};
		if (!email.trim()) {
			nextErrors.email = "Informe seu e-mail.";
		}
		if (!password.trim()) {
			nextErrors.password = "Informe sua senha.";
		}

		if (Object.keys(nextErrors).length > 0) {
			setFieldErrors(nextErrors);
			return;
		}

		setIsLoading(true);
		const result = await authService.login(email.trim(), password);
		setIsLoading(false);

		if (result.ok) {
			showToast("Login realizado com sucesso!");
			navigate(redirectTarget, { replace: true });
			return;
		}

		setFieldErrors({
			form: result.message,
			email: result.errors?.email?.[0],
			password: result.errors?.password?.[0],
		});
	};

	return (
		<div className="bg-background-light font-display antialiased">
			<Helmet>
				<title>Login | Small Breeds</title>
				<meta
					name="description"
					content="Acesse sua conta Small Breeds para gerenciar agendamentos e preferências do seu pet."
				/>
				<meta property="og:title" content="Login — Small Breeds" />
			</Helmet>
			<div className="flex min-h-screen w-full flex-row overflow-hidden bg-white">
				<div className="relative hidden bg-neutral-900 lg:flex lg:w-1/2">
					<div className="absolute inset-0 z-10 bg-black/30 mix-blend-multiply" />
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale contrast-125"
						style={{
							backgroundImage:
								'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXHSq__JPi9LhhEbeqsUW8ehiKA7PA6TYc6Tn7_W5dHZdKNiEk_7bHOZobbav5MbfMiZHCbNVLDgq2h_uSJfV2XRThEN-06PwNgL89QWYhdiGvV65swDlx63ggNnERkthMUCLYLlLmttLP_VbRh5hMpZKI7zD_NREvwh5mgrxiHqSz9i64czE1X62i6fhBOenHCmSI921H5640jpvbJs20zScOBrJPE9ZiNyreH7gsKCLKABarpVB6gdov36XmjmJ-K3dXBBBLdaE")',
						}}
					/>
					<div className="relative z-20 flex flex-col justify-end p-12 text-white/90">
						<blockquote className="max-w-md">
							<p className="text-xl font-light italic leading-relaxed tracking-wide opacity-80">
								&quot;A pureza do coração de uma pessoa pode ser rapidamente medida
								pela forma como ela trata os animais.&quot;
							</p>
							<footer className="mt-4 text-sm font-medium uppercase tracking-widest opacity-60">
								Herança Small Breeds
							</footer>
						</blockquote>
					</div>
				</div>

				<div className="flex w-full flex-1 flex-col items-center justify-center bg-white px-8 sm:px-12 lg:w-1/2 lg:px-20 xl:px-32">
					<div className="w-full max-w-[420px] py-10">
						<div className="mb-10 flex justify-center">
							<Link
								to="/"
								className="flex items-center gap-2 text-2xl tracking-tighter text-black transition-opacity hover:opacity-80"
							>
								<span className="material-symbols-outlined text-2xl">pets</span>
								PETSHOP{" "}
								<span className="font-light text-neutral-400 underline decoration-black underline-offset-4">
									SMALL BREEDS
								</span>
							</Link>
						</div>

						<div className="mb-10 text-center">
							<h1 className="mb-2 text-3xl font-bold tracking-tight text-primary">
								Bem-vindo
							</h1>
							<p className="font-normal text-neutral-500">
								Por favor, insira seus dados para entrar.
							</p>
						</div>

						{fieldErrors.form ? (
							<div
								className="mb-4 border border-neutral-200 bg-neutral-100 p-4 text-sm text-charcoal"
								role="alert"
							>
								{fieldErrors.form}
							</div>
						) : null}

						{notice ? (
							<div
								className="mb-4 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
								role="status"
							>
								<div className="flex items-start gap-3">
									<span className="material-symbols-outlined text-[20px] text-amber-700">
										schedule
									</span>
									<div className="flex-1">
										<p>{notice}</p>
									</div>
									<button
										type="button"
										className="text-amber-700 transition-colors hover:text-amber-900"
										onClick={() => setNotice("")}
										aria-label="Fechar aviso"
									>
										<span className="material-symbols-outlined text-[18px]">
											close
										</span>
									</button>
								</div>
							</div>
						) : null}

						{isDemoCredentialsEnabled ? (
							<section
								className="mb-6 border border-neutral-200 bg-neutral-50/50 p-4"
								aria-label="Credenciais de teste"
							>
								<p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
									Credenciais de teste
								</p>
								<p className="mt-1 text-xs text-neutral-600">
									Disponível apenas em ambiente controlado.
								</p>

								<div className="mt-3 space-y-3">
									<DemoAccountCard
										label="Cliente"
										email="cliente@petshop.com"
										password="cliente123"
										onCopy={copyToClipboard}
									/>
									<div className="h-px bg-neutral-200" />
									<DemoAccountCard
										label="Admin"
										email="admin@petshop.com"
										password="admin123"
										onCopy={copyToClipboard}
									/>
								</div>
							</section>
						) : null}

						<form className="flex flex-col gap-5" onSubmit={handleSignIn} noValidate>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none text-primary"
									htmlFor="login-email"
								>
									Endereço de E-mail
								</label>
								<div className="relative">
									<input
										className="flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm text-black transition-colors duration-200 placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										id="login-email"
										name="petshop_login_email"
										placeholder="nome@exemplo.com"
										type="email"
										inputMode="email"
										autoComplete="email"
										autoCapitalize="none"
										spellCheck={false}
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										aria-invalid={Boolean(fieldErrors.email)}
										aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
									/>
									<span className="absolute right-3 top-3 text-neutral-400">
										<span className="material-symbols-outlined text-[20px]">
											mail
										</span>
									</span>
								</div>
								{fieldErrors.email ? (
									<p id="login-email-error" className="text-sm text-red-600">
										{fieldErrors.email}
									</p>
								) : null}
							</div>

							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none text-primary"
									htmlFor="login-password"
								>
									Senha
								</label>
								<div className="relative">
									<input
										className="flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm text-black transition-colors duration-200 placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										id="login-password"
										name="petshop_login_password"
										placeholder="••••••••"
										type={isPasswordVisible ? "text" : "password"}
										autoComplete="current-password"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
										aria-invalid={Boolean(fieldErrors.password)}
										aria-describedby={
											fieldErrors.password ? "login-password-error" : undefined
										}
									/>
									<button
										type="button"
										className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center text-neutral-400 transition-colors hover:text-primary"
										aria-label={
											isPasswordVisible ? "Ocultar caracteres" : "Mostrar caracteres"
										}
										aria-pressed={isPasswordVisible}
										onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
									>
										<span className="material-symbols-outlined text-[20px]">
											{isPasswordVisible ? "visibility" : "visibility_off"}
										</span>
									</button>
								</div>
								{fieldErrors.password ? (
									<p id="login-password-error" className="text-sm text-red-600">
										{fieldErrors.password}
									</p>
								) : null}
							</div>

							<div className="flex items-center justify-end">
								<button
									type="button"
									className="cursor-pointer text-sm font-medium text-neutral-500 transition-colors hover:text-primary"
									onClick={() => setShowPasswordRecoveryHint(true)}
								>
									Esqueceu a Senha?
								</button>
							</div>
							{showPasswordRecoveryHint ? (
								<p className="text-sm text-neutral-500" role="status">
									Recuperação de senha ainda não está disponível neste projeto.
								</p>
							) : null}

							<button
								type="submit"
								disabled={isLoading}
								className={`mt-2 inline-flex h-12 w-full items-center justify-center bg-black px-8 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all disabled:pointer-events-none disabled:opacity-50 ${
									isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-neutral-800"
								}`}
							>
								{isLoading ? "Validando Acesso..." : "Entrar"}
							</button>
						</form>

						<div className="mt-8 text-center text-sm text-neutral-500">
							Não tem uma conta?{" "}
							<Link
								className="font-semibold text-primary underline decoration-neutral-300 underline-offset-4 transition-all hover:decoration-primary"
								to="/registro"
							>
								Crie uma
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Toast message={toastMessage} />
		</div>
	);
}

function DemoAccountCard({
	label,
	email,
	password,
	onCopy,
}: {
	label: string;
	email: string;
	password: string;
	onCopy: (value: string, label: string) => Promise<void>;
}) {
	return (
		<div className="flex items-start justify-between gap-3">
			<div className="min-w-0">
				<p className="text-xs font-semibold text-neutral-800">{label}</p>
				<p className="break-all font-mono text-xs text-neutral-700">{email}</p>
				<p className="break-all font-mono text-xs text-neutral-700">{password}</p>
			</div>
			<div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
				<button
					type="button"
					className="h-9 w-full border border-neutral-200 bg-white px-3 text-xs font-semibold transition-colors hover:bg-neutral-50"
					onClick={() => onCopy(email, "E-mail")}
				>
					Copiar e-mail
				</button>
				<button
					type="button"
					className="h-9 w-full border border-neutral-200 bg-white px-3 text-xs font-semibold transition-colors hover:bg-neutral-50"
					onClick={() => onCopy(password, "Senha")}
				>
					Copiar senha
				</button>
			</div>
		</div>
	);
}
