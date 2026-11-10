import { Logo } from "@/components/logo";
import { getUserStation } from "@/services/stations";
import { getCurrentProfile } from "@/services/auth";
import BfpInteractiveView from "@/components/bfp/bfp-interactive-view";

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
    <div className="space-y-6 sm:space-y-8">
      {/* Page Banner Header */}
      <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
              <span>
                {isAdmin
                  ? "BFP REGIONAL OPERATIONAL MODULES • SURIGAO DEL NORTE"
                  : userStation
                  ? `${userStation.name.toUpperCase()} • OPERATIONS`
                  : "BFP OPERATIONAL MODULES"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
              {isAdmin
                ? "Bureau of Fire Protection Command Choices"
                : "Station Operational Modules"}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
              {isAdmin
                ? "Select an operational pillar below to review station-by-station readiness, incident reports, and tactical emergency deployments across Surigao del Norte."
                : userStation
                ? `Manage RTR specialized rescue teams, log fire incidents, and track EMS ambulance runs for ${userStation.name}.`
                : "Access RTR rescue operations, structural fire logs, and emergency medical services."}
            </p>
          </div>

          <div className="relative px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0 w-full sm:w-auto">
            <span className="block text-lg sm:text-xl font-black text-white">3</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Operational Pillars</span>
          </div>
        </div>
      </div>

      {/* Interactive Operational Modules: Grid or List */}
      <BfpInteractiveView
        isAdmin={isAdmin}
        userStationName={userStation?.name}
        rtrHref={rtrHref}
        fireHref={fireHref}
        emsHref={emsHref}
      />
    </div>
  );
}
