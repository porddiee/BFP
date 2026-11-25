"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Ambulance,
  UserPlus,
  Truck,
  FileSpreadsheet,
  CalendarDays,
  Zap,
  ArrowRight,
  X,
  Building2,
  CheckCircle2,
} from "lucide-react";

interface StationOption {
  id: string;
  stationName: string;
  district: string;
}

interface Props {
  isAdmin: boolean;
  userStationId?: string | null;
  stations: StationOption[];
}

export default function QuickActionsPanel({
  isAdmin,
  userStationId,
  stations,
}: Props) {
  const router = useRouter();
  const [stationPickerAction, setStationPickerAction] = useState<{
    type: "fire" | "ems" | "personnel" | "equipment" | "schedule";
    title: string;
    description: string;
    targetRoute: (stId: string) => string;
  } | null>(null);

  /** Station user: navigate directly to their own station route */
  const handleStationAction = (
    type: "fire" | "ems" | "personnel" | "equipment" | "schedule",
    title: string,
    description: string,
    targetRoute: (stId: string) => string
  ) => {
    if (userStationId) {
      router.push(targetRoute(userStationId));
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-zinc-200/90 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-black tracking-tight">
              Tactical Quick Actions
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500">
              One-click access to critical command workflows and operations.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline">
          {isAdmin ? "Provincial Command" : "Station Operations"}
        </span>
      </div>

      {isAdmin ? (
        /* ─────────────────────────────────────────────────────
           ADMIN — view-only / oversight actions (5 tiles)
           ───────────────────────────────────────────────────── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {/* 1. All Stations */}
          <Link
            href="/stations"
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-red-600 bg-white hover:bg-red-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-red-700 leading-tight">
                All Stations
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Province-wide view
              </span>
            </div>
          </Link>

          {/* 2. BFP Operations */}
          <Link
            href="/bfp"
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-orange-600 bg-white hover:bg-orange-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-orange-700 leading-tight">
                BFP Operations
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Incidents overview
              </span>
            </div>
          </Link>

          {/* 3. Export Report */}
          <Link
            href="/administrative-updates"
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-emerald-700 leading-tight">
                Export Report
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                PDF / Excel matrix
              </span>
            </div>
          </Link>

          {/* 4. Approve Registrations */}
          <Link
            href="/admin/registrations"
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-blue-600 bg-white hover:bg-blue-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-blue-700 leading-tight">
                Approve Users
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Pending registrations
              </span>
            </div>
          </Link>

          {/* 5. Admin Updates */}
          <Link
            href="/administrative-updates"
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-amber-600 bg-white hover:bg-amber-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-amber-700 leading-tight">
                Admin Updates
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Memos &amp; directives
              </span>
            </div>
          </Link>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────
           STATION USER — operational CRUD actions (6 tiles)
           ───────────────────────────────────────────────────── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {/* 1. Report Fire */}
          <button
            onClick={() =>
              handleStationAction(
                "fire",
                "Log Fire Incident Alarm",
                "Navigating to fire incidents for your station.",
                (stId) => `/bfp/fire-incidents/${stId}`
              )
            }
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-red-600 bg-white hover:bg-red-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-red-700 leading-tight">
                Report Fire
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Log suppression run
              </span>
            </div>
          </button>

          {/* 2. Log EMS Call */}
          <button
            onClick={() =>
              handleStationAction(
                "ems",
                "Log EMS Medical Incident",
                "Navigating to EMS for your station.",
                (stId) => `/bfp/ems/${stId}`
              )
            }
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Ambulance className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-emerald-700 leading-tight">
                Log EMS Call
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Ambulance dispatch
              </span>
            </div>
          </button>

          {/* 3. Add Personnel */}
          <button
            onClick={() =>
              handleStationAction(
                "personnel",
                "Enroll Station Personnel",
                "Navigating to personnel roster for your station.",
                (stId) => `/stations/${stId}/personnel`
              )
            }
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-blue-600 bg-white hover:bg-blue-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-blue-700 leading-tight">
                Add Personnel
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Update duty roster
              </span>
            </div>
          </button>

          {/* 4. Manage Fleet */}
          <button
            onClick={() =>
              handleStationAction(
                "equipment",
                "Equipment & Fleet Inventory",
                "Navigating to equipment for your station.",
                (stId) => `/stations/${stId}/equipment`
              )
            }
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-amber-600 bg-white hover:bg-amber-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-amber-800 leading-tight">
                Manage Fleet
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Trucks &amp; Ambulances
              </span>
            </div>
          </button>

          {/* 5. Export Matrix */}
          <Link
            href="/administrative-updates"
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-emerald-700 leading-tight">
                Export Matrix
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                PDF / Excel reports
              </span>
            </div>
          </Link>

          {/* 6. Duty Schedule */}
          <button
            onClick={() =>
              handleStationAction(
                "schedule",
                "Duty Shift Scheduling",
                "Navigating to duty schedule for your station.",
                (stId) => `/stations/${stId}/personnel/schedule`
              )
            }
            className="p-3.5 rounded-xl border border-zinc-200 hover:border-red-600 bg-white hover:bg-red-50/40 text-left transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-xs text-black block group-hover:text-red-700 leading-tight">
                Duty Schedule
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5 leading-tight">
                Daily &amp; Weekly shifts
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Station Selector Modal — kept for future admin use */}
      {stationPickerAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-zinc-200 overflow-hidden animate-fadeIn">
            <div className="p-5 bg-gradient-to-r from-red-600 to-red-700 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-200 block">
                  Quick Action
                </span>
                <h3 className="text-lg font-black tracking-tight text-white">
                  {stationPickerAction.title}
                </h3>
                <p className="text-xs text-red-100 mt-0.5">
                  {stationPickerAction.description}
                </p>
              </div>
              <button
                onClick={() => setStationPickerAction(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block px-1">
                Select Destination Fire Station
              </span>
              <div className="space-y-1.5">
                {stations.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      const dest = stationPickerAction.targetRoute(st.id);
                      setStationPickerAction(null);
                      router.push(dest);
                    }}
                    className="w-full p-3 rounded-xl border border-zinc-200 hover:border-red-600 hover:bg-red-50/30 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-red-100 text-zinc-600 group-hover:text-red-700 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-black block leading-tight">
                          {st.stationName}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {st.district}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-right">
              <button
                onClick={() => setStationPickerAction(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
