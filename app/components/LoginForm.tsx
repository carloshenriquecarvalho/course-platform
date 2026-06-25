"use client"

import * as React from "react"
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react"
import { LoginFormProps } from "../types"
import Image from "next/image"

export function CardSpacing({ email, password, onEmailChange, onPasswordChange, onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="w-full max-w-md animate-slideUp">
      {/* Logo / Branding */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-30 h-30 rounded-2xl gold-gradient mb-5 shadow-lg overflow-hidden hover:scale-101 duration-500"
          style={{ boxShadow: "0 8px 32px oklch(0.72 0.15 85 / 0.3)" }}>
            <Image
            className="hover:scale-101 duration-500"
            src={"/logo-pimenta1.png"}
            width={200}
            height={200}
            loading="eager"
            alt="Logo da Pimenta Estética"
            ></Image>
        </div>
      </div>

      {/* Card */}
      <div
        className="glass rounded-2xl p-8 shadow-2xl"
        style={{ boxShadow: "0 24px 64px oklch(0 0 0 / 0.6)" }}
      >
        <div className="mb-6">
          <h2 className="font-heading text-xl font-semibold text-white">
            Bem-vindo de volta
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Insira suas credenciais para continuar
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email-input"
              className="block text-xs font-medium text-white/60 uppercase tracking-wider"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input
                id="email-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/60 focus:bg-white/8 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password-input"
                className="block text-xs font-medium text-white/60 uppercase tracking-wider"
              >
                Senha
              </label>
              <a
                href="#"
                className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors duration-200"
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/60 focus:bg-white/8 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors duration-200"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full gold-gradient text-black font-heading font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
            style={{ boxShadow: "0 4px 20px oklch(0.72 0.15 85 / 0.35)" }}
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-white/25 mt-6">
          Não tem uma conta?{" "}
          <a href="#" className="text-amber-400/60 hover:text-amber-400 transition-colors">
            Registre-se
          </a>
        </p>
      </div>
    </div>
  )
}
