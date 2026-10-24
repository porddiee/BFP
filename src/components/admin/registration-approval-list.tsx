"use client";

import { useState } from "react";
import { approveRegistrationAction, rejectRegistrationAction } from "@/app/actions/admin";
import { Profile } from "@/types";
import { CheckCircle2, XCircle, Clock, Mail, Phone, User, ShieldAlert, Loader2 } from "lucide-react";

interface Props {
  initialProfiles: Profile[];
}

export default function RegistrationApprovalList({ initialProfiles }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    setMessage(null);
    const res = await approveRegistrationAction(id);
    if (res?.error) {
      setMessage({ type: "error", text: res.error });
    } else {
      setMessage({ type: "success", text: "Officer registration approved successfully!" });
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
    setLoadingId(null);
  };

  const handleReject = async (id: string) => {
    setLoadingId(id);
    setMessage(null);
    const res = await rejectRegistrationAction(id);
    if (res?.error) {
      setMessage({ type: "error", text: res.error });
    } else {
      setMessage({ type: "success", text: "Officer registration rejected." });
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-dashed border-zinc-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-black mb-1">All Clear - No Pending Registrations</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            When personnel or stations register on the website, they will appear here awaiting regional admin clearance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {profiles.map((p) => {
            const isLoading = loadingId === p.id;
            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-zinc-300 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      Pending Approval
                    </span>
                    <span className="text-xs text-zinc-400">
                      Registered on {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-black">
                      {p.first_name} {p.last_name}
                    </h3>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                      Role Requested: {p.role.replace("_", " ")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{p.email}</span>
                    </div>
                    {p.contact_number && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{p.contact_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
                  <button
                    onClick={() => handleReject(p.id)}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 text-zinc-400" />}
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(p.id)}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all red-glow flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Accept & Grant Access</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
