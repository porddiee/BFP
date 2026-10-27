import Link from "next/link";
import { LifeBuoy, AlertTriangle, Ambulance, ArrowRight, ArrowLeft, ShieldAlert, Activity } from "lucide-react";
import { Logo } from "@/components/logo";
import { getStations, getUserStation } from "@/services/stations";
import { getCurrentProfile } from "@/services/auth";

export default async function BFPCommandPage() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  let userStation = null;
  if (profile && !isAdmin) {
    try {
      userStation = await getUserStation(profile.id);
    } catch (e) {
      console.error("Error loading user station for BFP:", e);
    }
  }

  // Dynamic links: station users go straight to their station modules, admins go to regional list
  const rtrHref = !isAdmin && userStation ? `/bfp/rtr/${userStation.id}` : "/bfp/rtr";
  const fireHref = !isAdmin && userStation ? `/bfp/fire-incidents/${userStation.id}` : "/bfp/fire-incidents";
  const emsHref = !isAdmin && userStation ? `/bfp/ems/${userStation.id}` : "/bfp/ems";

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Banner Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-full bg-white/10 blur-[80px] pointer-events-none" />
          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
              <Logo size="sm" />
              <span>
                {isAdmin
                  ? "BFP REGIONAL OPERATIONAL MODULES"
                  : userStation
                  ? `${userStation.name.toUpperCase()} • OPERATIONS`
                  : "BFP OPERATIONAL MODULES"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isAdmin
                ? "Bureau of Fire Protection Command Choices"
                : "Station Operational Modules"}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
              {isAdmin
                ? "Select an operational pillar below to review station-by-station readiness, incident reports, and tactical emergency deployments across Surigao del Norte."
                : userStation
                ? `Manage RTR specialized rescue teams, log fire incidents, and track EMS ambulance runs for ${userStation.name}.`
                : "Access RTR rescue operations, structural fire logs, and emergency medical services."}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Prominent Choices: RTR, Fire Incident, EMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. RTR Choice */}
        <Link
          href={rtrHref}
          className="group p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow">
                <LifeBuoy className="w-7 h-7" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-2">
              <span>SPECIAL RESCUE UNIT</span>
            </div>
            <h2 className="text-2xl font-black text-black mb-2">
              {!isAdmin && userStation ? "My Station RTR" : "RTR"}
            </h2>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Rapid, Tactical, Response
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              Search and rescue operations, specialized typhoon flood interventions, high-angle rope rescue, and tactical emergency missions.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>
              {!isAdmin && userStation ? "Open Station RTR Log" : "View Stations RTR"}
            </span>
            <span className="font-bold text-red-600 group-hover:underline">Explore &rarr;</span>
          </div>
        </Link>

        {/* 2. Fire Incident Choice */}
        <Link
          href={fireHref}
          className="group p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-2">
              <span>FIRE SUPPRESSION</span>
            </div>
            <h2 className="text-2xl font-black text-black mb-2">
              {!isAdmin && userStation ? "My Fire Incidents" : "Fire Incident"}
            </h2>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Alarms & Structural Reports
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              Active fire dispatches, multi-alarm level escalations, post-fire structural damage reports, and casualty logs.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>
              {!isAdmin && userStation ? "Open Fire Incident Log" : "View Stations Incidents"}
            </span>
            <span className="font-bold text-red-600 group-hover:underline">Explore &rarr;</span>
          </div>
        </Link>

        {/* 3. EMS Choice */}
        <Link
          href={emsHref}
          className="group p-8 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors red-glow">
                <Ambulance className="w-7 h-7" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all mt-2" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-wider mb-2">
              <span>MEDICAL RESPONSE</span>
            </div>
            <h2 className="text-2xl font-black text-black mb-2">
              {!isAdmin && userStation ? "My EMS Records" : "EMS"}
            </h2>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Emergency Medical Services
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              Pre-hospital emergency care, paramedic triage, road trauma response, ambulance dispatches, and hospital patient transfers.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>
              {!isAdmin && userStation ? "Open Station EMS Log" : "View Stations EMS"}
            </span>
            <span className="font-bold text-red-600 group-hover:underline">Explore &rarr;</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
