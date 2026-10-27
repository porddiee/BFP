import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, PhoneCall } from "lucide-react";
import { Logo } from "@/components/logo";

export default function RegisterStationPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-tactical-grid relative">
      {/* Red ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-xl w-full mx-auto space-y-8">

        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-black mx-auto p-0.5 red-glow flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center border border-red-600/30">
              <Logo size="md" className="text-red-600" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>STATION PERSONNEL ENROLLMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Create Station Member Account
            </h1>
            <p className="mt-1 text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
              Register your credentials to request authorized access to the BFP Surigao emergency operations management system.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-7 sm:p-9 rounded-2xl bg-white border-2 border-zinc-200 shadow-xl relative">
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
        <p className="text-center text-[11px] text-zinc-500 leading-relaxed font-medium">
          Bureau of Fire Protection • Department of the Interior and Local Government<br />
          All account requests are vetted against active BFP personnel rosters.
        </p>
      </div>
    </main>
  );
}
