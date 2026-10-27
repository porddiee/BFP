import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { Logo } from "@/components/logo";

export default function PublicFooter() {
  return (
    <footer className="bg-zinc-50 text-zinc-700 border-t border-zinc-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white red-glow shadow-sm">
              <Logo size="sm" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wider text-black">BFP SURIGAO</span>
              <p className="text-[11px] text-zinc-500 font-medium">Command Operations Portal • Region XIII</p>
            </div>
          </div>

          {/* Copyright & Security */}
          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>Bureau of Fire Protection • Official Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
