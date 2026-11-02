import { getStations, getUserStation } from "@/services/stations";
import { getCurrentProfile } from "@/services/auth";
import Link from "next/link";
import { Building2, MapPin, Phone, ArrowRight, ArrowLeft, Users, Truck, CheckCircle2, Shield, PlusCircle } from "lucide-react";
import CreateStationForm from "@/components/stations/create-station-form";

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
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-3 sm:mb-4"
        >
          <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{isAdmin ? "REGIONAL STATION DIRECTORY" : "MY STATION COMMAND"}</span>
              <span className="sm:hidden">{isAdmin ? "STATION DIRECTORY" : "MY STATION"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {isAdmin ? "All Fire Stations" : userStation ? userStation.name : "Station Setup"}
            </h1>
            <p className="text-[11px] sm:text-sm text-zinc-600">
              {isAdmin
                ? `${stations.length} registered stations across Surigao del Norte`
                : userStation
                ? "Manage personnel roster, apparatus fleet, and operational services for your assigned station."
                : "You do not have a registered fire station yet. Complete the form below to establish your station command."}
            </p>
          </div>
        </div>
      </div>

      {/* VIEW FOR STATION USERS */}
      {!isAdmin && (
        <>
          {userStation ? (
            /* User's Assigned Station Card */
            <div className="p-5 sm:p-8 rounded-2xl bg-white border-2 border-red-600 shadow-md max-w-3xl space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 border-b border-zinc-100 pb-4 sm:pb-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 red-glow shadow-md">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="hidden sm:inline">Active Station Command</span>
                      <span className="sm:hidden">Active Station</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-black">{userStation.name}</h2>
                    <p className="text-[10px] sm:text-xs text-red-600 font-bold uppercase tracking-wider">
                      {userStation.district || "Surigao del Norte District"}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/stations/${userStation.id}`}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all red-glow flex items-center gap-2 self-start shadow-md"
                >
                  <span>Open Station Hub</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>

              {/* Station Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-[10px] sm:text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
                  <span>{userStation.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                  <span className="font-bold text-black">{userStation.contact_number}</span>
                </div>
              </div>

              {/* 2 Quick Choices for Station User */}
              <div className="pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link
                  href={`/stations/${userStation.id}/personnel`}
                  className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-black text-[11px] sm:text-sm block">Station Personnel</span>
                      <span className="text-[10px] sm:text-[11px] text-zinc-500 hidden sm:inline">Manage duty roster & add personnel</span>
                      <span className="text-[10px] sm:text-[11px] text-zinc-500 sm:hidden">Manage personnel</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-red-600 transition-colors" />
                </Link>

                <Link
                  href={`/stations/${userStation.id}/equipment`}
                  className="p-4 sm:p-5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-red-600 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-black text-[11px] sm:text-sm block">Equipment & Services</span>
                      <span className="text-[10px] sm:text-[11px] text-zinc-500 hidden sm:inline">Firetrucks, PPEs & add gear</span>
                      <span className="text-[10px] sm:text-[11px] text-zinc-500 sm:hidden">Equipment & gear</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover:text-red-600 transition-colors" />
                </Link>
              </div>
            </div>
          ) : (
            /* Setup Form for Station User */
            <CreateStationForm />
          )}
        </>
      )}

      {/* VIEW FOR REGIONAL ADMIN ONLY (All Stations) */}
      {isAdmin && (
        <>
          {stations.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-300 mx-auto mb-4" />
              <h2 className="text-base sm:text-lg font-bold text-black mb-1">No Stations Registered</h2>
              <p className="text-[11px] sm:text-xs text-zinc-500">Stations will appear here once registered.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {stations.map((station) => (
                <Link
                  key={station.id}
                  href={`/stations/${station.id}`}
                  className="group p-4 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-red-600 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                        Active
                      </span>
                      {station.district && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline">
                          {station.district}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-black mb-2 sm:mb-3">{station.name}</h3>

                  <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-zinc-600 mb-3 sm:mb-5">
                    {station.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{station.address}</span>
                      </div>
                    )}
                    {station.contact_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600 shrink-0" />
                        <span className="text-black font-semibold">{station.contact_number}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-zinc-100 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-zinc-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
                      <span>Personnel</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
                      <span>Equipment</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
