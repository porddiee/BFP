"use client";

import { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldAlert } from "lucide-react";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Fields (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium"
              placeholder="e.g. Juan"
            />
          </div>
        </div>

        <div>
          <label htmlFor="last_name" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium"
              placeholder="e.g. Dela Cruz"
            />
          </div>
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
          Official Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium"
            placeholder="juan.delacruz@bfp.gov.ph"
          />
        </div>
      </div>

      {/* Contact Number */}
      <div>
        <label htmlFor="contact_number" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
          Contact / Mobile Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Phone className="w-4 h-4" />
          </div>
          <input
            id="contact_number"
            name="contact_number"
            type="tel"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium"
            placeholder="0917-123-4567 or (086) 826-XXXX"
          />
        </div>
      </div>

      {/* Password Fields (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="password" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-black"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={6}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-black"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Upon submitting registration, your account will enter <strong className="text-black">Pending Approval</strong> status. An authorized district administrator will verify your station affiliation before granting operational access.
        </p>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm uppercase tracking-wider transition-all red-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting Registration...</span>
          </>
        ) : (
          <span>Submit Station Account Registration</span>
        )}
      </button>
    </form>
  );
}
