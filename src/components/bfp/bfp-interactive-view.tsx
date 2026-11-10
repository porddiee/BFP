"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  AlertTriangle,
  Ambulance,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";

interface BfpModuleItem {
  id: "rtr" | "fire" | "ems";
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  href: string;
  actionText: string;
}

export default function BfpInteractiveView({
  isAdmin,
  userStationName,
  rtrHref,
  fireHref,
  emsHref,
}: {
  isAdmin: boolean;
  userStationName?: string | null;
  rtrHref: string;
  fireHref: string;
  emsHref: string;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const modules: BfpModuleItem[] = [
    {
      id: "rtr",
      title: !isAdmin && userStationName ? "My Station RTR" : "RTR",
      badge: "SPECIAL RESCUE UNIT",
      subtitle: "Rapid, Tactical, Response",
      description:
        "Search and rescue operations, specialized typhoon flood interventions, high-angle rope rescue, and tactical emergency missions.",
      href: rtrHref,
      actionText: !isAdmin && userStationName ? "Open Station RTR Log" : "View Stations RTR",
    },
    {
      id: "fire",
      title: !isAdmin && userStationName ? "My Fire Incidents" : "Fire Incident",
      badge: "FIRE SUPPRESSION",
      subtitle: "Alarms & Structural Reports",
      description:
        "Active fire dispatches, multi-alarm level escalations, post-fire structural damage reports, and casualty logs.",
      href: fireHref,
      actionText: !isAdmin && userStationName ? "Open Fire Incident Log" : "View Stations Incidents",
    },
    {
      id: "ems",
      title: !isAdmin && userStationName ? "My EMS Records" : "EMS",
      badge: "MEDICAL RESPONSE",
      subtitle: "Emergency Medical Services",
      description:
        "Pre-hospital emergency care, paramedic triage, road trauma response, ambulance dispatches, and hospital patient transfers.",
      href: emsHref,
      actionText: !isAdmin && userStationName ? "Open Station EMS Log" : "View Stations EMS",
    },
  ];

  const getIcon = (id: string) => {
    switch (id) {
      case "rtr":
        return LifeBuoy;
      case "fire":
        return AlertTriangle;
      case "ems":
        return Ambulance;
      default:
        return LifeBuoy;
    }
  };

  return (
    <div className="space-y-4">
      {/* View Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-100">
        <div>
          <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
            Select an Operational Pillar
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Review tactical rescues, structural fire alarms, and emergency medical deployments.
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
          {modules.map((m) => {
            const Icon = getIcon(m.id);
            return (
              <Link
                key={m.id}
                href={m.href}
                className="group p-5 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between touch-manipulation min-h-[240px]"
              >
                <div>
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow shrink-0">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span>{m.badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-black mb-1.5 group-hover:text-red-700 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                    {m.subtitle}
                  </p>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-5">
                    {m.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span className="truncate max-w-[180px]">{m.actionText}</span>
                  <span className="font-bold text-red-600 group-hover:underline shrink-0">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-3 animate-fadeIn">
          {modules.map((m) => {
            const Icon = getIcon(m.id);
            return (
              <Link
                key={m.id}
                href={m.href}
                className="group p-4 sm:p-5 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 touch-manipulation"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow shrink-0 mt-0.5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-zinc-900 group-hover:text-red-700 transition-colors">
                        {m.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                        {m.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        • {m.subtitle}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 shrink-0">
                  <span className="text-xs text-zinc-400 font-medium md:hidden">
                    {m.actionText}
                  </span>
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 group-hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0">
                    <span>{m.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

