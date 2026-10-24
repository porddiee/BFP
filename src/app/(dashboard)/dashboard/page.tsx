import { getCurrentProfile, getPendingProfiles } from "@/services/auth";
import { getStations, getUserStation } from "@/services/stations";
import Link from "next/link";
import { 
  Building2, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Users,
  Truck,
  AlertTriangle,
  Ambulance,
  LifeBuoy
} from "lucide-react";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="text-center py-20 bg-white border border-zinc-200 rounded-2xl max-w-lg mx-auto shadow-sm">
        <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-black mb-2">Session Expired</h2>
        <p className="text-xs text-zinc-500 mb-6">Unable to load profile. Please sign in again.</p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider red-glow"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const isAdmin = profile.role === "admin";
  let stationsCount = 0;
  let pendingCount = 0;
  let userStation = null;

  if (isAdmin) {
    try {
      const stations = await getStations();
      stationsCount = stations.length;
      const pending = await getPendingProfiles();
      pendingCount = pending.length;
    } catch (e) {
      console.error("Admin dashboard fetch error:", e);
    }
  } else {
    try {
      userStation = await getUserStation(profile.id);
    } catch (e) {
      console.error("User station fetch error:", e);
    }
  }

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-white/10 blur-[80px] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>
                {isAdmin
                  ? "REGIONAL ADMIN • SURIGAO DEL NORTE"
                  : userStation
                  ? `STATION COMMAND • ${userStation.name.toUpperCase()}`
                  : "STATION OFFICER PORTAL"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-2xl">
              {isAdmin
                ? "Manage fire stations across Surigao del Norte. Review personnel, equipment, and operational reports."
                : userStation
                ? `Authorized commander for ${userStation.name}. Manage your stationed personnel roster, apparatus readiness, and operational logs.`
                : "Your account is approved. Complete your station setup below to begin managing personnel and incident reports."}
            </p>
          </div>

          {isAdmin && pendingCount > 0 && (
            <Link
              href="/admin/registrations"
              className="px-4 py-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shrink-0"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Pending Approvals ({pendingCount})</span>
            </Link>
          )}
        </div>
      </div>

      {/* REGIONAL ADMIN VIEW */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STATIONS Card */}
          <Link
            href="/stations"
            className="group p-8 sm:p-10 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow">
                <Building2 className="w-8 h-8" />
              </div>
              <ArrowRight className="w-6 h-6 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>

            <h2 className="text-2xl font-black text-black mb-2">Stations</h2>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              View all registered fire stations across Surigao del Norte. Access each station&apos;s personnel roster and available equipment & services.
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Building2 className="w-3.5 h-3.5 text-red-600" />
                <span><strong className="text-black">{stationsCount}</strong> Active Stations</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Users className="w-3.5 h-3.5 text-red-600" />
                <span>Personnel</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Truck className="w-3.5 h-3.5 text-red-600" />
                <span>Equipment</span>
              </div>
            </div>
          </Link>

          {/* BFP Card */}
          <Link
            href="/bfp"
            className="group p-8 sm:p-10 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow">
                <Flame className="w-8 h-8" />
              </div>
              <ArrowRight className="w-6 h-6 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>

            <h2 className="text-2xl font-black text-black mb-2">BFP</h2>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              Bureau of Fire Protection operational modules. Access RTR rescue operations, fire incident reports, and emergency medical services across all stations.
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <LifeBuoy className="w-3.5 h-3.5 text-red-600" />
                <span>RTR</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Fire Incidents</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Ambulance className="w-3.5 h-3.5 text-red-600" />
                <span>EMS</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* STATION USER VIEW */}
      {!isAdmin && (
        <>
          {userStation ? (
            /* Station User with registered station */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* My Station Card */}
              <Link
                href={`/stations/${userStation.id}`}
                className="group p-8 sm:p-10 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span>Assigned Command</span>
                </div>
                <h2 className="text-2xl font-black text-black mb-1">{userStation.name}</h2>
                <p className="text-xs text-zinc-500 mb-4">{userStation.address}</p>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                  Manage your on-duty and off-duty personnel roster, enroll new officers, and maintain available fire trucks and PPE inventories.
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
                  <span className="text-xs font-bold text-red-600 group-hover:underline">Manage Station &rarr;</span>
                </div>
              </Link>

              {/* BFP Modules for this station */}
              <Link
                href="/bfp"
                className="group p-8 sm:p-10 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow">
                    <Flame className="w-8 h-8" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span>Operational Logs</span>
                </div>
                <h2 className="text-2xl font-black text-black mb-1">BFP Operations</h2>
                <p className="text-xs text-zinc-500 mb-4">RTR Rescue • Fire Incidents • EMS Calls</p>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                  Access and update operational logs for {userStation.name}. Review RTR rescue missions, fire alarm history, and emergency medical dispatches.
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
                  <span className="text-xs font-bold text-red-600 group-hover:underline">View Station Logs &rarr;</span>
                </div>
              </Link>
            </div>
          ) : (
            /* Station User without a station: show message */
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 max-w-2xl mx-auto space-y-2">
              <span className="font-bold text-sm block">Station Setup Required</span>
              <p className="text-xs leading-relaxed">
                As a Station Officer, your first step is to establish your local fire station. Contact an administrator to register your station.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
