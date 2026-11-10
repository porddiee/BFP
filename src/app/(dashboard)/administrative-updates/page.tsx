import { getAdministrativeUpdatesData } from "@/services/administrative";
import AdministrativeUpdatesTable from "@/components/administrative/administrative-updates-table";
import { getCurrentProfile } from "@/services/auth";

export default async function AdministrativeUpdatesPage() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";
  const records = await getAdministrativeUpdatesData();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header Banner - Strictly Following Dashboard Master Guide */}
      <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-40 sm:w-80 h-full bg-white/10 blur-[50px] sm:blur-[80px] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse" />
              <span>
                {isAdmin
                  ? "PROVINCIAL ADMINISTRATIVE MATRIX • SURIGAO DEL NORTE"
                  : "STATION ADMINISTRATIVE STATUS REPORT"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
              Administrative Updates
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-3xl leading-relaxed mt-1 sm:mt-1.5">
              Consolidated operational matrix of all fire stations across Surigao del Norte. Review assigned station commanders, gender-disaggregated personnel strength, and BFP vs. LGU apparatus fleet distribution.
            </p>
          </div>

          <div className="relative px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 text-center shrink-0 w-full sm:w-auto">
            <span className="block text-lg sm:text-xl font-black text-white">{records.length}</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-100">Stations Reported</span>
          </div>
        </div>
      </div>

      {/* Interactive Administrative Matrix Table */}
      <AdministrativeUpdatesTable initialRecords={records} />
    </div>
  );
}

