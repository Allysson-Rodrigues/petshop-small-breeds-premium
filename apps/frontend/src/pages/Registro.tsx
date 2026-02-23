import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Registro() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !password) {
      setError("Por favor, preencha todos os campos corretamente.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(name, email, password);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setSuccess(true);
      navigate("/login");
    } catch {
      setError("Ocorreu um erro ao criar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light font-display antialiased">
      <Helmet>
        <title>Criar Conta | Small Breeds</title>
        <meta name="description" content="Crie sua conta no Petshop Small Breeds e agende cuidados exclusivos para seu pet." />
        <meta property="og:title" content="Criar Conta — Small Breeds" />
      </Helmet>
      <div className="flex min-h-screen w-full flex-row overflow-hidden bg-white">
        {/* Left Side: Image Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 border-r border-[#e5e5e5]">
          <div className="absolute inset-0 z-10 bg-black/40 mix-blend-multiply"></div>
          {/* Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale contrast-125"
            data-alt="Monochromatic portrait of an elegant Greyhound"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=1500&grayscale=true")',
            }}
          ></div>
          <div className="relative z-20 flex flex-col justify-end p-12 text-white/90">
            <blockquote className="max-w-md">
              <p className="text-xl font-light italic leading-relaxed tracking-wide opacity-90">
                "O amor mais doce é encontrado nas menores patas."
              </p>
              <footer className="mt-4 text-sm font-medium tracking-widest uppercase opacity-60">
                — Comunidade Small Breeds
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Right Side: Content Panel */}
        <div className="flex w-full flex-1 flex-col justify-center items-center bg-white px-8 sm:px-12 lg:w-1/2 lg:px-20 xl:px-32 relative">
          <div className="w-full max-w-[420px] py-10 z-10">
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
                Novo Membro
              </h1>
              <p className="text-neutral-500 font-normal">
                Insira seus detalhes para criar a sua conta.
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-neutral-100 border border-neutral-200 p-4 text-sm text-charcoal">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-neutral-100 border border-neutral-200 p-4 text-sm text-black text-center uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-black">
                  check_circle
                </span>
                Criado com sucesso! Redirecionando...
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSignUp}>
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none text-primary"
                  htmlFor="name"
                >
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">
                      person
                    </span>
                  </span>
                  <input
                    className="flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-3 pl-10 text-sm placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
                    id="name"
                    placeholder="Seu nome completo"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none text-primary"
                  htmlFor="email"
                >
                  E-mail
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </span>
                  <input
                    className="flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-3 pl-10 text-sm placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
                    id="email"
                    placeholder="nome@exemplo.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">
                      lock
                    </span>
                  </span>
                  <input
                    className="flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-3 pl-10 text-sm placeholder:text-neutral-400 focus:border-black focus:outline-none transition-colors"
                    id="password"
                    placeholder="••••••••"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-neutral-400 hover:text-primary transition-colors"
                    aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isPasswordVisible ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-neutral-400"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-neutral-500 font-light leading-snug"
                >
                  Confirmando o cadastro, dou permissão ao Petshop e concordo
                  com os Termos e Políticas de Privacidade.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-4 inline-flex h-12 w-full items-center justify-center bg-black px-8 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all disabled:pointer-events-none disabled:opacity-50 ${isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-neutral-800"
                  }`}
              >
                {isLoading ? "Criando Conta..." : "Criar Conta"}
              </button>
            </form>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-neutral-400 tracking-wider">
                  Já tem uma conta?
                </span>
              </div>
            </div>

            {/* Footer / Login Link */}
            <div className="mt-8 text-center text-sm text-neutral-500">
              <Link
                className="inline-flex h-10 w-full items-center justify-center border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-50 focus:outline-none"
                to="/login"
              >
                Fazer o Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
