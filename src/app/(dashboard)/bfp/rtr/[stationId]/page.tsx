import { getStationById, getUserStation } from "@/services/stations";
import { getEquipment } from "@/services/equipment";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { ArrowLeft, LifeBuoy, Shield, CheckCircle2, Clock, MapPin, Users, Phone, AlertCircle, Anchor, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import AddEquipmentModal from "@/components/stations/add-equipment-modal";

export default async function StationRTRDetailPage({
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

  // Query actual rescue equipment registered to this station
  let dbEquipment: any[] = [];
  try {
    dbEquipment = await getEquipment(stationId);
  } catch (e) {
    console.error("Error loading rescue assets:", e);
  }

  const rescueAssets = dbEquipment.filter((eq) =>
    eq.type?.toLowerCase().includes("rescue") || 
    eq.name?.toLowerCase().includes("rescue") || 
    eq.name?.toLowerCase().includes("boat") ||
    eq.name?.toLowerCase().includes("hydraulic") ||
    eq.name?.toLowerCase().includes("rope")
  );

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

        {/* Station RTR Header */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
                <span>RTR SPECIALIZED RESCUE • {station.name.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                Rapid, Tactical, Response (RTR)
              </h1>
              <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
                Specialized search and rescue detachment, waterborne flood response equipment, and tactical mission logs for {station.name}.
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <div className="px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center flex-1 sm:flex-initial">
              <span className="block text-lg sm:text-xl font-black text-white">{rescueAssets.length}</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Rescue Units</span>
            </div>
            {isOwner ? (
              <AddEquipmentModal stationId={stationId} />
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

      {/* SECTION 1: Tactical Rescue Assets */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-black">RTR Specialized Rescue Assets</h2>
          <p className="text-xs text-zinc-500">Dedicated equipment maintained specifically for water rescues, extrications, and extreme weather response.</p>
        </div>

        {rescueAssets.length === 0 ? (
          <div className="p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-black">No Specialized Rescue Assets Logged</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {isOwner
                ? "This station has no rescue boats, hydraulic cutters, or tactical extrication kits logged yet. Click \"+ Add Apparatus\" to log rescue assets."
                : `This station has no specialized rescue assets logged yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rescueAssets.map((asset) => (
              <div key={asset.id} className="p-5 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                      {asset.type || "Special Rescue Unit"}
                    </span>
                    <h3 className="text-base font-black text-black">{asset.name}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                    <CheckCircle2 className="w-3 h-3" />
                    {asset.status || "Operational"}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Serial / Tag:</span>
                  <span className="font-mono font-bold text-black">{asset.serial_number}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
