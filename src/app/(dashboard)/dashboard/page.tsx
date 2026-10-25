import { getCurrentProfile, getPendingProfiles } from "@/services/auth";
import { getStations, getPendingStations } from "@/services/stations";
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
        <p className="text-xs text-zinc-500 mb-6">Unable to load profile. This usually means:</p>
        <ul className="text-xs text-zinc-500 text-left mb-6 space-y-1">
          <li>• Your profile record hasn&apos;t been created in the database</li>
          <li>• Your profile approval status is not &apos;approved&apos;</li>
          <li>• Row Level Security policies are blocking access</li>
        </ul>
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
  let pendingStationsCount = 0;

  if (isAdmin) {
    try {
      const stations = await getStations();
      stationsCount = stations.length;
      const pending = await getPendingProfiles();
      pendingCount = pending.length;
      const pendingStations = await getPendingStations();
      pendingStationsCount = pendingStations.length;
    } catch (e) {
      console.error("Admin dashboard fetch error:", e);
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
                  : "STATION OFFICER PORTAL"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-2xl">
              {isAdmin
                ? "Manage fire stations across Surigao del Norte. Review personnel, equipment, and operational reports."
                : "Your account is approved. Manage your station&apos;s personnel, equipment, and incident reports."}
            </p>
          </div>

          {isAdmin && (pendingCount > 0 || pendingStationsCount > 0) && (
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <Link
                  href="/admin/registrations"
                  className="px-4 py-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Pending Users ({pendingCount})</span>
                </Link>
              )}
              {pendingStationsCount > 0 && (
                <Link
                  href="/stations"
                  className="px-4 py-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Pending Stations ({pendingStationsCount})</span>
                </Link>
              )}
            </div>
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
              View all registered fire stations across Surigao del Norte. Access each station&apos;s personnel roster and available equipment &amp; services.
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
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 max-w-2xl mx-auto space-y-2">
          <span className="font-bold text-sm block">Coming Soon in Phase 2</span>
          <p className="text-xs leading-relaxed">
            Station user features will be available in Phase 2. Currently, please use the admin account to manage stations and personnel.
          </p>
        </div>
      )}
    </div>
  );
}
