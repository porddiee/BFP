import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Logo } from "@/components/logo";
import Image from "next/image";

export default function RegisterStationPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Surigao City Fire Station Frontage.png"
          alt="Surigao City Fire Station"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-xl w-full mx-auto space-y-6">
        {/* Form Card */}
        <div className="p-7 sm:p-9 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-zinc-200 shadow-xl">
          {/* Title at top of form */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Create Station Member Account
            </h1>
          </div>

          <RegisterForm />

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center space-y-4">
            <p className="text-xs text-zinc-600 font-medium">
              Already have an authorized account?{" "}
              <Link
                href="/login"
                className="text-red-600 hover:text-red-700 font-bold underline underline-offset-4"
              >
                Sign in to portal
              </Link>
            </p>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 flex items-center justify-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>Administrative Clearance Desk: (086) 826-2111</span>
            </div>
          </div>
        </div>

        {/* Official notice */}
        <p className="text-center text-[11px] text-white/80 leading-relaxed font-medium">
          Bureau of Fire Protection • Department of the Interior and Local Government<br />
          All account requests are vetted against active BFP personnel rosters.
        </p>
      </div>
    </main>
  );
}
