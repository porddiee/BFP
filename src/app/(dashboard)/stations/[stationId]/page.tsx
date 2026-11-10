import { getStationById } from "@/services/stations";
import Link from "next/link";
import { Building2, Users, Truck, ArrowRight, ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { notFound } from "next/navigation";

export default async function StationDetailPage({
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/stations"
          className="inline-flex items-center gap-1.5 py-1 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-3 sm:mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Stations</span>
        </Link>

        {/* Station Info Header */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
                <span>{station.district || "BFP Station Unit"} • SURIGAO DEL NORTE</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                {station.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs text-red-100 pt-1">
                {station.address && (
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-200 shrink-0 mt-0.5" />
                    <span className="break-words leading-relaxed">{station.address}</span>
                  </div>
                )}
                {station.contact_number && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                    <a href={`tel:${station.contact_number}`} className="font-semibold text-white hover:text-red-200 hover:underline">
                      {station.contact_number}
                    </a>
                  </div>
                )}
                {station.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-red-200 shrink-0" />
                    <a href={`mailto:${station.email}`} className="text-red-100 hover:text-white hover:underline break-all">
                      {station.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="relative px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <span className="block text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider">Active Command</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Frontline Unit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Choices: Personnel & Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Personnel Card */}
        <Link
          href={`/stations/${stationId}/personnel`}
          className="group p-5 sm:p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-lg touch-manipulation min-h-[140px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                <Users className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>

            <h2 className="text-lg sm:text-xl font-black text-black mb-2">Personnel Roster</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              View the full roster of station personnel. See who is currently on duty and off duty, their ranks, shifts, and contact information.
            </p>
          </div>
        </Link>

        {/* Equipment & Services Card */}
        <Link
          href={`/stations/${stationId}/equipment`}
          className="group p-5 sm:p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 active:bg-zinc-50 transition-all shadow-sm hover:shadow-lg touch-manipulation min-h-[140px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>

            <h2 className="text-lg sm:text-xl font-black text-black mb-2">Equipment & Services</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              View available fire trucks, PPEs, rescue equipment, and other service assets assigned to this station.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
