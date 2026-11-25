"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Printer,
  FileDown,
  X,
  CheckCircle2,
  Building2,
  Users,
  Truck,
  Ambulance,
  Shield,
  Eye,
  Sliders,
} from "lucide-react";
import type { StationAdministrativeRecord } from "@/services/administrative";
import { format } from "date-fns";

interface Props {
  records: StationAdministrativeRecord[];
  totals: {
    personnelMale: number;
    personnelFemale: number;
    personnelTotal: number;
    firetruckBfp: number;
    firetruckLgu: number;
    firetruckTotal: number;
    ambulanceBfp: number;
    ambulanceLgu: number;
    ambulanceTotal: number;
  };
  districtFilter: string;
  isOpen: boolean;
  onClose: () => void;
  onPrintNow: () => void;
}

export function downloadCsvReport(
  records: StationAdministrativeRecord[],
  totals: {
    personnelMale: number;
    personnelFemale: number;
    personnelTotal: number;
    firetruckBfp: number;
    firetruckLgu: number;
    firetruckTotal: number;
    ambulanceBfp: number;
    ambulanceLgu: number;
    ambulanceTotal: number;
  },
  districtFilter: string
) {
  const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const dateSlug = format(new Date(), "yyyy-MM-dd");

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Official BFP CSV Header Block
  const csvLines: string[] = [
    escapeCsv("BUREAU OF FIRE PROTECTION - PROVINCIAL HEADQUARTERS"),
    escapeCsv("Surigao del Norte Provincial Command • Operational Matrix"),
    escapeCsv(`Official Report Generated: ${currentDate}`),
    escapeCsv(`Station Scope / Category Filter: ${districtFilter === "all" ? "All Stations" : districtFilter}`),
    escapeCsv(`Total Stations Reported: ${records.length}`),
    "", // blank separator
    [
      "Station Name",
      "District",
      "Station Address",
      "Commander / Marshal",
      "Rank",
      "Designation",
      "Personnel (Male)",
      "Personnel (Female)",
      "Total Personnel",
      "Firetruck (BFP Owned)",
      "Firetruck (LGU Owned)",
      "Total Firetrucks",
      "Ambulance (BFP Owned)",
      "Ambulance (LGU Owned)",
      "Total Ambulances",
      "Operational Remarks",
    ]
      .map(escapeCsv)
      .join(","),
  ];

  // Data Rows
  records.forEach((r) => {
    csvLines.push(
      [
        r.stationName,
        r.district,
        r.address,
        r.marshalName,
        r.marshalRank,
        r.marshalPosition,
        r.personnelMale,
        r.personnelFemale,
        r.personnelTotal,
        r.firetruckBfp,
        r.firetruckLgu,
        r.firetruckTotal,
        r.ambulanceBfp,
        r.ambulanceLgu,
        r.ambulanceTotal,
        r.remarks,
      ]
        .map(escapeCsv)
        .join(",")
    );
  });

  // Summary Grand Totals Row
  csvLines.push("");
  csvLines.push(
    [
      "PROVINCIAL GRAND TOTAL",
      districtFilter === "all" ? "All Stations" : districtFilter,
      `${records.length} Fire Stations`,
      "All Command Marshals",
      "—",
      "—",
      totals.personnelMale,
      totals.personnelFemale,
      totals.personnelTotal,
      totals.firetruckBfp,
      totals.firetruckLgu,
      totals.firetruckTotal,
      totals.ambulanceBfp,
      totals.ambulanceLgu,
      totals.ambulanceTotal,
      "Official Consolidated Status",
    ]
      .map(escapeCsv)
      .join(",")
  );

  const csvContent = "\uFEFF" + csvLines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `BFP_Surigao_Administrative_Updates_${dateSlug}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportReportModal({
  records,
  totals,
  districtFilter,
  isOpen,
  onClose,
  onPrintNow,
}: Props) {
  const [preparedBy, setPreparedBy] = useState("SFO4 Pedro Penduko, BFP");
  const [preparedTitle, setPreparedTitle] = useState("Chief, Administrative Section");
  const [notedBy, setNotedBy] = useState("CINSP Rodolfo Alvarez, BFP");
  const [notedTitle, setNotedTitle] = useState("Provincial Operations Officer");
  const [approvedBy, setApprovedBy] = useState("CSUPT Maria Santos, BFP");
  const [approvedTitle, setApprovedTitle] = useState("Provincial Fire Marshal / Director");
  const [includeSignatories, setIncludeSignatories] = useState(true);

  if (!isOpen) return null;

  const handleDownloadExcel = () => {
    downloadCsvReport(records, totals, districtFilter);
  };

  const handlePrint = () => {
    onClose();
    // Allow modal to close and state to settle before invoking native print
    setTimeout(() => {
      onPrintNow();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-zinc-200 overflow-hidden my-6">
        {/* Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-red-600 to-red-700 text-white relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                <FileDown className="w-3 h-3" />
                <span>Export & Print Center</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Administrative Report Export
              </h2>
              <p className="text-xs text-red-100 max-w-lg">
                Generate official BFP Provincial Headquarters accomplishment reports for documentation, LGU submission, or archive.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics Bar */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Stations
              </span>
              <span className="text-lg font-black text-black">{records.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Personnel
              </span>
              <span className="text-lg font-black text-blue-700">{totals.personnelTotal}</span>
              <span className="text-[9px] text-zinc-500 block">{totals.personnelMale}M / {totals.personnelFemale}F</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Fire Engines
              </span>
              <span className="text-lg font-black text-red-700">{totals.firetruckTotal}</span>
              <span className="text-[9px] text-zinc-500 block">{totals.firetruckBfp} BFP / {totals.firetruckLgu} LGU</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Ambulances
              </span>
              <span className="text-lg font-black text-emerald-700">{totals.ambulanceTotal}</span>
              <span className="text-[9px] text-zinc-500 block">{totals.ambulanceBfp} BFP / {totals.ambulanceLgu} LGU</span>
            </div>
          </div>

          {/* Export Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Excel CSV */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-emerald-950">
                    Microsoft Excel / CSV
                  </h3>
                  <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    Download spreadsheet with full station metadata, disaggregated counts, and grand totals.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadExcel}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download .CSV Spreadsheet</span>
              </button>
            </div>

            {/* Card 2: Print & Save as PDF */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-red-200 bg-red-50/40 hover:bg-red-50/70 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-red-950">
                    Print / Save as PDF
                  </h3>
                  <p className="text-[11px] text-red-800 leading-relaxed mt-0.5">
                    Formatted for Landscape A4 paper with official BFP letterhead, high-contrast borders, and signatory sign-off block.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Open Print / PDF Preview</span>
              </button>
            </div>
          </div>

          {/* Signatory Settings for Print/PDF */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-500" />
                <h4 className="font-bold text-xs text-black uppercase tracking-wider">
                  Official Printout Signatories
                </h4>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSignatories}
                  onChange={(e) => setIncludeSignatories(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600 w-3.5 h-3.5"
                />
                <span>Include in Printout</span>
              </label>
            </div>

            {includeSignatories && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                {/* Prepared By */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Prepared By
                  </span>
                  <input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    placeholder="Name & Rank"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-[11px] font-semibold text-black"
                  />
                  <input
                    type="text"
                    value={preparedTitle}
                    onChange={(e) => setPreparedTitle(e.target.value)}
                    placeholder="Designation"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-[10px] text-zinc-500"
                  />
                </div>

                {/* Noted By */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Verified By
                  </span>
                  <input
                    type="text"
                    value={notedBy}
                    onChange={(e) => setNotedBy(e.target.value)}
                    placeholder="Name & Rank"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-[11px] font-semibold text-black"
                  />
                  <input
                    type="text"
                    value={notedTitle}
                    onChange={(e) => setNotedTitle(e.target.value)}
                    placeholder="Designation"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-[10px] text-zinc-500"
                  />
                </div>

                {/* Approved By */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Approved By
                  </span>
                  <input
                    type="text"
                    value={approvedBy}
                    onChange={(e) => setApprovedBy(e.target.value)}
                    placeholder="Name & Rank"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-[11px] font-semibold text-black"
                  />
                  <input
                    type="text"
                    value={approvedTitle}
                    onChange={(e) => setApprovedTitle(e.target.value)}
                    placeholder="Designation"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-[10px] text-zinc-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Helpful PDF Saving Instructions Tip */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed text-[11px]">
              <span className="font-bold block">How to save directly as PDF:</span>
              <p className="text-blue-800">
                Clicking <strong>&quot;Open Print / PDF Preview&quot;</strong> opens your browser&apos;s print dialog. Set your Destination to <strong>&quot;Save as PDF&quot;</strong> and select <strong>&quot;Landscape&quot;</strong> orientation for a complete, beautifully aligned government document.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-black hover:bg-zinc-200/70 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

