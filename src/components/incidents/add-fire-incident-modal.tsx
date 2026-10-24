"use client";

import { useState } from "react";
import { addFireIncidentAction } from "@/app/actions/station";
import { Flame, PlusCircle, X, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  stationId: string;
}

export default function AddFireIncidentModal({ stationId }: Props) {
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

    const res = await addFireIncidentAction(formData);

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
        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all red-glow flex items-center gap-1.5 shadow-md shrink-0"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Report Fire Incident</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-black">Log Fire Suppression Incident</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100"
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-zinc-700">
              <div>
                <label className="block uppercase tracking-wider mb-1">Incident Type</label>
                <input
                  type="text"
                  name="incident_type"
                  required
                  placeholder="e.g. Commercial Structure Fire, Residential Fire, Electrical Post"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">Exact Location / Address</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Purok 3, Barangay Washington, Surigao"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider mb-1">Alarm Severity</label>
                  <select
                    name="severity"
                    defaultValue="medium"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600 bg-white"
                  >
                    <option value="low">1st Alarm (Low)</option>
                    <option value="medium">2nd Alarm (Medium)</option>
                    <option value="high">3rd Alarm (High)</option>
                    <option value="critical">Task Force / General Alarm (Critical)</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider mb-1">Responding Fleet</label>
                  <input
                    type="text"
                    name="apparatus"
                    defaultValue="Engine-101"
                    placeholder="e.g. Engine 101, Tanker 2"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">Incident Description & Investigation Notes</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Details of the fire suppression operation, estimated structural damage, casualties, or cause..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold red-glow flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                  <span>Save Incident Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
