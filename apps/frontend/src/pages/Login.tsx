import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/ui/Toast";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);
    const success = await authService.login(email, password);
    setIsLoading(false);

    if (success) {
      showToast("Login realizado com sucesso!");
      navigate("/dashboard");
    } else {
      setError("E-mail ou senha incorretos.");
    }
  };
  return (
    <div className="bg-background-light font-display antialiased">
      <Helmet>
        <title>Login | Small Breeds</title>
        <meta name="description" content="Acesse sua conta Small Breeds para gerenciar agendamentos e preferências do seu pet." />
        <meta property="og:title" content="Login — Small Breeds" />
      </Helmet>
      <div className="flex min-h-screen w-full flex-row overflow-hidden bg-white">
        {/* Left Side: Image Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900">
          <div className="absolute inset-0 z-10 bg-black/30 mix-blend-multiply"></div>
          {/* Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale contrast-125"
            data-alt="Monochromatic portrait of a sleek Doberman dog in soft studio lighting"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXHSq__JPi9LhhEbeqsUW8ehiKA7PA6TYc6Tn7_W5dHZdKNiEk_7bHOZobbav5MbfMiZHCbNVLDgq2h_uSJfV2XRThEN-06PwNgL89QWYhdiGvV65swDlx63ggNnERkthMUCLYLlLmttLP_VbRh5hMpZKI7zD_NREvwh5mgrxiHqSz9i64czE1X62i6fhBOenHCmSI921H5640jpvbJs20zScOBrJPE9ZiNyreH7gsKCLKABarpVB6gdov36XmjmJ-K3dXBBBLdaE")',
            }}
          ></div>
          <div className="relative z-20 flex flex-col justify-end p-12 text-white/90">
            <blockquote className="max-w-md">
              <p className="text-xl font-light italic leading-relaxed tracking-wide opacity-80">
                "A pureza do coração de uma pessoa pode ser rapidamente medida
                pela forma como ela trata os animais."
              </p>
              <footer className="mt-4 text-sm font-medium tracking-widest uppercase opacity-60">
                — Herança Small Breeds
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Right Side: Content Panel */}
        <div className="flex w-full flex-1 flex-col justify-center items-center bg-white px-8 sm:px-12 lg:w-1/2 lg:px-20 xl:px-32">
          <div className="w-full max-w-[420px] py-10">
            {/* Logo */}
            <div className="mb-10 flex justify-center">
              <Link
                to="/"
                className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity text-black flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-2xl">pets</span>
                PETSHOP{" "}
                <span className="font-light text-neutral-400 underline decoration-black underline-offset-4">
                  SMALL BREEDS
                </span>
              </Link>
            </div>

            {/* Headline */}
            <div className="mb-10 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary">
                Bem-vindo
              </h1>
              <p className="text-neutral-500 font-normal">
                Por favor, insira seus dados para entrar.
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-neutral-100 border border-neutral-200 p-4 text-sm text-charcoal">
                {error}
              </div>
            )}
            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none text-primary"
                  htmlFor="email"
                >
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <input
                    className="flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                    id="email"
                    placeholder="nome@exemplo.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="absolute right-3 top-3 text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none text-primary"
                  htmlFor="password"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    className="flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="absolute right-3 top-3 text-neutral-400 cursor-pointer hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      visibility_off
                    </span>
                  </span>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <a
                  className="text-sm font-medium text-neutral-500 hover:text-primary transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Recuperação de senha enviada para o e-mail!");
                  }}
                >
                  Esqueceu a Senha?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 inline-flex h-12 w-full items-center justify-center bg-black px-8 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all disabled:pointer-events-none disabled:opacity-50 ${isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-neutral-800"
                  }`}
              >
                {isLoading ? "Validando Acesso..." : "Entrar"}
              </button>
            </form>

            {/* Footer / Sign Up */}
            <div className="mt-8 text-center text-sm text-neutral-500">
              Não tem uma conta?{" "}
              <Link
                className="font-semibold text-primary underline decoration-neutral-300 underline-offset-4 hover:decoration-primary transition-all"
                to="/registro"
              >
                Crie uma
              </Link>
            </div>

            {/* Optional Social Login Divider */}
            <div className="relative mt-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-neutral-400 tracking-wider">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="inline-flex h-10 w-full items-center justify-center gap-2 border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-50 focus:outline-none"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Autenticação Google será implementada em breve.");
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Google
              </button>
              <button
                className="inline-flex h-10 w-full items-center justify-center gap-2 border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-50 focus:outline-none"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Autenticação Apple será implementada em breve.");
                }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  ios
                </span>
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
