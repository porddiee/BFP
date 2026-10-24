"use client";

import { useState } from "react";
import { addStationPersonnelAction } from "@/app/actions/station";
import { UserPlus, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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
        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all red-glow flex items-center gap-1.5 shadow-md shrink-0"
      >
        <UserPlus className="w-4 h-4" />
        <span>Add Personnel</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-black">Enroll Station Personnel</h3>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    placeholder="e.g. Juan"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    placeholder="e.g. Dela Cruz"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider mb-1">Rank</label>
                  <select
                    name="rank"
                    defaultValue="Fire Officer 1"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600 bg-white"
                  >
                    <option value="Senior Inspector">Senior Inspector</option>
                    <option value="Senior Fire Officer 4">Senior Fire Officer 4</option>
                    <option value="Senior Fire Officer 3">Senior Fire Officer 3</option>
                    <option value="Senior Fire Officer 2">Senior Fire Officer 2</option>
                    <option value="Senior Fire Officer 1">Senior Fire Officer 1</option>
                    <option value="Fire Officer 3">Fire Officer 3</option>
                    <option value="Fire Officer 2">Fire Officer 2</option>
                    <option value="Fire Officer 1">Fire Officer 1</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider mb-1">Position / Role</label>
                  <input
                    type="text"
                    name="position"
                    defaultValue="Nozzleman / Rescuer"
                    placeholder="e.g. Lead Nozzleman"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">Mobile / Contact Phone</label>
                <input
                  type="text"
                  name="contact_number"
                  placeholder="0917-000-0000"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="officer@bfp.gov.ph"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600"
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
