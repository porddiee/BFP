"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  LifeBuoy,
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Users,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";

export default function DashboardCardsView({
  stationsCount,
}: {
  stationsCount: number;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div className="space-y-4">
      {/* Header bar with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-100">
        <div>
          <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
            Command Center Modules
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Quick access to station directories and BFP operational modules.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hidden md:inline">
            Layout:
          </span>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fadeIn">
          {/* STATIONS Card */}
          <Link
            href="/stations"
            className="group p-5 sm:p-7 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow shrink-0">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-black mb-2 group-hover:text-red-700 transition-colors">
                Stations
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
                View all registered fire stations across Surigao del Norte. Access each station&apos;s personnel roster and available equipment &amp; services.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-3 sm:pt-4 border-t border-zinc-100 flex-wrap text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-red-600" />
                <span>
                  <strong className="text-black">{stationsCount}</strong> Stations
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-red-600" />
                <span>Personnel</span>
              </div>
            </div>
          </Link>

          {/* BFP OPERATIONS Card */}
          <Link
            href="/bfp"
            className="group p-5 sm:p-7 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow shrink-0">
                  <Logo size="md" />
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-black mb-2 group-hover:text-red-700 transition-colors">
                BFP Operations
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
                Bureau of Fire Protection operational modules. Access RTR rescue operations, fire incident reports, and emergency medical services.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-3 sm:pt-4 border-t border-zinc-100 flex-wrap text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 text-red-600" />
                <span>RTR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Fires</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Ambulance className="w-3.5 h-3.5 text-red-600" />
                <span>EMS</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-3 animate-fadeIn">
          {/* Stations List Item */}
          <Link
            href="/stations"
            className="group p-4 sm:p-5 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 touch-manipulation"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow shrink-0 mt-0.5">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-zinc-900 group-hover:text-red-700 transition-colors">
                    Stations Directory
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                    {stationsCount} Active Units
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">
                  View all registered fire stations across Surigao del Norte. Access each station&apos;s personnel roster and available equipment &amp; services.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 shrink-0">
              <span className="text-xs text-zinc-400 font-semibold md:hidden">
                Rosters & Fleet
              </span>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 group-hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0">
                <span>View Stations</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* BFP Operations List Item */}
          <Link
            href="/bfp"
            className="group p-4 sm:p-5 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 touch-manipulation"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow shrink-0 mt-0.5">
                <Logo size="sm" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-zinc-900 group-hover:text-red-700 transition-colors">
                    BFP Operations
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                    RTR • Fires • EMS
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">
                  Bureau of Fire Protection operational modules. Access RTR rescue operations, fire incident reports, and emergency medical services.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 shrink-0">
              <span className="text-xs text-zinc-400 font-semibold md:hidden">
                Tactical Modules
              </span>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 group-hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0">
                <span>Open Operations</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

