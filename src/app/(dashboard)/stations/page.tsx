import { getStations, getUserStation } from "@/services/stations";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { Building2, MapPin, Phone, ArrowRight, Users, Truck, CheckCircle2, Shield, PlusCircle } from "lucide-react";
import CreateStationForm from "@/components/stations/create-station-form";
import StationsInteractiveView from "@/components/stations/stations-interactive-view";

export default async function StationsListPage() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  // For Station Users: check if they already have an established station
  let userStation = null;
  if (profile && !isAdmin) {
    try {
      userStation = await getUserStation(profile.id);
    } catch (e) {
      console.error("Error fetching user station:", e);
    }
  }

  // For Regional Admins: fetch all stations across Surigao
  let stations: Awaited<ReturnType<typeof getStations>> = [];
  if (isAdmin) {
    try {
      stations = await getStations();
    } catch (e) {
      console.error("Stations fetch error:", e);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header Banner */}
      <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
              <span>{isAdmin ? "REGIONAL STATION DIRECTORY • SURIGAO DEL NORTE" : "MY STATION COMMAND"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
              {isAdmin ? "All Fire Stations" : userStation ? userStation.name : "Station Setup"}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
              {isAdmin
                ? `${stations.length} registered stations across Surigao del Norte. Review active rosters, equipment status, and station commands.`
                : userStation
                ? "Manage personnel roster, apparatus fleet, and operational services for your assigned station."
                : "You do not have a registered fire station yet. Complete the form below to establish your station command."}
            </p>
          </div>

          {isAdmin && (
            <div className="relative px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <span className="block text-lg sm:text-xl font-black text-white">{stations.length}</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Stations Active</span>
            </div>
          )}
        </div>
      </div>

      {/* VIEW FOR STATION USERS */}
      {!isAdmin && (
        <>
          {userStation ? (
            /* User's Assigned Station Card */
            <div className="p-4 sm:p-8 rounded-2xl bg-white border-2 border-red-600 shadow-md max-w-3xl space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-100 pb-4 sm:pb-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 red-glow shadow-md">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Station Command</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-black break-words">{userStation.name}</h2>
                    <p className="text-[10px] sm:text-xs text-red-600 font-bold uppercase tracking-wider">
                      {userStation.district || "Surigao del Norte District"}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/stations/${userStation.id}`}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition-all red-glow flex items-center justify-center gap-2 shadow-md touch-manipulation min-h-[44px]"
                >
                  <span>Open Station Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Station Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span className="break-words">{userStation.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-600 shrink-0" />
                  {userStation.contact_number ? (
                    <a
                      href={`tel:${userStation.contact_number}`}
                      className="font-bold text-black hover:text-red-600 hover:underline touch-manipulation"
                    >
                      {userStation.contact_number}
                    </a>
                  ) : (
                    <span className="text-zinc-400">No contact provided</span>
                  )}
                </div>
              </div>

              {/* 2 Quick Choices for Station User */}
              <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link
                  href={`/stations/${userStation.id}/personnel`}
                  className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 active:bg-zinc-100 transition-all group flex items-center justify-between touch-manipulation min-h-[64px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-black text-xs sm:text-sm block">Station Personnel</span>
                      <span className="text-[11px] text-zinc-500 block">Duty roster & officers</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 transition-colors shrink-0" />
                </Link>

                <Link
                  href={`/stations/${userStation.id}/equipment`}
                  className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 active:bg-zinc-100 transition-all group flex items-center justify-between touch-manipulation min-h-[64px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-black text-xs sm:text-sm block">Equipment & Services</span>
                      <span className="text-[11px] text-zinc-500 block">Firetrucks & PPE fleet</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 transition-colors shrink-0" />
                </Link>
              </div>
            </div>
          ) : (
            /* Setup Form for Station User */
            <CreateStationForm />
          )}
        </>
      )}

      {/* VIEW FOR REGIONAL ADMIN ONLY (All Stations with Grid / List Toggle) */}
      {isAdmin && (
        <StationsInteractiveView stations={stations} />
      )}
    </div>
  );
}
