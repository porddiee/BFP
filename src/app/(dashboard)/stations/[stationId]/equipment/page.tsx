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
    <div className="space-y-10">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href={`/stations/${stationId}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {station.name}</span>
        </Link>

        {/* Station Equipment Header */}
        <div className="p-6 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 red-glow">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Station Equipment & Services
                </span>
                <span className="text-[10px] text-zinc-400">•</span>
                <span className="text-[10px] font-semibold text-zinc-600">{station.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Available Fire Trucks & PPEs
              </h1>
              <p className="text-xs text-zinc-600 mt-1">
                Inventory of frontline apparatus, protective equipment readiness, and operational services registered to this station.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Add Action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
              <span className="block text-xl font-black text-black">{apparatusList.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Apparatus</span>
            </div>
            <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="block text-xl font-black text-emerald-700">
                {dbEquipment.length > 0 ? `${readinessPct}%` : "N/A"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Readiness</span>
            </div>
            {isOwner ? (
              <AddEquipmentModal stationId={stationId} />
            ) : isAdmin ? (
              <div className="px-3.5 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-center flex items-center gap-1.5 text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Regional Oversight (Read-Only)</span>
              </div>
            ) : null}
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

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
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
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Equipment Name</th>
                    <th className="py-3.5 px-6">Type</th>
                    <th className="py-3.5 px-6">Serial / Tag</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {ppeList.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-black flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-4 px-6 text-zinc-600">{item.type}</td>
                      <td className="py-4 px-6 font-mono text-zinc-500">{item.serial_number}</td>
                      <td className="py-4 px-6 text-right">
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
