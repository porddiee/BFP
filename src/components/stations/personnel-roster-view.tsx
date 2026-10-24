"use client";

import { useState } from "react";
import { Users, Search, Phone, Mail, Clock, CheckCircle2, Shield, AlertCircle, ShieldAlert } from "lucide-react";

interface PersonItem {
  id: string;
  name: string;
  rank: string;
  position: string;
  status: "on_duty" | "off_duty";
  shift: string;
  contact: string;
  email: string;
  badgeNo: string;
  specialization: string;
}

interface Props {
  roster: PersonItem[];
}

export default function PersonnelRosterView({ roster }: Props) {
  const [filter, setFilter] = useState<"all" | "on_duty" | "off_duty">("all");
  const [search, setSearch] = useState("");

  const filtered = roster.filter((person) => {
    const matchesFilter = filter === "all" || person.status === filter;
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.position.toLowerCase().includes(search.toLowerCase()) ||
      person.rank.toLowerCase().includes(search.toLowerCase()) ||
      person.specialization.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            All Personnel ({roster.length})
          </button>
          <button
            onClick={() => setFilter("on_duty")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === "on_duty"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-700 hover:text-emerald-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>On Duty ({roster.filter((p) => p.status === "on_duty").length})</span>
          </button>
          <button
            onClick={() => setFilter("off_duty")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === "off_duty"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            Off Duty ({roster.filter((p) => p.status === "off_duty").length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, rank, role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-zinc-200 text-black text-xs font-medium placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
          />
        </div>
      </div>

      {/* Personnel Roster Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-dashed border-zinc-200 rounded-2xl">
          <p className="text-sm font-semibold text-zinc-500">No personnel found matching the criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((person) => {
            const isOnDuty = person.status === "on_duty";
            return (
              <div
                key={person.id}
                className={`p-6 rounded-2xl bg-white border-2 transition-all shadow-sm hover:shadow-md ${
                  isOnDuty
                    ? "border-emerald-200 hover:border-emerald-400"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isOnDuty
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                          {person.rank}
                        </span>
                        <span className="text-[10px] text-zinc-400">•</span>
                        <span className="text-[10px] font-mono text-zinc-400">{person.badgeNo}</span>
                      </div>
                      <h3 className="text-base font-black text-black leading-snug">{person.name}</h3>
                      <p className="text-xs font-semibold text-zinc-700 mt-0.5">{person.position}</p>
                    </div>
                  </div>

                  {/* Duty Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      isOnDuty
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm"
                        : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOnDuty ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                      }`}
                    />
                    <span>{isOnDuty ? "ON DUTY" : "OFF DUTY"}</span>
                  </span>
                </div>

                {/* Details Footer */}
                <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium">Assigned Shift:</span>
                    <span className="font-semibold text-black">{person.shift}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium">Specialization:</span>
                    <span className="font-semibold text-zinc-800">{person.specialization}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-red-600" />
                      <span>{person.contact}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-zinc-400" />
                      <span>{person.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
