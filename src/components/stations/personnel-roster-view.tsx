"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Shield,
  X,
  Trash2,
  LayoutGrid,
  List,
  Loader2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import EditPersonnelModal from "./edit-personnel-modal";
import { deleteStationPersonnelAction } from "@/app/actions/station";
import { useRouter } from "next/navigation";

export interface PersonItem {
  id: string; // station_member id
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

interface Props {
  roster: PersonItem[];
  stationId?: string;
  isOwner?: boolean;
}

export default function PersonnelRosterView({
  roster,
  stationId = "",
  isOwner = false,
}: Props) {
  const [filter, setFilter] = useState<"all" | "on_duty" | "off_duty">("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<PersonItem | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();

  const filtered = roster.filter((person) => {
    const matchesStatus = filter === "all" || person.status === filter;
    const matchesGender = genderFilter === "all" || person.gender === genderFilter;
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.position.toLowerCase().includes(search.toLowerCase()) ||
      person.rank.toLowerCase().includes(search.toLowerCase()) ||
      person.specialization.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesGender && matchesSearch;
  });

  const handleDelete = async (person: PersonItem) => {
    if (!stationId) return;
    setDeletingId(person.id);
    setDeleteError("");

    const formData = new FormData();
    formData.append("stationId", stationId);
    formData.append("memberId", person.id);

    const res = await deleteStationPersonnelAction(formData);

    if (res?.error) {
      setDeleteError(res.error);
      setDeletingId(null);
    } else {
      setDeletingId(null);
      setDeleteConfirmTarget(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
              Station Roster Directory
            </h2>
            {isOwner && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Owner Access: Active
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Filter personnel by duty status, demographics, or search by rank and name.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-500 hover:text-black"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-500 hover:text-black"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline">
            {filtered.length} of {roster.length} Personnel
          </span>
        </div>
      </div>

      {deleteError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{deleteError}</span>
          </div>
          <button onClick={() => setDeleteError("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        {/* Status and Gender Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 touch-manipulation ${
                filter === "all"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              All ({roster.length})
            </button>
            <button
              onClick={() => setFilter("on_duty")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 touch-manipulation ${
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
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 touch-manipulation ${
                filter === "off_duty"
                  ? "bg-zinc-700 text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Off Duty ({roster.filter((p) => p.status === "off_duty").length})
            </button>
          </div>

          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setGenderFilter("all")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 touch-manipulation ${
                genderFilter === "all"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              All Genders
            </button>
            <button
              onClick={() => setGenderFilter("male")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 touch-manipulation ${
                genderFilter === "male"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-blue-700 hover:text-blue-900"
              }`}
            >
              <span>Male ({roster.filter((p) => p.gender === "male").length})</span>
            </button>
            <button
              onClick={() => setGenderFilter("female")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 touch-manipulation ${
                genderFilter === "female"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-rose-700 hover:text-rose-900"
              }`}
            >
              <span>Female ({roster.filter((p) => p.gender === "female").length})</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, rank, role..."
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-zinc-200 text-black text-xs font-medium placeholder-zinc-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 min-h-[42px]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Personnel Roster Cards (Grid or List View) */}
      {filtered.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-white border-2 border-dashed border-zinc-200 rounded-2xl space-y-2">
          <p className="text-sm font-semibold text-zinc-700">No personnel found matching the criteria.</p>
          {(search || filter !== "all" || genderFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
                setGenderFilter("all");
              }}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((person) => {
            const isOnDuty = person.status === "on_duty";
            const isFemale = person.gender === "female";
            return (
              <div
                key={person.id}
                className={`p-4 sm:p-6 rounded-2xl bg-white border-2 transition-all shadow-sm hover:shadow-md ${
                  isOnDuty
                    ? "border-emerald-200 hover:border-emerald-400"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isOnDuty
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                          {person.rank}
                        </span>
                        <span className="text-[10px] text-zinc-400">•</span>
                        <span className="text-[10px] font-mono text-zinc-400">{person.badgeNo}</span>
                        <span className="text-[10px] text-zinc-400">•</span>
                        {/* Gender Badge */}
                        <span
                          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            isFemale
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {person.gender}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-black leading-snug break-words">{person.name}</h3>
                      <p className="text-xs font-semibold text-zinc-700 mt-0.5">{person.position}</p>
                    </div>
                  </div>

                  {/* Duty Status Badge & Owner Controls */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
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

                    {/* Owner CRUD Buttons */}
                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <EditPersonnelModal stationId={stationId} member={person} />
                        <button
                          onClick={() => setDeleteConfirmTarget(person)}
                          disabled={deletingId === person.id}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                          title="Remove Personnel"
                        >
                          {deletingId === person.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Footer */}
                <div className="pt-3.5 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                    <span className="text-zinc-500 font-medium">Assigned Shift:</span>
                    <span className="font-semibold text-black">{person.shift}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                    <span className="text-zinc-500 font-medium">Specialization:</span>
                    <span className="font-semibold text-zinc-800 break-words">{person.specialization}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pt-1.5 text-[11px] text-zinc-500 border-t border-zinc-50">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <a href={`tel:${person.contact}`} className="hover:text-red-600 hover:underline">{person.contact}</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <a href={`mailto:${person.email}`} className="hover:text-red-600 hover:underline break-all">{person.email}</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table Mode */
        <div className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-4">Rank & Role</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Shift Assignment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Contact</th>
                  {isOwner && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {filtered.map((person) => {
                  const isOnDuty = person.status === "on_duty";
                  const isFemale = person.gender === "female";
                  return (
                    <tr key={person.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-black">{person.name}</div>
                        <span className="text-[10px] font-mono text-zinc-400">{person.badgeNo}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-800">{person.rank}</div>
                        <div className="text-[11px] text-zinc-500">{person.position}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            isFemale
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {person.gender}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-700 font-medium">{person.shift}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isOnDuty
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOnDuty ? "bg-emerald-500" : "bg-zinc-400"
                            }`}
                          />
                          <span>{isOnDuty ? "On Duty" : "Off Duty"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 text-[11px]">
                        <div>{person.contact}</div>
                        <div className="text-zinc-400 text-[10px]">{person.email}</div>
                      </td>
                      {isOwner && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <EditPersonnelModal stationId={stationId} member={person} />
                            <button
                              onClick={() => setDeleteConfirmTarget(person)}
                              disabled={deletingId === person.id}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete Personnel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-zinc-200 space-y-4 animate-scaleUp">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-black">Remove Personnel?</h3>
              <p className="text-xs text-zinc-600">
                Are you sure you want to remove <strong>{deleteConfirmTarget.name}</strong> from this station roster?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmTarget)}
                disabled={deletingId === deleteConfirmTarget.id}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md disabled:opacity-50"
              >
                {deletingId === deleteConfirmTarget.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
