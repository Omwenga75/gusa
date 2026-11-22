"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { getFirstPermittedPath } from "@/lib/permissions";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginState, setLoginState] = useState<"idle" | "authenticating" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginState !== "idle") return;

    setLoginState("authenticating");
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid admin email or password");
        setLoginState("idle");
        return;
      }

      // Login successful: maintain progress state so button never reverts back to 'Sign In'
      setLoginState("success");

      const callbackUrl = searchParams.get("callbackUrl");
      let dest = "/admin";

      if (callbackUrl && callbackUrl !== "/admin") {
        dest = callbackUrl;
      } else {
        try {
          const sessionRes = await fetch("/api/auth/session");
          const sessionData = await sessionRes.json();
          const userRole = sessionData?.user?.role;
          const userPerms = sessionData?.user?.permissions;
          if (userRole === "ADMIN") {
            dest = getFirstPermittedPath(userPerms);
          }
        } catch {
          dest = "/admin";
        }
      }

      // Immediate full-page navigation so session cookies and protected admin layout mount with zero flicker
      window.location.href = dest;
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoginState("idle");
    }
  };

  const isBusy = loginState !== "idle";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-violet-600/30 to-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm bg-slate-900/85 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-7 shadow-2xl relative z-10 transition-all">
        {/* Top Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-black text-xl mb-3 shadow-lg shadow-violet-500/30">
            G
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Executive Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to manage GUSA events, news, & platform stats</p>
        </div>

        {/* Floating/Inline Error notification with (X) dismiss */}
        {error && (
          <div className="relative flex items-center justify-between gap-2 bg-red-500/15 border border-red-500/30 text-red-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold mb-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="email">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                id="email"
                type="email"
                disabled={isBusy}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all disabled:opacity-60"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={isBusy}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-11 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all disabled:opacity-60"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold shadow-lg transition-all mt-2 flex items-center justify-center gap-2 ${
              loginState === "success"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25 cursor-default"
                : loginState === "authenticating"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white opacity-90 shadow-violet-500/30 cursor-wait"
                : "btn-primary shadow-violet-500/25 hover:shadow-violet-500/40"
            }`}
          >
            {loginState === "authenticating" && (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            )}
            {loginState === "success" && (
              <>
                <CheckCircle2 size={16} className="text-white" />
                <span>Verified! Redirecting...</span>
              </>
            )}
            {loginState === "idle" && <span>Sign In to Admin Dashboard</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
