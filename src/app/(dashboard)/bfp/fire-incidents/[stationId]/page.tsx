import { getStationById, getUserStation } from "@/services/stations";
import { getFireIncidents } from "@/services/reports";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { ArrowLeft, Flame, AlertTriangle, CheckCircle2, Clock, MapPin, Truck, ShieldAlert, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import AddFireIncidentModal from "@/components/incidents/add-fire-incident-modal";

export default async function StationFireIncidentsPage({
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
    dbIncidents = await getFireIncidents(stationId);
  } catch (e) {
    console.error("Error loading fire incidents:", e);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href="/bfp"
          className="inline-flex items-center gap-1.5 py-1 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-3 sm:mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to BFP Operations</span>
        </Link>

        {/* Station Fire Incidents Header */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
                <span>FIRE SUPPRESSION LOGS • {station.name.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                Fire Incidents & Alarm History
              </h1>
              <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
                Official operational logs of fire alarms, apparatus dispatches, and suppression reports for this station.
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <div className="px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center flex-1 sm:flex-initial">
              <span className="block text-lg sm:text-xl font-black text-white">{dbIncidents.length}</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Total Fires</span>
            </div>
            {isOwner ? (
              <AddFireIncidentModal stationId={stationId} />
            ) : isAdmin ? (
              <div className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-center flex items-center justify-center gap-1.5 text-red-100">
                <Lock className="w-3.5 h-3.5 shrink-0 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">Regional Oversight (Read-Only)</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>

      {/* Incident Cards or Empty State */}
      {dbIncidents.length === 0 ? (
        <div className="p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-black">No Fire Incidents Logged</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {isOwner
              ? `There are no fire suppression calls recorded for ${station.name}. Click "Report Fire Incident" above to log an incident report.`
              : `There are no fire suppression calls recorded for ${station.name}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {dbIncidents.map((inc) => (
            <div
              key={inc.id}
              className="p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-zinc-300 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-mono font-bold">
                    {inc.id.substring(0, 8)}
                  </span>
                  <h3 className="text-base font-black text-black">{inc.incident_type}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    {inc.severity}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto capitalize">
                  <CheckCircle2 className="w-3 h-3" />
                  {inc.status || "Active"}
                </span>
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
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">Details & Investigation</span>
                  <p className="leading-relaxed">{inc.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
