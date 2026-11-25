import { getCurrentProfile, getPendingProfiles } from "@/services/auth";
import { getStations, getUserStation } from "@/services/stations";
import { getDashboardData } from "@/services/dashboard";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import DashboardCardsView from "@/components/dashboard/dashboard-cards-view";
import QuickActionsPanel from "@/components/dashboard/quick-actions-panel";
import RealTimeActivityFeed from "@/components/dashboard/real-time-activity-feed";
import StationPerformanceMetrics from "@/components/dashboard/station-performance-metrics";

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
  let pendingCount = 0;
  let userStation = null;

  if (isAdmin) {
    try {
      const pending = await getPendingProfiles();
      pendingCount = pending.length;
    } catch (e) {
      console.error("Admin dashboard pending count error:", e);
    }
  } else {
    try {
      userStation = await getUserStation(profile.id);
    } catch (e) {
      console.error("Error fetching user station:", e);
    }
  }

  // Fetch comprehensive consolidated dashboard data (activities, performance, metrics)
  const { summaryMetrics, activities, performanceMetrics, stations } =
    await getDashboardData();

  const stationsCount = summaryMetrics.totalStations;

  // Format station options for Quick Actions selector (admin use)
  const stationOptions = stations.map((s) => ({
    id: s.id,
    stationName: s.stationName,
    district: s.district,
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
              <span>
                {isAdmin
                  ? "PROVINCIAL ADMIN • SURIGAO DEL NORTE"
                  : userStation
                  ? `STATION OFFICER • ${userStation.name.toUpperCase()}`
                  : "STATION OFFICER PORTAL"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
              Welcome back, {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
              {isAdmin
                ? "Manage fire stations across Surigao del Norte. Review personnel, equipment, real-time activity, and operational performance."
                : userStation
                ? `Manage operations for ${userStation.name}. Track personnel, equipment, incidents, and duty schedules.`
                : "Manage your station operations. Track personnel, equipment, incidents, and duty schedules."}
            </p>
          </div>

          {/* Rotating Surigao del Norte Seal Logo - Moved to Right */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full p-1 bg-white/10 backdrop-blur-sm border border-white/20 shadow-md flex items-center justify-center overflow-hidden">
              <Image
                src="/images/Surigao del Norte Fire Protection Seal.png"
                alt="Surigao del Norte Fire Protection Seal"
                width={96}
                height={96}
                className="w-full h-full object-contain animate-spin-slow drop-shadow-md select-none pointer-events-none"
                priority
              />
            </div>
          </div>
        </div>

        {isAdmin && pendingCount > 0 && (
          <div className="flex pt-1 sm:pt-0">
            <Link
              href="/admin/registrations"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 active:bg-zinc-100 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shrink-0 touch-manipulation min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Pending Users ({pendingCount})</span>
            </Link>
          </div>
        )}
      </div>

      {/* 1. Quick Actions Panel: Role-tailored (admin vs station user) */}
      <QuickActionsPanel
        isAdmin={isAdmin}
        userStationId={userStation?.id}
        stations={stationOptions}
      />

      {/* 2. Command Center Modules with Grid / List Layout Toggle */}
      <DashboardCardsView stationsCount={stationsCount} />

      {/* 3. Operations Section: Role-tailored layout */}
      {isAdmin ? (
        /* Admin side: Side-by-side Real-Time Activity Feed & Station Performance Metrics */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <RealTimeActivityFeed initialActivities={activities} />
          <StationPerformanceMetrics metrics={performanceMetrics} />
        </div>
      ) : null}
    </div>
  );
}
