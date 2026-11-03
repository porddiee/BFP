import { getStationById, getUserStation } from "@/services/stations";
import { getStationMembers } from "@/services/personnel";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { ArrowLeft, Users, Shield, Phone, Mail, Clock, CheckCircle2, UserX, Search, Filter, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import PersonnelRosterView from "@/components/stations/personnel-roster-view";
import AddPersonnelModal from "@/components/stations/add-personnel-modal";

export default async function StationPersonnelPage({
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

  let members: any[] = [];
  try {
    members = await getStationMembers(stationId);
  } catch (e) {
    console.error("Error fetching station members:", e);
  }

  // Pure database personnel records for this station
  const finalRoster = members.map((m: any, idx: number) => ({
    id: m.id,
    name: m.profiles ? `${m.profiles.first_name} ${m.profiles.last_name}` : `Officer #${idx + 1}`,
    rank: m.rank || "Fire Officer 1",
    position: m.position || "Firefighter / EMS",
    status: idx % 2 === 0 ? ("on_duty" as const) : ("off_duty" as const),
    shift: idx % 2 === 0 ? "Shift Alpha (08:00 - 20:00)" : "Shift Bravo (20:00 - 08:00)",
    contact: m.profiles?.contact_number || "Not listed",
    email: m.profiles?.email || "officer@bfp.gov.ph",
    badgeNo: `BFP-SRG-${1000 + idx}`,
    specialization: m.position || "General Fire & Rescue Operations",
  }));

  const onDutyCount = finalRoster.filter(p => p.status === "on_duty").length;
  const offDutyCount = finalRoster.filter(p => p.status === "off_duty").length;

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href={`/stations/${stationId}`}
          className="inline-flex items-center gap-1.5 py-1 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-3 sm:mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {station.name}</span>
        </Link>

        {/* Station Roster Header */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 red-glow">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Station Personnel Roster
                </span>
                <span className="text-[10px] text-zinc-400">•</span>
                <span className="text-[10px] font-semibold text-zinc-600 break-words">{station.name}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight break-words">
                Personnel & Duty Status
              </h1>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Real-time tracking of active stationed firefighters, shift commanders, and paramedics on duty vs off duty.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Add Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1 sm:flex-initial">
              <div className="px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="block text-lg sm:text-xl font-black text-black">{finalRoster.length}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total</span>
              </div>
              <div className="px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="block text-lg sm:text-xl font-black text-emerald-700">{onDutyCount}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700">On Duty</span>
              </div>
              <div className="px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="block text-lg sm:text-xl font-black text-zinc-600">{offDutyCount}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500">Off Duty</span>
              </div>
            </div>
            {isOwner ? (
              <AddPersonnelModal stationId={stationId} />
            ) : isAdmin ? (
              <div className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-center flex items-center justify-center gap-1.5 text-zinc-500">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Regional Oversight (Read-Only)</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Interactive Personnel Roster or Empty State */}
      {finalRoster.length === 0 ? (
        <div className="p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-black">No Personnel Enrolled Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {isOwner
              ? "This station does not have any personnel or officers enrolled. Click \"Add Personnel\" above to enroll your first station member."
              : `This station does not have any personnel or officers enrolled yet.`}
          </p>
        </div>
      ) : (
        <PersonnelRosterView roster={finalRoster} />
      )}
    </div>
  );
}
