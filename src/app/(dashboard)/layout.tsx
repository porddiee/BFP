import { getCurrentProfile, getPendingProfiles } from "@/services/auth";
import { getUserStation } from "@/services/stations";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  let pendingCount = 0;
  let userStation = null;

  if (profile) {
    if (isAdmin) {
      try {
        const pending = await getPendingProfiles();
        pendingCount = pending.length;
      } catch (e) {
        console.error("Error fetching pending count for sidebar:", e);
      }
    } else {
      try {
        userStation = await getUserStation(profile.id);
      } catch (e) {
        console.error("Error fetching user station:", e);
      }
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex">
      {/* Automatic Expand Sidebar */}
      <DashboardSidebar
        profile={profile}
        isAdmin={isAdmin}
        pendingCount={pendingCount}
        userStationId={userStation?.id || null}
        userStationName={userStation?.name || null}
      />

      {/* Main Content Area (Offset for collapsed sidebar width on desktop) */}
      <div className="flex-1 min-w-0 lg:pl-[72px] flex flex-col min-h-screen">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
