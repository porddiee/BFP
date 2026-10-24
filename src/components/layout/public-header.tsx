"use client";

import Link from "next/link";
import { ShieldAlert, Flame, LogIn } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 text-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center red-glow group-hover:scale-105 transition-transform shadow-md">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-wider text-black">BFP SURIGAO</span>
                <span className="bg-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded text-white tracking-widest uppercase">
                  PORTAL
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-semibold tracking-tight">
                Command Operations System
              </span>
            </div>
          </Link>

          {/* Only Sign In and Register Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-800 hover:text-black border-2 border-zinc-200 hover:border-black bg-white hover:bg-zinc-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <LogIn className="w-4 h-4 text-red-600" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/register-station"
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all red-glow shadow-md flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
