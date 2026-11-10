"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Calendar,
  Clock,
  Shield,
  Activity,
  Phone,
  CheckCircle2,
  Printer,
  RotateCcw,
  Save,
  Loader2,
  Sun,
  Moon,
  Coffee,
  CalendarDays,
  UserCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import { updateDutyScheduleAction } from "@/app/actions/station";

export interface WeeklyDutyPerson {
  id: string; // member id
  profileId?: string;
  firstName?: string;
  lastName?: string;
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
  stationId?: string;
  isOwner?: boolean;
}

type ShiftType = "alpha" | "bravo" | "off";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type DayName = typeof DAYS[number];

export default function WeeklyDutyDetail({
  roster,
  stationName,
  stationId = "",
  isOwner = false,
}: WeeklyDutyDetailProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "daily">("weekly");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    // Default to today's day of week (0 = Mon, 6 = Sun)
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  });
  const [dailyFilter, setDailyFilter] = useState<"all" | "alpha" | "bravo" | "off">("all");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute actual week dates (Mon - Sun)
  const weekDates = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    
    return DAYS.map((_, idx) => {
      const date = new Date(now);
      date.setDate(diffToMonday + idx);
      return {
        day: DAYS[idx],
        shortDay: DAYS[idx].slice(0, 3),
        dateStr: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDateStr: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      };
    });
  }, []);

  // Initialize weekly schedule for each person
  // Schedule maps person.id -> Record<DayName, ShiftType>
  const [schedule, setSchedule] = useState<Record<string, Record<DayName, ShiftType>>>(() => {
    const initial: Record<string, Record<DayName, ShiftType>> = {};
    roster.forEach((p, pIdx) => {
      initial[p.id] = {
        Monday: pIdx % 2 === 0 ? "alpha" : "bravo",
        Tuesday: pIdx % 2 === 0 ? "alpha" : "bravo",
        Wednesday: pIdx % 2 === 0 ? "bravo" : "alpha",
        Thursday: pIdx % 2 === 0 ? "bravo" : "alpha",
        Friday: pIdx % 2 === 0 ? "alpha" : "off",
        Saturday: pIdx % 2 === 0 ? "off" : "bravo",
        Sunday: pIdx % 2 === 0 ? "bravo" : "alpha",
      };
    });
    return initial;
  });

  // Cycle shift on click (Owner only)
  const cycleShift = (personId: string, day: DayName) => {
    if (!isOwner) return;
    setSchedule((prev) => {
      const currentShift = prev[personId]?.[day] || "alpha";
      const nextShift: ShiftType =
        currentShift === "alpha" ? "bravo" : currentShift === "bravo" ? "off" : "alpha";
      return {
        ...prev,
        [personId]: {
          ...prev[personId],
          [day]: nextShift,
        },
      };
    });
    setSaveSuccess(false);
  };

  // Quick auto-rotate shifts
  const handleAutoRotate = () => {
    if (!isOwner) return;
    setSchedule((prev) => {
      const updated: Record<string, Record<DayName, ShiftType>> = {};
      roster.forEach((p, idx) => {
        const cur = prev[p.id] || {};
        updated[p.id] = {
          Monday: cur.Monday === "alpha" ? "bravo" : "alpha",
          Tuesday: cur.Tuesday === "alpha" ? "bravo" : "alpha",
          Wednesday: cur.Wednesday === "alpha" ? "bravo" : "alpha",
          Thursday: cur.Thursday === "alpha" ? "bravo" : "alpha",
          Friday: cur.Friday === "off" ? "alpha" : "off",
          Saturday: cur.Saturday === "off" ? "bravo" : "off",
          Sunday: cur.Sunday === "alpha" ? "bravo" : "alpha",
        };
      });
      return updated;
    });
    setSaveSuccess(false);
  };

  // Save schedule to database
  const handleSaveSchedule = async () => {
    if (!stationId || !isOwner) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const formData = new FormData();
    formData.append("stationId", stationId);
    formData.append("schedulePayload", JSON.stringify(schedule));

    const res = await updateDutyScheduleAction(formData);

    setIsSaving(false);
    if (res?.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  // Compute Weekly Demographic Stats
  const totalWeeklyPersonnel = roster.length;
  const maleCount = roster.filter((p) => p.gender === "male").length;
  const femaleCount = roster.filter((p) => p.gender === "female").length;
  const malePercent = totalWeeklyPersonnel > 0 ? Math.round((maleCount / totalWeeklyPersonnel) * 100) : 0;
  const femalePercent = totalWeeklyPersonnel > 0 ? Math.round((femaleCount / totalWeeklyPersonnel) * 100) : 0;

  // Selected Day computed data
  const selectedDay = DAYS[selectedDayIndex];
  const selectedDateInfo = weekDates[selectedDayIndex];

  const dailyRoster = useMemo(() => {
    return roster.map((p) => {
      const assignedShift = schedule[p.id]?.[selectedDay] || (p.status === "on_duty" ? "alpha" : "bravo");
      return {
        ...p,
        dayShift: assignedShift,
      };
    });
  }, [roster, schedule, selectedDay]);

  const dailyAlphaCrew = dailyRoster.filter((p) => p.dayShift === "alpha");
  const dailyBravoCrew = dailyRoster.filter((p) => p.dayShift === "bravo");
  const dailyOffDutyCrew = dailyRoster.filter((p) => p.dayShift === "off");

  const dailyActiveDutyCount = dailyAlphaCrew.length + dailyBravoCrew.length;
  const dailyActiveMale = dailyRoster.filter((p) => p.dayShift !== "off" && p.gender === "male").length;
  const dailyActiveFemale = dailyRoster.filter((p) => p.dayShift !== "off" && p.gender === "female").length;

  const currentWeekString = `${weekDates[0].dateStr} – ${weekDates[6].fullDateStr}`;

  return (
    <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm space-y-6">
      {/* Top Banner & Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>DUTY SCHEDULING HUB • {currentWeekString}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
            Station Duty Scheduling & Demographics
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage weekly rotational shifts (Alpha/Bravo), view daily deployed crew, and track gender workforce distribution for {stationName}.
          </p>
        </div>

        {/* View Switcher: Weekly Schedule vs Daily Duty */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 shadow-inner">
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "weekly"
                  ? "bg-white text-black shadow-sm font-black"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Shifts</span>
            </button>
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "daily"
                  ? "bg-red-600 text-white shadow-sm font-black"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Duty</span>
            </button>
          </div>

          <button
            onClick={() => window.print()}
            title="Print Duty Roster"
            className="p-2 rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 border border-zinc-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: WEEKLY SHIFT SCHEDULING & DEMOGRAPHICS
      ========================================================================= */}
      {activeTab === "weekly" && (
        <div className="space-y-6 animate-fadeIn">
          {/* 3 Prominent Stat Cards: Total, Male, Female */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Total Personnel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white shadow-sm flex flex-col justify-between min-h-[140px]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Total Personnel (Week)
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {totalWeeklyPersonnel}
                </div>
                <div className="text-[11px] text-zinc-300 font-medium mt-1">
                  Enrolled station firefighters & officers
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                <span>Active 7-Day Matrix</span>
                <span>24/7 Operations</span>
              </div>
            </div>

            {/* Male Demographics */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-sm flex flex-col justify-between min-h-[140px]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                    Male Force
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
                <span>Fire Combat & Rescue</span>
                <span className="font-bold">{maleCount} Officers</span>
              </div>
            </div>

            {/* Female Demographics */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-sm flex flex-col justify-between min-h-[140px]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">
                    Female Force
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
                <span>EMS & Fire Safety (FSES)</span>
                <span className="font-bold">{femaleCount} Officers</span>
              </div>
            </div>
          </div>

          {/* Demographic Progress Bar */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold text-zinc-900">
                Weekly Workforce Demographics Breakdown
              </span>
              <span className="text-[11px] text-zinc-500 font-semibold">
                {maleCount} Male ({malePercent}%) • {femaleCount} Female ({femalePercent}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-200 overflow-hidden flex shadow-inner">
              <div style={{ width: `${malePercent}%` }} className="bg-blue-600 h-full" />
              <div style={{ width: `${femalePercent}%` }} className="bg-rose-500 h-full" />
            </div>
          </div>

          {/* Weekly Shift Matrix Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-black">Weekly Shift Schedule Matrix</h3>
                <p className="text-xs text-zinc-500">
                  {isOwner
                    ? "Click on any shift cell to cycle assignment: Shift Alpha (Day) -> Shift Bravo (Night) -> Off Duty."
                    : "Official weekly rotational shift assignments for station personnel."}
                </p>
              </div>

              {/* Owner Action Buttons */}
              {isOwner && (
                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Schedule Saved!</span>
                    </span>
                  )}
                  <button
                    onClick={handleAutoRotate}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-bold text-zinc-700 flex items-center gap-1.5 transition-colors"
                    title="Rotate Day/Night Shifts"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Auto-Rotate</span>
                  </button>
                  <button
                    onClick={handleSaveSchedule}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Schedule</span>
                  </button>
                </div>
              )}
            </div>

            {/* Matrix Table */}
            <div className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 w-[240px]">Officer & Rank</th>
                      {weekDates.map((wd) => (
                        <th key={wd.day} className="py-3 px-2 text-center border-l border-zinc-800">
                          <div>{wd.shortDay}</div>
                          <div className="text-[9px] text-zinc-400 font-normal">{wd.dateStr}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {roster.map((person, idx) => (
                      <tr
                        key={person.id}
                        className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}
                      >
                        <td className="py-3 px-4 border-r border-zinc-200">
                          <div className="font-black text-black">{person.name}</div>
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <span>{person.rank}</span>
                            <span>•</span>
                            <span className={person.gender === "female" ? "text-rose-600 font-bold" : "text-blue-600 font-bold"}>
                              {person.gender}
                            </span>
                          </div>
                        </td>
                        {DAYS.map((day) => {
                          const shiftVal = schedule[person.id]?.[day] || "alpha";
                          return (
                            <td key={day} className="p-1.5 text-center border-r border-zinc-100">
                              <button
                                onClick={() => cycleShift(person.id, day)}
                                disabled={!isOwner}
                                className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                                  shiftVal === "alpha"
                                    ? "bg-blue-100/80 text-blue-800 hover:bg-blue-200"
                                    : shiftVal === "bravo"
                                    ? "bg-purple-100/80 text-purple-800 hover:bg-purple-200"
                                    : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                                } ${isOwner ? "cursor-pointer" : "cursor-default"}`}
                                title={
                                  isOwner
                                    ? "Click to cycle shift"
                                    : shiftVal === "alpha"
                                    ? "Shift Alpha (Day)"
                                    : shiftVal === "bravo"
                                    ? "Shift Bravo (Night)"
                                    : "Off Duty"
                                }
                              >
                                {shiftVal === "alpha" ? (
                                  <>
                                    <Sun className="w-3 h-3 text-blue-600" />
                                    <span>Alpha</span>
                                  </>
                                ) : shiftVal === "bravo" ? (
                                  <>
                                    <Moon className="w-3 h-3 text-purple-600" />
                                    <span>Bravo</span>
                                  </>
                                ) : (
                                  <>
                                    <Coffee className="w-3 h-3 text-zinc-400" />
                                    <span>Off</span>
                                  </>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-600">
              <span className="font-bold text-zinc-800">Shift Key:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-flex items-center justify-center">
                  <Sun className="w-2 h-2 text-blue-600" />
                </span>
                <span>
                  <strong>Shift Alpha:</strong> Day Duty (08:00 – 20:00)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-flex items-center justify-center">
                  <Moon className="w-2 h-2 text-purple-600" />
                </span>
                <span>
                  <strong>Shift Bravo:</strong> Night Duty (20:00 – 08:00)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-zinc-100 border border-zinc-300 inline-flex items-center justify-center">
                  <Coffee className="w-2 h-2 text-zinc-400" />
                </span>
                <span>
                  <strong>Off:</strong> Standby / Rest Day
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DAILY DUTY DETAIL & POSTING ROSTER
      ========================================================================= */}
      {activeTab === "daily" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Day of Week Selector */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Select Operational Day
              </span>
              <span className="text-xs font-black text-red-600">
                {selectedDateInfo.fullDateStr}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
              {weekDates.map((wd, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={wd.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`py-2 px-3 rounded-xl text-center transition-all ${
                      isSelected
                        ? "bg-red-600 text-white shadow-md font-bold"
                        : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                    }`}
                  >
                    <div className="text-[11px] font-bold">{wd.day}</div>
                    <div className={`text-[10px] ${isSelected ? "text-red-100" : "text-zinc-400"}`}>
                      {wd.dateStr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily KPI Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Active On Duty Today */}
            <div className="p-4 rounded-xl bg-zinc-900 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Total On Duty ({selectedDateInfo.shortDay})
              </span>
              <div className="text-2xl sm:text-3xl font-black">{dailyActiveDutyCount}</div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Active Deployed Officers</span>
            </div>

            {/* Male on Duty */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                Male On Duty
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-950">{dailyActiveMale}</div>
              <span className="text-[10px] text-blue-600 mt-1 block">Fire Combat & Extrication</span>
            </div>

            {/* Female on Duty */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                Female On Duty
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-950">{dailyActiveFemale}</div>
              <span className="text-[10px] text-rose-600 mt-1 block">Paramedic & Prevention</span>
            </div>

            {/* Shift Breakdown */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Shift Breakdown
              </span>
              <div className="text-xs font-black text-emerald-950 mt-1 space-y-1">
                <div className="flex justify-between">
                  <span>Day (Alpha):</span>
                  <span className="font-bold">{dailyAlphaCrew.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Night (Bravo):</span>
                  <span className="font-bold">{dailyBravoCrew.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Crew Sections */}
          <div className="space-y-6">
            {/* SHIFT ALPHA (DAY CREW) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black">
                      Shift Alpha • Day Crew (08:00 – 20:00)
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Primary daytime response force for fire calls and rescue operations.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                  {dailyAlphaCrew.length} Assigned
                </span>
              </div>

              {dailyAlphaCrew.length === 0 ? (
                <div className="p-6 text-center bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-500">
                  No personnel assigned to Shift Alpha for {selectedDay}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dailyAlphaCrew.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-sm flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-red-600 uppercase">
                            {p.rank}
                          </span>
                          <span className="text-zinc-300">•</span>
                          <span className={`text-[9px] font-bold uppercase ${p.gender === "female" ? "text-rose-600" : "text-blue-600"}`}>
                            {p.gender}
                          </span>
                        </div>
                        <h5 className="text-sm font-black text-black">{p.name}</h5>
                        <p className="text-xs text-zinc-600 font-semibold">{p.position}</p>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-500 pt-1">
                          <Phone className="w-3 h-3 text-red-600" />
                          <span>{p.contact}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {p.badgeNo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SHIFT BRAVO (NIGHT CREW) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black">
                      Shift Bravo • Night Relief (20:00 – 08:00)
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Night standby and active suppression unit for overnight emergencies.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                  {dailyBravoCrew.length} Assigned
                </span>
              </div>

              {dailyBravoCrew.length === 0 ? (
                <div className="p-6 text-center bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-500">
                  No personnel assigned to Shift Bravo for {selectedDay}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dailyBravoCrew.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-white border border-purple-200 shadow-sm flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-red-600 uppercase">
                            {p.rank}
                          </span>
                          <span className="text-zinc-300">•</span>
                          <span className={`text-[9px] font-bold uppercase ${p.gender === "female" ? "text-rose-600" : "text-blue-600"}`}>
                            {p.gender}
                          </span>
                        </div>
                        <h5 className="text-sm font-black text-black">{p.name}</h5>
                        <p className="text-xs text-zinc-600 font-semibold">{p.position}</p>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-500 pt-1">
                          <Phone className="w-3 h-3 text-red-600" />
                          <span>{p.contact}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                        {p.badgeNo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* OFF-DUTY / REST DAY */}
            {dailyOffDutyCrew.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-700">
                        Off Duty / Standby Relief ({dailyOffDutyCrew.length})
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Personnel on scheduled rest day or emergency callback reserve.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {dailyOffDutyCrew.map((p) => (
                    <span
                      key={p.id}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 border border-zinc-200"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{p.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">({p.rank})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
