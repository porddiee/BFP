"use client";

import { useState } from "react";
import {
  Truck,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Search,
  X,
  Trash2,
  LayoutGrid,
  List,
  Loader2,
  Activity,
  Ambulance,
} from "lucide-react";
import EditEquipmentModal from "./edit-equipment-modal";
import { deleteStationEquipmentAction } from "@/app/actions/station";
import { useRouter } from "next/navigation";
import type { Equipment } from "@/types";

interface Props {
  stationId: string;
  isOwner?: boolean;
  equipment: Equipment[];
}

export default function EquipmentRosterView({
  stationId,
  isOwner = false,
  equipment,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "operational" | "maintenance" | "out_of_service">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();

  const filtered = equipment.filter((eq) => {
    const matchesStatus = statusFilter === "all" || eq.status === statusFilter;
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      (eq.type && eq.type.toLowerCase().includes(search.toLowerCase())) ||
      (eq.serial_number && eq.serial_number.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const apparatusList = filtered.filter((eq) =>
    ["fire truck", "tanker", "rescue", "ambulance", "engine", "apparatus"].some(
      (t) =>
        (eq.type && eq.type.toLowerCase().includes(t)) ||
        eq.name.toLowerCase().includes(t)
    ) ||
    (eq.type && !eq.type.toLowerCase().includes("ppe") && !eq.type.toLowerCase().includes("scba"))
  );

  const ppeList = filtered.filter((eq) =>
    (eq.type && (eq.type.toLowerCase().includes("ppe") || eq.type.toLowerCase().includes("scba") || eq.type.toLowerCase().includes("gear"))) ||
    (!apparatusList.includes(eq))
  );

  const handleDelete = async (item: Equipment) => {
    setDeletingId(item.id);
    setDeleteError("");

    const formData = new FormData();
    formData.append("stationId", stationId);
    formData.append("equipmentId", item.id);

    const res = await deleteStationEquipmentAction(formData);

    if (res?.error) {
      setDeleteError(res.error);
      setDeletingId(null);
    } else {
      setDeletingId(null);
      setDeleteTarget(null);
      router.refresh();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational</span>
          </span>
        );
      case "maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Maintenance</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Out of Service</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls: Search, Status Filter, and View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apparatus, serial number, PPE..."
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

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            {(["all", "operational", "maintenance", "out_of_service"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 capitalize ${
                  statusFilter === st
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                {st === "all" ? "All Status" : st.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
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

      {/* SECTION 1: Fire Trucks & Heavy Apparatus */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-black">
              Available Fire Trucks & Heavy Fleet ({apparatusList.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Frontline engines, tankers, and rescue vehicles stationed for rapid deployment.
            </p>
          </div>
        </div>

        {apparatusList.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl">
            <Truck className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-500">
              No apparatus found matching current search or filters.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {apparatusList.map((truck) => (
              <div
                key={truck.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                      {truck.type?.toLowerCase().includes("ambulance") ? (
                        <Ambulance className="w-6 h-6" />
                      ) : (
                        <Truck className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                          {truck.type || "Apparatus"}
                        </span>
                        <span className="text-[10px] text-zinc-400">•</span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {truck.serial_number || "NO-PLATE"}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-black">{truck.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(truck.status)}
                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <EditEquipmentModal stationId={stationId} equipment={truck} />
                        <button
                          onClick={() => setDeleteTarget(truck)}
                          disabled={deletingId === truck.id}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Apparatus"
                        >
                          {deletingId === truck.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-zinc-500">
                  <span>Serial / Plate: <strong className="text-black font-mono">{truck.serial_number}</strong></span>
                  <span>Category: <strong className="text-black">{truck.type}</strong></span>
                  {truck.acquisition_date && (
                    <span>Acquired: <strong className="text-black">{truck.acquisition_date}</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Apparatus Name</th>
                    <th className="py-3 px-4 sm:px-6">Type</th>
                    <th className="py-3 px-4 sm:px-6">Serial / Plate</th>
                    <th className="py-3 px-4 sm:px-6">Status</th>
                    {isOwner && <th className="py-3 px-4 sm:px-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {apparatusList.map((truck) => (
                    <tr key={truck.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-black flex items-center gap-2">
                        <Truck className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{truck.name}</span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-zinc-600">{truck.type}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-zinc-500">{truck.serial_number}</td>
                      <td className="py-3.5 px-4 sm:px-6">{getStatusBadge(truck.status)}</td>
                      {isOwner && (
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <EditEquipmentModal stationId={stationId} equipment={truck} />
                            <button
                              onClick={() => setDeleteTarget(truck)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete Apparatus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Personal Protective Equipment (PPE) & Gear */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-black">
            Personal Protective Equipment (PPE) & Specialized Gear ({ppeList.length})
          </h2>
          <p className="text-xs text-zinc-500">
            Firefighter bunker turnout gear, SCBA breathing units, and rescue equipment logged for this station.
          </p>
        </div>

        {ppeList.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl">
            <Shield className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-500">
              No PPE gear items found matching criteria. Use &quot;Add Apparatus / PPE&quot; above to log items.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Equipment Name</th>
                    <th className="py-3 px-4 sm:px-6">Type</th>
                    <th className="py-3 px-4 sm:px-6">Serial / Tag</th>
                    <th className="py-3 px-4 sm:px-6">Status</th>
                    {isOwner && <th className="py-3 px-4 sm:px-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {ppeList.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-black flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-zinc-600">{item.type}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-zinc-500">{item.serial_number}</td>
                      <td className="py-3.5 px-4 sm:px-6">{getStatusBadge(item.status)}</td>
                      {isOwner && (
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <EditEquipmentModal stationId={stationId} equipment={item} />
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-zinc-200 space-y-4 animate-scaleUp">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-black">Delete Equipment?</h3>
              <p className="text-xs text-zinc-600">
                Are you sure you want to remove <strong>{deleteTarget.name}</strong> from this station inventory?
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
                disabled={deletingId === deleteTarget.id}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md disabled:opacity-50"
              >
                {deletingId === deleteTarget.id ? (
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

