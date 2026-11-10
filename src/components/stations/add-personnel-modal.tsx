"use client";

import { useState } from "react";
import { addStationPersonnelAction } from "@/app/actions/station";
import { UserPlus, X, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  stationId: string;
}

export default function AddPersonnelModal({ stationId }: Props) {
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

    const res = await addStationPersonnelAction(formData);

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
        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition-all red-glow flex items-center justify-center gap-1.5 shadow-md shrink-0 touch-manipulation min-h-[44px]"
      >
        <UserPlus className="w-4 h-4" />
        <span>Add Personnel</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 space-y-5 max-h-[92vh] overflow-y-auto overscroll-contain animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black">Enroll Station Personnel</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Add officer profile, duty assignment, and shift schedule
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    placeholder="e.g. Juan"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    placeholder="e.g. Dela Cruz"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  />
                </div>
              </div>

              {/* Row 2: Rank & Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Rank
                  </label>
                  <select
                    name="rank"
                    defaultValue="Fire Officer 1"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  >
                    <option value="Senior Inspector">Senior Inspector</option>
                    <option value="Inspector">Inspector</option>
                    <option value="Senior Fire Officer 4">Senior Fire Officer 4</option>
                    <option value="Senior Fire Officer 3">Senior Fire Officer 3</option>
                    <option value="Senior Fire Officer 2">Senior Fire Officer 2</option>
                    <option value="Senior Fire Officer 1">Senior Fire Officer 1</option>
                    <option value="Fire Officer 3">Fire Officer 3</option>
                    <option value="Fire Officer 2">Fire Officer 2</option>
                    <option value="Fire Officer 1">Fire Officer 1</option>
                    <option value="Non-Uniformed Personnel (NUP)">Non-Uniformed Personnel (NUP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Operational Assignment / Role
                  </label>
                  <input
                    type="text"
                    name="position"
                    defaultValue="Lead Nozzleman / Rescuer"
                    placeholder="e.g. Lead Nozzleman, Pump Operator, EMT"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  />
                </div>
              </div>

              {/* Row 3: Duty Schedule & Duty Status (Seamless white fields) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Assigned Schedule / Shift
                  </label>
                  <select
                    name="shift"
                    defaultValue="Shift Alpha (08:00 - 20:00)"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  >
                    <option value="Shift Alpha (08:00 - 20:00)">Shift Alpha (08:00 – 20:00 / Day Shift)</option>
                    <option value="Shift Bravo (20:00 - 08:00)">Shift Bravo (20:00 – 08:00 / Night Shift)</option>
                    <option value="Shift Charlie (24H Rotation)">Shift Charlie (24H Shift Rotation)</option>
                    <option value="Administrative (08:00 - 17:00)">Administrative (08:00 – 17:00 / Office)</option>
                    <option value="Off Duty / Standby Reserve">Off Duty / Standby Reserve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Duty Status
                  </label>
                  <select
                    name="duty_status"
                    defaultValue="on_duty"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  >
                    <option value="on_duty">On Duty (Active on post)</option>
                    <option value="off_duty">Off Duty (Rest day / Standby)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Contact & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Mobile / Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    placeholder="0917-000-0000"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="officer@bfp.gov.ph"
                    className="w-full px-3.5 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 bg-white transition-all min-h-[46px]"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-50 active:bg-zinc-100 flex items-center justify-center min-h-[44px] text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold red-glow flex items-center justify-center gap-2 shadow-md disabled:opacity-50 min-h-[44px] text-xs transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Save Personnel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
