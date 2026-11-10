"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  ArrowRight,
  Users,
  Truck,
  Search,
  X,
  Filter,
} from "lucide-react";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import type { Station } from "@/types";

export default function StationsInteractiveView({
  stations,
}: {
  stations: Station[];
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  if (stations.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20 bg-zinc-50 border border-zinc-200 rounded-2xl">
        <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-300 mx-auto mb-4" />
        <h2 className="text-base sm:text-lg font-bold text-black mb-1">
          No Stations Registered
        </h2>
        <p className="text-[11px] sm:text-xs text-zinc-500">
          Stations will appear here once registered.
        </p>
      </div>
    );
  }

  // Filter stations based on search query
  const filteredStations = stations.filter((st) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = st.name?.toLowerCase().includes(query);
    const districtMatch = st.district?.toLowerCase().includes(query);
    const addressMatch = st.address?.toLowerCase().includes(query);
    const contactMatch = st.contact_number?.toLowerCase().includes(query);
    return nameMatch || districtMatch || addressMatch || contactMatch;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar with Search Bar & View Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-zinc-100">
        <div>
          <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
            Registered Stations Directory
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select a station unit to manage roster, equipment, apparatus, and logs.
          </p>
        </div>

        {/* Search Bar and View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Real-time Search Input */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, city, district..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 min-h-[36px]"
              aria-label="Search stations"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-600"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Toggle (Grid / List) */}
          <div className="flex items-center justify-between sm:justify-start gap-2 self-stretch sm:self-auto shrink-0">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hidden lg:inline">
              Layout:
            </span>
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Filter Status Feedback (when searching) */}
      {searchQuery && (
        <div className="flex items-center justify-between text-xs px-1 text-zinc-500">
          <span>
            Found <strong>{filteredStations.length}</strong> of {stations.length} stations matching &ldquo;{searchQuery}&rdquo;
          </span>
          <button
            onClick={() => setSearchQuery("")}
            className="text-red-600 hover:underline font-bold text-[11px]"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* NO MATCHES STATE */}
      {filteredStations.length === 0 && (
        <div className="text-center py-14 sm:py-16 bg-white border-2 border-dashed border-zinc-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900">
              No matching stations found
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
              No fire stations match &ldquo;{searchQuery}&rdquo;. Try checking the station name or district spelling.
            </p>
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <span>Clear Search</span>
          </button>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === "grid" && filteredStations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
          {filteredStations.map((station) => (
            <Link
              key={station.id}
              href={`/stations/${station.id}`}
              className="group p-4 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:border-red-600 transition-all shadow-sm hover:shadow-md touch-manipulation flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                      Active
                    </span>
                    {station.district && (
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[140px]">
                        {station.district}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-black mb-2 sm:mb-3 break-words group-hover:text-red-700 transition-colors">
                  {station.name}
                </h3>

                <div className="space-y-2 text-xs text-zinc-600 mb-4 sm:mb-5">
                  {station.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span className="break-words leading-relaxed">{station.address}</span>
                    </div>
                  )}
                  {station.contact_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="text-black font-semibold">{station.contact_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Personnel</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Equipment</span>
                  </div>
                </div>
                <span className="text-red-600 font-bold group-hover:underline">
                  View &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && filteredStations.length > 0 && (
        <div className="space-y-3 animate-fadeIn">
          {filteredStations.map((station) => (
            <Link
              key={station.id}
              href={`/stations/${station.id}`}
              className="group p-4 sm:p-5 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 touch-manipulation"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-red-700 transition-colors">
                      {station.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Station
                    </span>
                    {station.district && (
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        • {station.district}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 pt-0.5">
                    {station.address && (
                      <span className="flex items-center gap-1 truncate max-w-md">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{station.address}</span>
                      </span>
                    )}
                    {station.contact_number && (
                      <span className="flex items-center gap-1 text-zinc-800 font-semibold shrink-0">
                        <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{station.contact_number}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 shrink-0">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium mr-2">
                  <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[11px] font-semibold">
                    Roster Active
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-[11px] font-semibold">
                    Fleet Ready
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 group-hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0">
                  <span>Open Station</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
