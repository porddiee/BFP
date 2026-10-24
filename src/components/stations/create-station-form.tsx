"use client";

import { useState } from "react";
import { createMyStationAction } from "@/app/actions/station";
import { Building2, MapPin, Phone, Mail, Loader2, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateStationForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createMyStationAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-white border-2 border-zinc-200 shadow-lg max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 red-glow">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-black">Register Your Fire Station</h2>
          <p className="text-xs text-zinc-500">
            Enter your official station information to establish your station command hub.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-zinc-700">
        <div>
          <label className="block uppercase tracking-wider mb-1.5">Official Station Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Dapa Municipal Fire Station"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider mb-1.5">District / Sector</label>
            <input
              type="text"
              name="district"
              defaultValue="District 1 • Surigao del Norte"
              placeholder="e.g. District 1 • Siargao"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
            />
          </div>
          <div>
            <label className="block uppercase tracking-wider mb-1.5">Station Hotline / Mobile</label>
            <input
              type="text"
              name="contact_number"
              required
              placeholder="e.g. (086) 826-1111"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
            />
          </div>
        </div>

        <div>
          <label className="block uppercase tracking-wider mb-1.5">Complete Physical Address</label>
          <input
            type="text"
            name="address"
            required
            placeholder="e.g. Rizal Street, Poblacion, Surigao City"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
          />
        </div>

        <div>
          <label className="block uppercase tracking-wider mb-1.5">Official Station Email</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. station.dapa@bfp.gov.ph"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-black text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all red-glow flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            <span>Establish Fire Station Command</span>
          </button>
        </div>
      </form>
    </div>
  );
}
