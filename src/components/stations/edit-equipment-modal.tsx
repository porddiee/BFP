"use client";

import { useState } from "react";
import { updateStationEquipmentAction } from "@/app/actions/station";
import { Edit3, X, Loader2, AlertCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Equipment } from "@/types";

interface Props {
  stationId: string;
  equipment: Equipment;
}

export default function EditEquipmentModal({ stationId, equipment }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("stationId", stationId);
    formData.append("equipmentId", equipment.id);

    const res = await updateStationEquipmentAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-black font-semibold text-xs flex items-center gap-1 transition-colors touch-manipulation"
        title="Edit Equipment"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Edit</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-zinc-200 space-y-4 max-h-[92vh] overflow-y-auto overscroll-contain animate-scaleUp">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Edit Equipment / Apparatus</h3>
                  <p className="text-[11px] text-zinc-400">Update operational status and specifications</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold text-zinc-700">
              <div>
                <label className="block uppercase tracking-wider mb-1">Equipment / Apparatus Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={equipment.name}
                  placeholder="e.g. Major Pumper Engine 102"
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 min-h-[42px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider mb-1">Type / Category</label>
                  <select
                    name="type"
                    defaultValue={equipment.type || "Fire Truck"}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 bg-white min-h-[42px]"
                  >
                    <option value="Fire Truck">Primary Fire Engine</option>
                    <option value="Water Tanker">Water Tender Tanker</option>
                    <option value="Rescue Vehicle">Rescue Tender / Van</option>
                    <option value="Ambulance">EMS Ambulance</option>
                    <option value="PPE Bunker Gear">PPE Bunker Gear Set</option>
                    <option value="SCBA Unit">SCBA Breathing Unit</option>
                    <option value="Rescue Tools">Hydraulic Rescue Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1">Operational Status</label>
                  <select
                    name="status"
                    defaultValue={equipment.status || "operational"}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 bg-white min-h-[42px]"
                  >
                    <option value="operational">Operational (100% Serviceable)</option>
                    <option value="maintenance">Under Maintenance / Repairs</option>
                    <option value="out_of_service">Out of Service (Unserviceable)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider mb-1">Plate / Serial Number</label>
                  <input
                    type="text"
                    name="serial_number"
                    defaultValue={equipment.serial_number || ""}
                    placeholder="e.g. SKD-441 / BFP-1092"
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 min-h-[42px]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider mb-1">Acquisition Date</label>
                  <input
                    type="date"
                    name="acquisition_date"
                    defaultValue={equipment.acquisition_date || ""}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 bg-white min-h-[42px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 active:bg-zinc-100 flex items-center justify-center min-h-[44px] touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 min-h-[44px] touch-manipulation"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

