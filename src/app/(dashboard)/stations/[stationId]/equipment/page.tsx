import { getStationById, getUserStation } from "@/services/stations";
import { getEquipment } from "@/services/equipment";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { ArrowLeft, Truck, Shield, CheckCircle2, AlertTriangle, Flame, ShieldAlert, LifeBuoy, Wrench, Activity, PlusCircle, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import AddEquipmentModal from "@/components/stations/add-equipment-modal";

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

      {/* SECTION 1: Available Fire Trucks & Heavy Apparatus */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-black">Available Fire Trucks & Apparatus</h2>
            <p className="text-xs text-zinc-500">Frontline engines, tankers, and rescue vehicles stationed for rapid deployment.</p>
          </div>
        </div>

        {apparatusList.length === 0 ? (
          <div className="p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-black">No Apparatus Registered Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {isOwner
                ? "This station has no fire engines or rescue trucks logged yet. Click \"+ Add Apparatus\" above to register your station's vehicles."
                : `This station has no fire engines or rescue trucks logged yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {apparatusList.map((truck) => (
              <div
                key={truck.id}
                className="p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                          {truck.type || "Apparatus"}
                        </span>
                        <span className="text-[10px] text-zinc-400">•</span>
                        <span className="text-[10px] font-mono text-zinc-500">{truck.serial_number || "NO-PLATE"}</span>
                      </div>
                      <h3 className="text-base font-black text-black">{truck.name}</h3>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      truck.status === "operational"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        truck.status === "operational" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    <span className="capitalize">{truck.status || "Operational"}</span>
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-zinc-500">
                  <span>Serial / Plate: <strong className="text-black font-mono">{truck.serial_number}</strong></span>
                  <span>Category: <strong className="text-black">{truck.type}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Personal Protective Equipment (PPE) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-black">Personal Protective Equipment (PPE) & Specialized Gear</h2>
          <p className="text-xs text-zinc-500">Firefighter bunker turnout gear, SCBA units, and protective safety equipment logged for this station.</p>
        </div>

        {ppeList.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl">
            <Shield className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-500">
              No individual PPE items logged yet. Use &quot;Add Apparatus / PPE&quot; above to record SCBA units, bunker suits, or helmets.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Equipment Name</th>
                    <th className="py-3 px-4 sm:px-6">Type</th>
                    <th className="py-3 px-4 sm:px-6">Serial / Tag</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {ppeList.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-black flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-zinc-600">{item.type}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-zinc-500">{item.serial_number}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
