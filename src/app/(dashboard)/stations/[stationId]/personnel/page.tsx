import { getStationById, getUserStation } from "@/services/stations";
import { getStationMembers } from "@/services/personnel";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { ArrowLeft, Users, Shield, Phone, Mail, Clock, CheckCircle2, UserX, Search, Filter, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import PersonnelRosterView from "@/components/stations/personnel-roster-view";
import AddPersonnelModal from "@/components/stations/add-personnel-modal";
import WeeklyDutyDetail from "@/components/stations/weekly-duty-detail";

const FEMALE_NAMES = new Set([
  "maria", "cristina", "arlene", "leizel", "maricar", "mary", "jane", "sarah", "grace", "ana",
  "joy", "rose", "michelle", "patricia", "jennifer", "elena", "karen", "bea", "catherine",
  "christine", "princess", "mae", "fe", "lourdes", "angel", "angela", "carla", "diana", "joan",
  "rachel", "stephanie", "rowena", "gemma", "cheryl", "luz", "gloria", "fatima", "aileen",
  "hazel", "ivy", "jasmine", "kim", "kristine", "liezel", "liezl", "lorena", "lorraine", "ma.",
  "maricel", "marilou", "rhea", "ruby", "sheila", "sheryl", "vanessa", "victoria", "wilma",
  "zenaida", "teresa", "theresa", "clarisse", "cynthia", "danica", "ella", "emily", "evelyn",
  "florence", "ginah", "gina", "judy", "julie", "lea", "leah", "liza", "lucille", "marissa"
]);

function detectGender(firstName: string = ""): "male" | "female" {
  const parts = firstName.toLowerCase().split(/[\s.-]+/);
  for (const part of parts) {
    if (FEMALE_NAMES.has(part)) return "female";
  }
  return "male";
}

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
  const finalRoster = members.map((m: any, idx: number) => {
    const firstName = m.profiles?.first_name || "";
    const lastName = m.profiles?.last_name || "";
    const gender = detectGender(firstName);

    let position = m.position || "Firefighter / EMS";
    let shift = idx % 2 === 0 ? "Shift Alpha (08:00 - 20:00)" : "Shift Bravo (20:00 - 08:00)";
    let status: "on_duty" | "off_duty" = idx % 2 === 0 ? "on_duty" : "off_duty";

    if (m.position && m.position.includes(" • Shift ")) {
      const parts = m.position.split(" • Shift ");
      position = parts[0];
      shift = "Shift " + parts[1];
    } else if (m.position && m.position.includes(" • ")) {
      const parts = m.position.split(" • ");
      position = parts[0];
      shift = parts[1];
    }

    if (shift.toLowerCase().includes("off")) {
      status = "off_duty";
    } else if (shift.toLowerCase().includes("alpha") || shift.toLowerCase().includes("day")) {
      status = "on_duty";
    } else if (shift.toLowerCase().includes("bravo") || shift.toLowerCase().includes("night")) {
      status = "on_duty";
    }

    return {
      id: m.id,
      profileId: m.profiles?.id || m.profile_id,
      firstName,
      lastName,
      name: m.profiles ? `${m.profiles.first_name} ${m.profiles.last_name}` : `Officer #${idx + 1}`,
      rank: m.rank || "Fire Officer 1",
      position,
      status,
      gender: gender as ("male" | "female"),
      shift,
      contact: m.profiles?.contact_number || "Not listed",
      email: m.profiles?.email || "officer@bfp.gov.ph",
      badgeNo: `BFP-SRG-${1000 + idx}`,
      specialization: position,
    };
  });

  const onDutyCount = finalRoster.filter(p => p.status === "on_duty").length;
  const offDutyCount = finalRoster.filter(p => p.status === "off_duty").length;

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

        {/* Station Roster Header */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
                <span>PERSONNEL ROSTER • {station.name.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                Personnel & Duty Status
              </h1>
              <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
                Real-time tracking of active stationed firefighters, shift commanders, and paramedics on duty vs off duty.
              </p>
            </div>

            {/* Quick Metrics & Add Action */}
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1 sm:flex-initial">
              <div className="px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-center">
                <span className="block text-lg sm:text-xl font-black text-white">{finalRoster.length}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Total</span>
              </div>
              <div className="px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/20 border border-white/30 text-center">
                <span className="block text-lg sm:text-xl font-black text-white">{onDutyCount}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-200">On Duty</span>
              </div>
              <div className="px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-center">
                <span className="block text-lg sm:text-xl font-black text-white/80">{offDutyCount}</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-200">Off Duty</span>
              </div>
            </div>
            {isOwner ? (
              <AddPersonnelModal stationId={stationId} />
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

      {/* Weekly Duty Detail Section */}
      {finalRoster.length > 0 && (
        <WeeklyDutyDetail roster={finalRoster} stationName={station.name} stationId={stationId} isOwner={isOwner} />
      )}

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
        <PersonnelRosterView roster={finalRoster} stationId={stationId} isOwner={isOwner} />
      )}
    </div>
  );
}
