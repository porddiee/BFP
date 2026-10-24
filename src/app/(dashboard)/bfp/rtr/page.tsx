import { getStations, getUserStation } from "@/services/stations";
import { getCurrentProfile } from "@/services/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LifeBuoy, ArrowRight, ArrowLeft, Building2, MapPin, Phone, Shield, CheckCircle2 } from "lucide-react";

export default async function BFPRTRStationsPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role !== "admin") {
    const userStation = await getUserStation(profile.id);
    if (userStation) {
      redirect(`/bfp/rtr/${userStation.id}`);
    }
  }

  let stations: any[] = [];
  try {
    stations = await getStations();
  } catch (e) {
    console.error("Error fetching stations for RTR:", e);
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
          <span>Back to BFP Choices</span>
        </Link>

        {/* Section Header */}
        <div className="p-6 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 red-glow">
              <LifeBuoy className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  BFP OPERATIONAL MODULE • RTR
                </span>
                <span className="text-[10px] text-zinc-400">•</span>
                <span className="text-[10px] font-semibold text-zinc-600">Surigao del Norte</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                RTR — Select a Fire Station
              </h1>
              <p className="text-xs text-zinc-600 mt-1">
                Select any station below to inspect their Rapid, Tactical, Response (RTR) rescue capabilities, flood teams, and tactical deployment records.
              </p>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-center shrink-0">
            <span className="block text-xl font-black text-red-600">{stations.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">RTR Units Active</span>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((st) => (
          <Link
            key={st.id}
            href={`/bfp/rtr/${st.id}`}
            className="group p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  RTR Ready
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {st.district && (
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                    {st.district}
                  </span>
                )}
                <h3 className="text-lg font-black text-black group-hover:text-red-600 transition-colors">
                  {st.name}
                </h3>
                {st.address && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{st.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">View Station RTR</span>
              <span className="font-bold text-red-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Open RTR <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
