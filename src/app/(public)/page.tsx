import Link from "next/link";
import { ShieldAlert, LogIn, ArrowRight, Building2, Shield, Lock } from "lucide-react";
import { Logo } from "@/components/logo";

export default function PublicHome() {
  return (
    <main className="bg-white text-zinc-900 min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-tactical-grid relative">
      {/* Soft Ambient Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[250px] sm:h-[380px] bg-red-600/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto w-full text-center space-y-6 sm:space-y-10">
        {/* Top Official Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
          <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-red-600 animate-pulse" />
          <span className="hidden sm:inline">BFP SURIGAO DEL NORTE • COMMAND OPERATIONS PORTAL</span>
          <span className="sm:hidden">BFP SURIGAO COMMAND PORTAL</span>
        </div>

        {/* Brand Icon & Heading */}
        <div className="space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-red-600 flex items-center justify-center red-glow mx-auto shadow-lg">
            <Logo size="md" className="text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight">
            Authorized Personnel <br />
            <span className="text-red-600">Command Portal</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed px-2">
            Restricted access system for Regional Administrators and stationed Fire Officers across Surigao del Norte. Please sign in or register to access the operational dashboard.
          </p>
        </div>

        {/* 2 Primary Access Choices: Sign In & Register */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto text-left pt-2 sm:pt-4 px-2">
          {/* Card 1: Sign In */}
          <Link
            href="/login"
            className="group p-5 sm:p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-1" />
              </div>

              <h2 className="text-lg sm:text-xl font-black text-black mb-1.5">Sign In to Portal</h2>
              <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed mb-4 sm:mb-6">
                Already registered and cleared? Sign in with your official BFP email to view stations, personnel rosters, and operational modules.
              </p>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-red-600 group-hover:underline">
                Access Account &rarr;
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Authorized Login
              </span>
            </div>
          </Link>

          {/* Card 2: Register */}
          <Link
            href="/register-station"
            className="group p-5 sm:p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-1" />
              </div>

              <h2 className="text-lg sm:text-xl font-black text-black mb-1.5">Register Station / Member</h2>
              <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed mb-4 sm:mb-6">
                New station or officer? Submit your registration credentials for verification and approval by the Regional Administrator.
              </p>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-red-600 group-hover:underline">
                Enroll Credentials &rarr;
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Request Access
              </span>
            </div>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="pt-4 sm:pt-6 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-zinc-500 font-medium px-2">
          <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Encrypted Official Access • Regional Administrator Clearance Required</span>
          <span className="sm:hidden">Encrypted Official Access</span>
        </div>
      </div>
    </main>
  );
}
