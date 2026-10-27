import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-tactical-grid relative">
      {/* Soft red ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Form */}
          <div className="space-y-6">
            <div className="p-7 sm:p-8 rounded-2xl bg-white border-2 border-zinc-200 shadow-xl">
              {/* Title at top of form */}
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  BFP Personnel Login
                </h1>
              </div>

              <LoginForm />

              <div className="mt-6 pt-6 border-t border-zinc-100 text-center space-y-4">
                <p className="text-xs text-zinc-600 font-medium">
                  New station officer or personnel?{" "}
                  <Link
                    href="/register-station"
                    className="text-red-600 hover:text-red-700 font-bold underline underline-offset-4"
                  >
                    Register station access
                  </Link>
                </p>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 flex items-center justify-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                  <span>Duty Dispatch Support: (086) 826-2111</span>
                </div>
              </div>
            </div>

            {/* Official notice */}
            <p className="text-center text-[11px] text-zinc-500 leading-relaxed font-medium">
              Republic of the Philippines • Bureau of Fire Protection<br />
              Unauthorized access attempts are logged and monitored under RA 10175.
            </p>
          </div>

          {/* Right side - Station Image */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/Surigao City Fire Station Frontage.png"
                alt="Surigao City Fire Station"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
