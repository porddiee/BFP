"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Ambulance,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Truck,
  TrendingUp,
} from "lucide-react";
import type { StationPerformanceMetric } from "@/services/dashboard";

interface Props {
  metrics: StationPerformanceMetric[];
}

export default function StationPerformanceMetrics({ metrics }: Props) {
  const [districtFilter, setDistrictFilter] = useState("all");
  const [sortBy, setSortBy] = useState<
    "incidents" | "response" | "personnel" | "resolution"
  >("incidents");

  const districts = useMemo(() => {
    const standard = ["all", "Mainland Surigao del Norte", "Siargao"];
    const list = Array.from(new Set(metrics.map((m) => m.district).filter(Boolean)));
    return Array.from(new Set([...standard, ...list]));
  }, [metrics]);

  const filteredAndSorted = useMemo(() => {
    let result = metrics.filter((m) => {
      if (districtFilter === "all") return true;
      return m.district === districtFilter;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "incidents") {
        return b.totalIncidents - a.totalIncidents;
      }
      if (sortBy === "response") {
        return a.avgResponseTimeMin - b.avgResponseTimeMin;
      }
      if (sortBy === "personnel") {
        return b.personnelStrength - a.personnelStrength;
      }
      if (sortBy === "resolution") {
        return b.resolutionRate - a.resolutionRate;
      }
      return 0;
    });

    return result;
  }, [metrics, districtFilter, sortBy]);

  const getRatingBadge = (rating: "Alpha" | "Bravo" | "Charlie") => {
    switch (rating) {
      case "Alpha":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Bravo":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Charlie":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-zinc-200/90 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-black tracking-tight">
              Station Performance &amp; Turnout Metrics
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500">
              Comparative station readiness, response time benchmarks, and incident resolution.
            </p>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District Buttons */}
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-xl">
            {districts.map((d) => (
              <button
                key={d}
                onClick={() => setDistrictFilter(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  districtFilter === d
                    ? "bg-white text-black shadow-xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {d === "all" ? "All Stations" : d}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            <option value="incidents">Sort: Total Incidents</option>
            <option value="response">Sort: Fastest Turnout</option>
            <option value="resolution">Sort: Resolution Rate</option>
            <option value="personnel">Sort: Force Strength</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Grid / List */}
      <div className="space-y-2.5">
        {filteredAndSorted.slice(0, 8).map((st, idx) => (
          <div
            key={st.stationId}
            className="p-3.5 rounded-xl border border-zinc-200/80 hover:border-red-600 bg-white hover:bg-zinc-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            {/* Left: Rank & Station Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                  idx === 0
                    ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-xs"
                    : idx === 1
                    ? "bg-zinc-200 text-zinc-800"
                    : idx === 2
                    ? "bg-amber-50 text-amber-900"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                #{idx + 1}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/stations/${st.stationId}`}
                    className="font-black text-xs sm:text-sm text-black group-hover:text-red-700 transition-colors truncate"
                  >
                    {st.stationName}
                  </Link>
                  <span className="text-[10px] text-zinc-400 font-semibold">
                    {st.district}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[11px] text-zinc-500 pt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-black">
                    <Flame className="w-3 h-3 text-red-600" />
                    <span>{st.fireCount} Fires</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-black">
                    <Ambulance className="w-3 h-3 text-emerald-600" />
                    <span>{st.emsCount} EMS</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-600">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span>{st.personnelStrength} Firefighters</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Performance Badges & Turnout Time */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
              {/* Turnout Time */}
              <div className="text-left sm:text-right">
                <div className="flex items-center gap-1 sm:justify-end">
                  <Clock className="w-3 h-3 text-red-600" />
                  <span className="font-black text-xs text-black">
                    {st.avgResponseTimeMin}m avg
                  </span>
                </div>
                <span
                  className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${getRatingBadge(
                    st.responseRating
                  )}`}
                >
                  {st.responseRating} Turnout
                </span>
              </div>

              {/* Resolution Rate Progress */}
              <div className="w-24 text-left sm:text-right">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-700 mb-0.5">
                  <span>Resolved</span>
                  <span>{st.resolutionRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${st.resolutionRate}%` }}
                  />
                </div>
              </div>

              {/* Station Detail Link */}
              <Link
                href={`/stations/${st.stationId}`}
                className="p-1.5 rounded-lg text-zinc-400 group-hover:text-red-600 group-hover:bg-red-50 transition-colors"
                title="View Station Details"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary Strip */}
      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-zinc-400">
          Ranked across {metrics.length} operational commands
        </span>
        <Link
          href="/administrative-updates"
          className="text-red-600 hover:text-red-700 font-bold text-[11px] flex items-center gap-1"
        >
          <span>View Consolidated Matrix</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

