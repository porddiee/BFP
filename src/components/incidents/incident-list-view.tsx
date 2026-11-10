"use client";

import { useState } from "react";
import {
  Flame,
  Ambulance,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  X,
  Trash2,
  Loader2,
  Check,
} from "lucide-react";
import {
  updateFireIncidentStatusAction,
  deleteFireIncidentAction,
  updateEMSIncidentStatusAction,
  deleteEMSIncidentAction,
} from "@/app/actions/station";
import { useRouter } from "next/navigation";

export interface IncidentRecord {
  id: string;
  station_id: string;
  incident_type: string;
  location: string;
  description?: string | null;
  severity: "low" | "medium" | "high" | "critical";
  status: string;
  reported_at: string;
  created_at: string;
  resolved_at?: string | null;
}

interface Props {
  stationId: string;
  isOwner?: boolean;
  type: "fire" | "ems";
  incidents: IncidentRecord[];
}

export default function IncidentListView({
  stationId,
  isOwner = false,
  type,
  incidents,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IncidentRecord | null>(null);
  const [actionError, setActionError] = useState("");
  const router = useRouter();

  const filtered = incidents.filter((inc) => {
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      inc.incident_type.toLowerCase().includes(q) ||
      inc.location.toLowerCase().includes(q) ||
      (inc.description && inc.description.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (incident: IncidentRecord, newStatus: string) => {
    setLoadingId(incident.id);
    setActionError("");

    const formData = new FormData();
    formData.append("stationId", stationId);
    formData.append("incidentId", incident.id);
    formData.append("status", newStatus);

    const res =
      type === "fire"
        ? await updateFireIncidentStatusAction(formData)
        : await updateEMSIncidentStatusAction(formData);

    if (res?.error) {
      setActionError(res.error);
      setLoadingId(null);
    } else {
      setLoadingId(null);
      router.refresh();
    }
  };

  const handleDelete = async (incident: IncidentRecord) => {
    setLoadingId(incident.id);
    setActionError("");

    const formData = new FormData();
    formData.append("stationId", stationId);
    formData.append("incidentId", incident.id);

    const res =
      type === "fire"
        ? await deleteFireIncidentAction(formData)
        : await deleteEMSIncidentAction(formData);

    if (res?.error) {
      setActionError(res.error);
      setLoadingId(null);
    } else {
      setLoadingId(null);
      setDeleteTarget(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${type === "fire" ? "fire calls" : "EMS runs"}, location, description...`}
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium min-h-[40px]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 overflow-x-auto">
          {["all", "active", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 capitalize ${
                statusFilter === st
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              {st === "all" ? "All Logs" : st}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Incidents List */}
      {filtered.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl space-y-2">
          {type === "fire" ? (
            <Flame className="w-8 h-8 text-zinc-400 mx-auto" />
          ) : (
            <Ambulance className="w-8 h-8 text-zinc-400 mx-auto" />
          )}
          <h3 className="text-sm font-bold text-black">No Incidents Found</h3>
          <p className="text-xs text-zinc-500">No logs matching current search filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inc) => {
            const isResolved = inc.status === "resolved";
            const isLoading = loadingId === inc.id;

            return (
              <div
                key={inc.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-zinc-300 transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-mono font-bold">
                      {inc.id.substring(0, 8)}
                    </span>
                    <h3 className="text-base font-black text-black">{inc.incident_type}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inc.severity === "critical"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : inc.severity === "high"
                          ? "bg-orange-100 text-orange-800 border border-orange-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        isResolved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{inc.status || "Active"}</span>
                    </span>

                    {/* Owner Action Buttons */}
                    {isOwner && (
                      <div className="flex items-center gap-1.5 ml-1">
                        {!isResolved && (
                          <button
                            onClick={() => handleStatusChange(inc, "resolved")}
                            disabled={isLoading}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                            title="Mark as Resolved"
                          >
                            {isLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            <span>Resolve</span>
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(inc)}
                          disabled={isLoading}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Location</span>
                    <span className="font-semibold text-black">{inc.location}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Reported Time</span>
                    <span className="font-semibold text-black">
                      {new Date(inc.reported_at || inc.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {inc.description && (
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">
                      Details & Notes
                    </span>
                    <p className="leading-relaxed">{inc.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-zinc-200 space-y-4 animate-scaleUp">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-black">Delete Incident Report?</h3>
              <p className="text-xs text-zinc-600">
                Are you sure you want to permanently delete report <strong>#{deleteTarget.id.substring(0, 8)}</strong> ({deleteTarget.incident_type})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget)}
                disabled={loadingId === deleteTarget.id}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md disabled:opacity-50"
              >
                {loadingId === deleteTarget.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

