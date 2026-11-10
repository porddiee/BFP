"use client";

import { Users, Calendar, ShieldCheck, Clock, Award, Activity } from "lucide-react";

export interface WeeklyDutyPerson {
  id: string;
  name: string;
  rank: string;
  position: string;
  status: "on_duty" | "off_duty";
  gender: "male" | "female";
  shift: string;
  contact: string;
  email: string;
  badgeNo: string;
  specialization: string;
}

interface WeeklyDutyDetailProps {
  roster: WeeklyDutyPerson[];
  stationName: string;
}

export default function WeeklyDutyDetail({
  roster,
  stationName,
}: WeeklyDutyDetailProps) {
  const totalWeeklyPersonnel = roster.length;
  const maleCount = roster.filter((p) => p.gender === "male").length;
  const femaleCount = roster.filter((p) => p.gender === "female").length;

  const malePercent = totalWeeklyPersonnel > 0 ? Math.round((maleCount / totalWeeklyPersonnel) * 100) : 0;
  const femalePercent = totalWeeklyPersonnel > 0 ? Math.round((femaleCount / totalWeeklyPersonnel) * 100) : 0;

  const onDutyTodayCount = roster.filter((p) => p.status === "on_duty").length;
  const alphaShiftCount = roster.filter((p) => p.shift.includes("Alpha")).length;
  const bravoShiftCount = roster.filter((p) => p.shift.includes("Bravo")).length;

  // Format current week dynamically
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diffToMonday));
  const sunday = new Date(now.setDate(diffToMonday + 6));

  const weekString = `${monday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} – ${sunday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm space-y-5">
      {/* Top Banner & Week Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>WEEKLY DUTY DETAIL • {weekString}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
            Weekly Station Duty & Personnel Demographics
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Active operational shifts, troop readiness, and gender workforce distribution for {stationName}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>24/7 Active Duty Roster</span>
        </div>
      </div>

      {/* 3 Prominent Stat Cards: Total, Male, Female */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* 1. Total Personnel On Duty that Week */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white shadow-sm flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Total On Duty That Week
              </span>
              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {totalWeeklyPersonnel}
            </div>
            <div className="text-[11px] text-zinc-300 font-medium mt-1">
              {onDutyTodayCount} currently on post today
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
            <span>Shift Alpha ({alphaShiftCount})</span>
            <span>•</span>
            <span>Shift Bravo ({bravoShiftCount})</span>
          </div>
        </div>

        {/* 2. Male Personnel Working that Week */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                Male Personnel (Week)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                {malePercent}%
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
              {maleCount}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              Active Male Firefighters & Officers
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-blue-200/80 flex items-center justify-between text-[10px] text-blue-800 font-semibold">
            <span>Fire Combat & RTR Rescue</span>
            <span className="font-bold">{maleCount} Officers</span>
          </div>
        </div>

        {/* 3. Female Personnel Working that Week */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">
                Female Personnel (Week)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                {femalePercent}%
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-rose-950 tracking-tight">
              {femaleCount}
            </div>
            <div className="text-[11px] text-rose-700 font-semibold mt-1">
              Active Female Firefighters & Officers
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-rose-200/80 flex items-center justify-between text-[10px] text-rose-800 font-semibold">
            <span>EMS Paramedics & FSES Inspection</span>
            <span className="font-bold">{femaleCount} Officers</span>
          </div>
        </div>
      </div>

      {/* Gender Distribution Visual Progress Bar & Shift Rotation Info */}
      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-bold text-zinc-900">
            Workforce Demographics & Weekly Shift Proportions
          </span>
          <span className="text-[11px] text-zinc-500">
            {maleCount} Male ({malePercent}%) • {femaleCount} Female ({femalePercent}%)
          </span>
        </div>

        {/* Dual Color Progress Bar */}
        <div className="w-full h-3 rounded-full bg-zinc-200 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${malePercent}%` }}
            className="bg-blue-600 h-full transition-all duration-500"
            title={`Male: ${malePercent}%`}
          />
          <div
            style={{ width: `${femalePercent}%` }}
            className="bg-rose-500 h-full transition-all duration-500"
            title={`Female: ${femalePercent}%`}
          />
        </div>

        {/* Shift Rotation Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-blue-600 shrink-0" />
            <span>
              <strong>Shift Alpha (08:00 - 20:00):</strong> {alphaShiftCount} Personnel on day duty
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0" />
            <span>
              <strong>Shift Bravo (20:00 - 08:00):</strong> {bravoShiftCount} Personnel on night relief
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

