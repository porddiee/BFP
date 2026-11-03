import { getStations, getUserStation } from "@/services/stations";
import { getCurrentProfile } from "@/services/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowLeft, Building2, MapPin, Flame, CheckCircle2 } from "lucide-react";

export default async function BFPFireIncidentsStationsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") {
    const userStation = await getUserStation(profile.id);
    if (userStation) {
      redirect(`/bfp/fire-incidents/${userStation.id}`);
    }
  }

  let stations: any[] = [];
  try {
    stations = await getStations();
  } catch (e) {
    console.error("Error fetching stations for fire incidents:", e);
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
        <div className="p-4 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 red-glow">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  BFP OPERATIONAL MODULE • FIRE INCIDENTS
                </span>
                <span className="text-[10px] text-zinc-400">•</span>
                <span className="text-[10px] font-semibold text-zinc-600">Surigao del Norte</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight break-words">
                Fire Incidents — Select a Fire Station
              </h1>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Select any station below to review their logged structural fires, active alarm dispatches, and arson investigation reports.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 sm:py-2.5 rounded-xl bg-red-50 border border-red-200 text-center shrink-0 w-full sm:w-auto">
            <span className="block text-lg sm:text-xl font-black text-red-600">{stations.length}</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-700">Reporting Stations</span>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stations.map((st) => (
          <Link
            key={st.id}
            href={`/bfp/fire-incidents/${st.id}`}
            className="group p-4 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between touch-manipulation min-h-[170px]"
          >
            <div>
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                  Logs Active
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
              <span className="text-zinc-500 font-medium">View Fire Incidents</span>
              <span className="font-bold text-red-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Open Reports <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
