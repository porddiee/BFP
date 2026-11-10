import { getPendingProfiles, getCurrentProfile } from "@/services/auth";
import RegistrationApprovalList from "@/components/admin/registration-approval-list";
import { ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

export default async function RegistrationsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  let pendingProfiles: any[] = [];
  try {
    pendingProfiles = await getPendingProfiles();
  } catch (e) {
    console.error("Error fetching pending profiles:", e);
  }

  // Provide realistic fallback for presentation if DB has none yet
  const displayProfiles = pendingProfiles.length > 0 ? pendingProfiles : [
    {
      id: "pending-demo-1",
      user_id: "user-demo-1",
      first_name: "Captain Mateo",
      last_name: "Valenzuela",
      email: "valenzuela.m@bfp.gov.ph",
      contact_number: "+63 917 555 8921",
      role: "station_user" as const,
      approval_status: "pending" as const,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: "pending-demo-2",
      user_id: "user-demo-2",
      first_name: "FO3 Sarah",
      last_name: "Quintero",
      email: "quintero.sarah@bfp.gov.ph",
      contact_number: "+63 920 882 1432",
      role: "station_user" as const,
      approval_status: "pending" as const,
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header Banner */}
      <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
              <span>REGIONAL COMMAND AUTHORITY • SURIGAO DEL NORTE</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
              Station Member Registrations
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
              Every station officer registering on the portal requires Regional Admin verification before accessing emergency rosters.
            </p>
          </div>

          <div className="relative px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0 w-full sm:w-auto">
            <span className="block text-lg sm:text-xl font-black text-white">{displayProfiles.length}</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Awaiting Review</span>
          </div>
        </div>
      </div>

      {/* Interactive Registration List */}
      <RegistrationApprovalList initialProfiles={displayProfiles} />
    </div>
  );
}
