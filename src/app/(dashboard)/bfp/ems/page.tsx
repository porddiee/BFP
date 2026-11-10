import { getStations, getUserStation } from "@/services/stations";
import { getCurrentProfile } from "@/services/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Ambulance, ArrowRight, ArrowLeft, Building2, MapPin, Activity, CheckCircle2 } from "lucide-react";

export default async function BFPEMSStationsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") {
    const userStation = await getUserStation(profile.id);
    if (userStation) {
      redirect(`/bfp/ems/${userStation.id}`);
    }
  }

  let stations: any[] = [];
  try {
    stations = await getStations();
  } catch (e) {
    console.error("Error fetching stations for EMS:", e);
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
          <span>Back to BFP Choices</span>
        </Link>

        {/* Section Header */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
                <span>BFP OPERATIONAL MODULE • EMERGENCY MEDICAL SERVICES</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                EMS — Select a Fire Station
              </h1>
              <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
                Select any station below to inspect their Emergency Medical Services (EMS) ambulance dispatches, trauma care records, and patient transfers.
              </p>
            </div>

            <div className="relative px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <span className="block text-lg sm:text-xl font-black text-white">{stations.length}</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Ambulance Hubs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stations.map((st) => (
          <Link
            key={st.id}
            href={`/bfp/ems/${st.id}`}
            className="group p-4 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between touch-manipulation min-h-[170px]"
          >
            <div>
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Medic On Standby
                </span>
              </div>

              <div className="space-y-1 mb-3 sm:mb-4">
                {st.district && (
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                    {st.district}
                  </span>
                )}
                <h3 className="text-base sm:text-lg font-black text-black group-hover:text-red-600 transition-colors break-words">
                  {st.name}
                </h3>
                {st.address && (
                  <div className="flex items-start gap-1.5 text-xs text-zinc-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
                    <span className="break-words line-clamp-2">{st.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">View EMS Records</span>
              <span className="font-bold text-red-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Open EMS <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
