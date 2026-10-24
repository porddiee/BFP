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
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/stations"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Stations</span>
        </Link>

        {/* Station Info Header */}
        <div className="p-6 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {station.district && (
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    {station.district}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">{station.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                {station.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{station.address}</span>
                  </div>
                )}
                {station.contact_number && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span className="font-semibold text-black">{station.contact_number}</span>
                  </div>
                )}
                {station.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{station.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Choices: Personnel & Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personnel Card */}
        <Link
          href={`/stations/${stationId}/personnel`}
          className="group p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-lg"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Users className="w-7 h-7" />
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
          </div>

          <h2 className="text-xl font-black text-black mb-2">Personnel</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            View the full roster of station personnel. See who is currently on duty and off duty, their ranks, and positions.
          </p>
        </Link>

        {/* Equipment & Services Card */}
        <Link
          href={`/stations/${stationId}/equipment`}
          className="group p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-lg"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Truck className="w-7 h-7" />
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
          </div>

          <h2 className="text-xl font-black text-black mb-2">Equipment & Services</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            View available fire trucks, PPEs, rescue equipment, and other service assets assigned to this station.
          </p>
        </Link>
      </div>
    </div>
  );
}
