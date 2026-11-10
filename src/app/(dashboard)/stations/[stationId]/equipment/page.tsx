import { getStationById, getUserStation } from "@/services/stations";
import { getEquipment } from "@/services/equipment";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { ArrowLeft, Truck, Shield, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import AddEquipmentModal from "@/components/stations/add-equipment-modal";
import EquipmentRosterView from "@/components/stations/equipment-roster-view";

export default async function StationEquipmentPage({
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

  let dbEquipment: any[] = [];
  try {
    dbEquipment = await getEquipment(stationId);
  } catch (e) {
    console.error("Error loading equipment:", e);
  }

  // Filter actual items from the database
  const apparatusList = dbEquipment.filter((eq) =>
    ["Fire Truck", "Water Tanker", "Rescue Vehicle", "Ambulance", "Fire Apparatus"].some(t => 
      eq.type?.toLowerCase().includes(t.toLowerCase()) || eq.name?.toLowerCase().includes("truck") || eq.name?.toLowerCase().includes("engine")
    ) || !eq.type?.toLowerCase().includes("ppe")
  );

  const ppeList = dbEquipment.filter((eq) =>
    eq.type?.toLowerCase().includes("ppe") || eq.type?.toLowerCase().includes("gear") || eq.type?.toLowerCase().includes("scba")
  );

  const operationalCount = dbEquipment.filter((eq) => eq.status === "operational").length;
  const readinessPct = dbEquipment.length > 0 ? Math.round((operationalCount / dbEquipment.length) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href={`/stations/${stationId}`}
          className="inline-flex items-center gap-1.5 py-1 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-3 sm:mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {station.name}</span>
        </Link>

        {/* Station Equipment Header */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
                <span>EQUIPMENT & FLEET • {station.name.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                Available Fire Trucks & PPEs
              </h1>
              <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
                Inventory of frontline apparatus, protective equipment readiness, and operational services registered to this station.
              </p>
            </div>

            {/* Quick Metrics & Add Action */}
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 sm:flex-initial">
              <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-center">
                <span className="block text-lg sm:text-xl font-black text-white">{apparatusList.length}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Apparatus</span>
              </div>
              <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/20 border border-white/30 text-center">
                <span className="block text-lg sm:text-xl font-black text-white">
                  {dbEquipment.length > 0 ? `${readinessPct}%` : "N/A"}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-200">Readiness</span>
              </div>
            </div>
            {isOwner ? (
              <AddEquipmentModal stationId={stationId} />
            ) : isAdmin ? (
              <div className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-center flex items-center justify-center gap-1.5 text-white/80">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Regional Oversight (Read-Only)</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>

      {/* Interactive Equipment & PPE Roster with full CRUD for owners */}
      <EquipmentRosterView stationId={stationId} isOwner={isOwner} equipment={dbEquipment} />
    </div>
  );
}
