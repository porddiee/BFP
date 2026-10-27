import { Clock, ShieldAlert, CheckCircle2, PhoneCall, Mail, ArrowRight, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

export default function PendingApprovalPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-tactical-grid relative">
      {/* Amber glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-xl w-full mx-auto space-y-8">
        {/* Header Icon & Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-amber-600 mx-auto shadow-md">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CLEARANCE IN PROGRESS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Registration Submitted
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
              Your station account credentials have been logged in the BFP Surigao database and are currently awaiting review by the Regional Administrator.
            </p>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="p-7 sm:p-8 rounded-2xl bg-white border-2 border-zinc-200 shadow-xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 pb-2">
              Verification Progress
            </h2>

            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-black block">Account Enrolled</span>
                <p className="text-[11px] text-zinc-500">Credentials created and encrypted securely.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-4 h-4 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-800 block">Regional Administrator Review</span>
                <p className="text-[11px] text-zinc-600">
                  Regional Command is verifying your station assignment and authorization clearance.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 opacity-50">
              <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-400 shrink-0">
                <span className="text-xs font-bold">3</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-700 block">Dashboard Access Activated</span>
                <p className="text-[11px] text-zinc-400">Full access to stations, rosters, and emergency reports.</p>
              </div>
            </div>
          </div>

          {/* Regional Desk Assistance */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
            <span className="font-bold text-black block">Need Expedited Approval?</span>
            <p className="text-[11px] leading-relaxed">
              If you require immediate operational clearance during active duty, contact the Regional Dispatch Command Desk directly:
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-red-600">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>(086) 826-2111</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>bfp.surigaodelnorte@bfp.gov.ph</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-all red-glow shadow-md"
            >
              Check Approval Status
            </Link>

            <form action={logoutAction} className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
