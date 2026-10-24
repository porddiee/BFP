import { getStationById, getUserStation } from "@/services/stations";
import { getEMSIncidents } from "@/services/reports";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { ArrowLeft, Ambulance, Activity, CheckCircle2, Clock, MapPin, ShieldAlert, HeartPulse, User, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import AddEMSIncidentModal from "@/components/incidents/add-ems-incident-modal";

export default async function StationEMSDetailPage({
  params,
}: {
  params: { stationId: string };
}) {
  const { stationId } = params;

  let station;
  try {
    station = await getStationById(stationId);
  } catch {
    notFound();
  }

  if (!station) notFound();

  // Ownership & Role Verification
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";
  let isOwner = false;
  if (profile && !isAdmin) {
    try {
      const userStation = await getUserStation(profile.id);
      if (userStation && userStation.id === stationId) {
        isOwner = true;
      }
    } catch (e) {
      console.error("Error verifying station ownership:", e);
    }
  }

  let dbIncidents: any[] = [];
  try {
    dbIncidents = await getEMSIncidents(stationId);
  } catch (e) {
    console.error("Error loading EMS incidents:", e);
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href="/bfp"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to BFP Operations</span>
        </Link>

        {/* Station EMS Header */}
        <div className="p-6 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 red-glow">
              <Ambulance className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Emergency Medical Services Report
                </span>
                <span className="text-[10px] text-zinc-400">•</span>
                <span className="text-[10px] font-semibold text-zinc-600">{station.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                EMS & Ambulance Dispatches
              </h1>
              <p className="text-xs text-zinc-600 mt-1">
                Official run sheets, patient triage logs, and medical response calls for {station.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
              <span className="block text-xl font-black text-black">{dbIncidents.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Calls</span>
            </div>
            {isOwner ? (
              <AddEMSIncidentModal stationId={stationId} />
            ) : isAdmin ? (
              <div className="px-3.5 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-center flex items-center gap-1.5 text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Regional Oversight (Read-Only)</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* EMS Dispatches List or Zero-State */}
      {dbIncidents.length === 0 ? (
        <div className="p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
            <Ambulance className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-black">No EMS Calls Logged</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {isOwner
              ? `There are no medical runs or ambulance transports recorded yet for ${station.name}. Click "Log EMS Dispatch" above to record a call.`
              : `There are no medical runs or ambulance transports recorded yet for ${station.name}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-black">Pre-Hospital Patient Care Records</h2>
            <p className="text-xs text-zinc-500">Official emergency medical run sheets logged by certified station EMTs.</p>
          </div>

          {dbIncidents.map((log) => (
            <div
              key={log.id}
              className="p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-zinc-300 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-mono font-bold">
                    {log.id.substring(0, 8)}
                  </span>
                  <h3 className="text-base font-black text-black">{log.incident_type}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    {log.severity || "Emergency"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                    <CheckCircle2 className="w-3 h-3" />
                    {log.status || "Active"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-semibold text-black">{log.location}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">Dispatch Timestamp</span>
                  <span className="font-semibold text-black">
                    {new Date(log.reported_at || log.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {log.description && (
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-1">
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">Clinical Notes & Actions Taken</span>
                  <p className="leading-relaxed">{log.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
