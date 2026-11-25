"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Ambulance,
  Truck,
  Users,
  Paperclip,
  Clock,
  ArrowRight,
  Filter,
  Radio,
  FileText,
  ShieldAlert,
} from "lucide-react";
import type { ActivityItem } from "@/services/dashboard";
import { formatDistanceToNow, parseISO } from "date-fns";

interface Props {
  initialActivities: ActivityItem[];
}

export default function RealTimeActivityFeed({ initialActivities }: Props) {
  const [filterType, setFilterType] = useState<
    "all" | "fire" | "ems" | "fleet_roster" | "upload"
  >("all");

  const filteredActivities = useMemo(() => {
    return initialActivities.filter((act) => {
      if (filterType === "all") return true;
      if (filterType === "fire") return act.type === "fire";
      if (filterType === "ems") return act.type === "ems";
      if (filterType === "fleet_roster")
        return act.type === "equipment" || act.type === "personnel";
      if (filterType === "upload") return act.type === "upload";
      return true;
    });
  }, [initialActivities, filterType]);

  const formatTime = (ts: string) => {
    try {
      return formatDistanceToNow(parseISO(ts), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const getSeverityBadge = (sev?: string) => {
    switch (sev) {
      case "critical":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "fire":
        return <Flame className="w-4 h-4 text-red-600" />;
      case "ems":
        return <Ambulance className="w-4 h-4 text-emerald-600" />;
      case "equipment":
        return <Truck className="w-4 h-4 text-amber-600" />;
      case "personnel":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "upload":
        return <Paperclip className="w-4 h-4 text-purple-600" />;
      default:
        return <Radio className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-zinc-200/90 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Header with Live Indicator & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-black tracking-tight">
              Real-Time Activity Feed
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500">
              Live operational dispatches, reports, file uploads, and roster changes.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Feed" },
            { id: "fire", label: "Fires" },
            { id: "ems", label: "EMS" },
            { id: "fleet_roster", label: "Fleet & Staff" },
            { id: "upload", label: "Files" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterType === tab.id
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-xl space-y-2">
            <Radio className="w-6 h-6 text-zinc-400 mx-auto animate-pulse" />
            <p className="text-xs font-bold text-zinc-600">
              No recent activities found for this filter
            </p>
            <p className="text-[11px] text-zinc-400">
              New incidents and status changes will appear here live.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <Link
              key={act.id}
              href={act.href}
              className="p-3 sm:p-3.5 rounded-xl border border-zinc-200/80 hover:border-red-600 bg-white hover:bg-red-50/20 transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-xs">
                  {getIcon(act.type)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-black group-hover:text-red-700 transition-colors leading-tight">
                      {act.title}
                    </span>
                    {act.severity && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getSeverityBadge(
                          act.severity
                        )}`}
                      >
                        {act.severity}
                      </span>
                    )}
                    {act.status && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase">
                        {act.status}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-600 line-clamp-1 leading-snug">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 pt-0.5 flex-wrap">
                    <span className="font-semibold text-zinc-700">
                      {act.stationName}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(act.timestamp)}</span>
                    </div>
                    {act.attachmentCount && act.attachmentCount > 0 ? (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-purple-700 font-semibold">
                          <Paperclip className="w-3 h-3" />
                          <span>{act.attachmentCount} file(s)</span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
            </Link>
          ))
        )}
      </div>

      {/* Footer link to view full BFP Operations */}
      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-zinc-400">
          Showing latest {filteredActivities.length} operational logs
        </span>
        <Link
          href="/bfp"
          className="text-red-600 hover:text-red-700 font-bold text-[11px] flex items-center gap-1"
        >
          <span>All Operations Center</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

