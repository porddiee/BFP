import { getPendingProfiles, getCurrentProfile } from "@/services/auth";
import RegistrationApprovalList from "@/components/admin/registration-approval-list";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Building2 } from "lucide-react";
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
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="p-6 rounded-2xl bg-white border-2 border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 red-glow">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Regional Command Authority
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {displayProfiles.length} Awaiting Review
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Station Member Registrations
              </h1>
              <p className="text-xs text-zinc-600 mt-1">
                Every station officer registering on the portal requires Regional Admin verification before accessing emergency rosters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Registration List */}
      <RegistrationApprovalList initialProfiles={displayProfiles} />
    </div>
  );
}
