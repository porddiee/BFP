"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Truck,
  Ambulance,
  Search,
  CheckCircle2,
  ArrowRight,
  Shield,
  Phone,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Info,
} from "lucide-react";
import type { StationAdministrativeRecord } from "@/services/administrative";

interface Props {
  initialRecords: StationAdministrativeRecord[];
}

export default function AdministrativeUpdatesTable({ initialRecords }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");

  // Extract unique districts for quick filtering
  const districts = useMemo(() => {
    const list = Array.from(new Set(initialRecords.map((r) => r.district).filter(Boolean)));
    return ["all", ...list];
  }, [initialRecords]);

  // Filter records based on search query and district
  const filteredRecords = useMemo(() => {
    return initialRecords.filter((rec) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rec.stationName.toLowerCase().includes(q) ||
        rec.marshalName.toLowerCase().includes(q) ||
        rec.district.toLowerCase().includes(q) ||
        rec.address.toLowerCase().includes(q) ||
        rec.remarks.toLowerCase().includes(q);

      const matchesDistrict =
        districtFilter === "all" || rec.district === districtFilter;

      return matchesSearch && matchesDistrict;
    });
  }, [initialRecords, searchQuery, districtFilter]);

  // Calculate Provincial Totals
  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, r) => {
        acc.personnelMale += r.personnelMale;
        acc.personnelFemale += r.personnelFemale;
        acc.personnelTotal += r.personnelTotal;
        acc.firetruckBfp += r.firetruckBfp;
        acc.firetruckLgu += r.firetruckLgu;
        acc.firetruckTotal += r.firetruckTotal;
        acc.ambulanceBfp += r.ambulanceBfp;
        acc.ambulanceLgu += r.ambulanceLgu;
        acc.ambulanceTotal += r.ambulanceTotal;
        return acc;
      },
      {
        personnelMale: 0,
        personnelFemale: 0,
        personnelTotal: 0,
        firetruckBfp: 0,
        firetruckLgu: 0,
        firetruckTotal: 0,
        ambulanceBfp: 0,
        ambulanceLgu: 0,
        ambulanceTotal: 0,
      }
    );
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Stations Reported */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Stations Reported
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-black">
                {filteredRecords.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                100% Active
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 block">
              Surigao del Norte Commands
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Personnel Force */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Total Personnel
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-black">
                {totals.personnelTotal}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Staff Force
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="text-blue-600 font-bold">{totals.personnelMale} Male</span>
              <span className="text-zinc-300">•</span>
              <span className="text-rose-600 font-bold">{totals.personnelFemale} Female</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Firetruck Fleet */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Fire Engines & Tankers
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-black">
                {totals.firetruckTotal}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Units Total
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="text-red-600 font-bold">{totals.firetruckBfp} BFP</span>
              <span className="text-zinc-300">•</span>
              <span className="text-amber-600 font-bold">{totals.firetruckLgu} LGU</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Ambulance Fleet */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              EMS Ambulances
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-black">
                {totals.ambulanceTotal}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Units Total
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="text-red-600 font-bold">{totals.ambulanceBfp} BFP</span>
              <span className="text-zinc-300">•</span>
              <span className="text-emerald-600 font-bold">{totals.ambulanceLgu} LGU</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Ambulance className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search station, marshal, district or remarks..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setDistrictFilter(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize ${
                districtFilter === d
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200/70"
              }`}
            >
              {d === "all" ? "All Districts" : d}
            </button>
          ))}
          <button
            onClick={() => window.print()}
            title="Print Official Matrix"
            className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 border border-zinc-200 transition-colors shrink-0"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formal Administrative Table */}
      <div className="rounded-2xl bg-white border border-zinc-200/90 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            {/* Multi-Row Hierarchical Table Header */}
            <thead>
              {/* Header Tier 1 */}
              <tr className="bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider border-b border-zinc-800">
                <th
                  rowSpan={2}
                  className="px-4 sm:px-5 py-3.5 text-left border-r border-zinc-800 w-[240px]"
                >
                  Stations
                </th>
                <th
                  rowSpan={2}
                  className="px-4 sm:px-5 py-3.5 text-left border-r border-zinc-800 w-[230px]"
                >
                  Name of Marshals / Commanders
                </th>
                <th
                  colSpan={2}
                  className="px-3 py-2 text-center border-r border-zinc-800 bg-zinc-800/90"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Number of Personnel</span>
                  </div>
                </th>
                <th
                  colSpan={2}
                  className="px-3 py-2 text-center border-r border-zinc-800 bg-zinc-800/90"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-red-400" />
                    <span>No. of Firetruck</span>
                  </div>
                </th>
                <th
                  colSpan={2}
                  className="px-3 py-2 text-center border-r border-zinc-800 bg-zinc-800/90"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Ambulance className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No. of Ambulance</span>
                  </div>
                </th>
                <th
                  rowSpan={2}
                  className="px-4 sm:px-5 py-3.5 text-left min-w-[220px]"
                >
                  Remarks
                </th>
              </tr>

              {/* Header Tier 2 (Sub-columns) */}
              <tr className="bg-zinc-800/70 text-zinc-200 text-[10px] font-black uppercase tracking-wider border-b border-zinc-200">
                {/* Personnel Sub-Columns */}
                <th className="px-3 py-2 text-center border-r border-zinc-700 w-[85px] bg-blue-950/30 text-blue-300">
                  Male
                </th>
                <th className="px-3 py-2 text-center border-r border-zinc-700 w-[85px] bg-rose-950/30 text-rose-300">
                  Female
                </th>

                {/* Firetruck Sub-Columns */}
                <th className="px-3 py-2 text-center border-r border-zinc-700 w-[95px] bg-red-950/30 text-red-300">
                  BFP Owned
                </th>
                <th className="px-3 py-2 text-center border-r border-zinc-700 w-[95px] bg-amber-950/30 text-amber-300">
                  LGU Owned
                </th>

                {/* Ambulance Sub-Columns */}
                <th className="px-3 py-2 text-center border-r border-zinc-700 w-[95px] bg-red-950/30 text-red-300">
                  BFP Owned
                </th>
                <th className="px-3 py-2 text-center border-r border-zinc-700 w-[95px] bg-emerald-950/30 text-emerald-300">
                  LGU Owned
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-200/80 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-zinc-500">
                    <Info className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-black">No stations found matching &quot;{searchQuery}&quot;</p>
                    <p className="text-xs text-zinc-400 mt-1">Try clearing your search query or switching district filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, idx) => (
                  <tr
                    key={rec.id}
                    className={`hover:bg-red-50/40 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-zinc-50/50"
                    }`}
                  >
                    {/* Column 1: Stations */}
                    <td className="px-4 sm:px-5 py-4 border-r border-zinc-200">
                      <Link
                        href={`/stations/${rec.id}`}
                        className="group flex flex-col space-y-1"
                      >
                        <span className="font-black text-xs text-black group-hover:text-red-600 transition-colors leading-tight">
                          {rec.stationName}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500">
                          {rec.district}
                        </span>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active Unit
                          </span>
                        </div>
                      </Link>
                    </td>

                    {/* Column 2: Name of Marshals/Commanders */}
                    <td className="px-4 sm:px-5 py-4 border-r border-zinc-200">
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-black block leading-tight">
                          {rec.marshalName}
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {rec.marshalRank}
                        </span>
                        <span className="text-[10px] text-zinc-500 block leading-tight">
                          {rec.marshalPosition}
                        </span>
                      </div>
                    </td>

                    {/* Column 3: Personnel - Male */}
                    <td className="px-3 py-4 text-center border-r border-zinc-200 bg-blue-50/20">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                        {rec.personnelMale}
                      </span>
                    </td>

                    {/* Column 4: Personnel - Female */}
                    <td className="px-3 py-4 text-center border-r border-zinc-200 bg-rose-50/20">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs bg-rose-100 text-rose-800 border border-rose-200 shadow-sm">
                        {rec.personnelFemale}
                      </span>
                    </td>

                    {/* Column 5: Firetruck - BFP Owned */}
                    <td className="px-3 py-4 text-center border-r border-zinc-200 bg-red-50/20">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs bg-red-100 text-red-800 border border-red-200 shadow-sm">
                        {rec.firetruckBfp}
                      </span>
                    </td>

                    {/* Column 6: Firetruck - LGU Owned */}
                    <td className="px-3 py-4 text-center border-r border-zinc-200 bg-amber-50/20">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs bg-amber-100 text-amber-900 border border-amber-200 shadow-sm">
                        {rec.firetruckLgu}
                      </span>
                    </td>

                    {/* Column 7: Ambulance - BFP Owned */}
                    <td className="px-3 py-4 text-center border-r border-zinc-200 bg-red-50/20">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs bg-red-100 text-red-800 border border-red-200 shadow-sm">
                        {rec.ambulanceBfp}
                      </span>
                    </td>

                    {/* Column 8: Ambulance - LGU Owned */}
                    <td className="px-3 py-4 text-center border-r border-zinc-200 bg-emerald-50/20">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg font-black text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                        {rec.ambulanceLgu}
                      </span>
                    </td>

                    {/* Column 9: Remarks */}
                    <td className="px-4 sm:px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-bold text-[11px] text-emerald-800">
                            Operational Readiness
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                          {rec.remarks}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Table Footer: Provincial Grand Totals */}
            {filteredRecords.length > 0 && (
              <tfoot>
                <tr className="bg-zinc-900 text-white font-black text-xs border-t-2 border-red-600">
                  <td className="px-4 sm:px-5 py-4 border-r border-zinc-800" colSpan={2}>
                    <div className="flex items-center justify-between">
                      <span className="uppercase tracking-wider text-[11px] text-zinc-300">
                        Provincial Total ({filteredRecords.length} Stations)
                      </span>
                      <span className="text-[10px] font-bold text-red-300 px-2 py-0.5 rounded bg-red-950/80 border border-red-800">
                        Surigao del Norte Force
                      </span>
                    </div>
                  </td>

                  {/* Total Personnel - Male */}
                  <td className="px-3 py-4 text-center border-r border-zinc-800 bg-blue-950/50 text-blue-300 font-black text-sm">
                    {totals.personnelMale}
                  </td>

                  {/* Total Personnel - Female */}
                  <td className="px-3 py-4 text-center border-r border-zinc-800 bg-rose-950/50 text-rose-300 font-black text-sm">
                    {totals.personnelFemale}
                  </td>

                  {/* Total Firetrucks - BFP Owned */}
                  <td className="px-3 py-4 text-center border-r border-zinc-800 bg-red-950/50 text-red-300 font-black text-sm">
                    {totals.firetruckBfp}
                  </td>

                  {/* Total Firetrucks - LGU Owned */}
                  <td className="px-3 py-4 text-center border-r border-zinc-800 bg-amber-950/50 text-amber-300 font-black text-sm">
                    {totals.firetruckLgu}
                  </td>

                  {/* Total Ambulances - BFP Owned */}
                  <td className="px-3 py-4 text-center border-r border-zinc-800 bg-red-950/50 text-red-300 font-black text-sm">
                    {totals.ambulanceBfp}
                  </td>

                  {/* Total Ambulances - LGU Owned */}
                  <td className="px-3 py-4 text-center border-r border-zinc-800 bg-emerald-950/50 text-emerald-300 font-black text-sm">
                    {totals.ambulanceLgu}
                  </td>

                  {/* Summary Remarks */}
                  <td className="px-4 sm:px-5 py-4 text-[11px] text-zinc-300">
                    <span className="text-emerald-400 font-bold block">
                      Total Force: {totals.personnelTotal} Firefighters
                    </span>
                    <span className="text-zinc-400 block text-[10px]">
                      {totals.firetruckTotal} Firetrucks • {totals.ambulanceTotal} Ambulances
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

