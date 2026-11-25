"use client";

import { useState } from "react";
import {
  Flame,
  Ambulance,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  X,
  Trash2,
  Loader2,
  Check,
  FileText,
  Image as ImageIcon,
  Download,
  Folder,
  ChevronDown,
  ChevronRight,
  Edit,
  ChevronLeft,
  ChevronRight as ChevronRightArrow,
  ZoomIn,
  ZoomOut,
  ExternalLink,
} from "lucide-react";
import {
  updateFireIncidentStatusAction,
  deleteFireIncidentAction,
  updateFireIncidentAction,
  updateEMSIncidentStatusAction,
  deleteEMSIncidentAction,
  updateEMSIncidentAction,
} from "@/app/actions/station";
import { useRouter } from "next/navigation";

export interface IncidentRecord {
  id: string;
  station_id: string;
  incident_type: string;
  location: string;
  description?: string | null;
  severity: "low" | "medium" | "high" | "critical";
  status: string;
  reported_at: string;
  created_at: string;
  resolved_at?: string | null;
  attachments?: Array<{ url: string; category: string; name: string }> | string[] | null;
}

interface Props {
  stationId: string;
  isOwner?: boolean;
  type: "fire" | "ems";
  incidents: IncidentRecord[];
}

export default function IncidentListView({
  stationId,
  isOwner = false,
  type,
  incidents,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IncidentRecord | null>(null);
  const [editTarget, setEditTarget] = useState<IncidentRecord | null>(null);
  const [actionError, setActionError] = useState("");
  const [expandedAttachments, setExpandedAttachments] = useState<Record<string, { tab: 'images' | 'files', subTab?: 'initial_report' | 'progress_report' | 'final_report' }>>({});
  const [imageViewer, setImageViewer] = useState<{ incidentId: string; urls: string[]; currentIndex: number } | null>(null);
  const [documentViewer, setDocumentViewer] = useState<{ incidentId: string; urls: string[]; currentIndex: number } | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"initial_report" | "progress_report" | "final_report">("initial_report");
  const router = useRouter();

  // Helper to normalize attachments (handle both old string[] and new object[] formats)
  const normalizeAttachments = (attachments: any): Array<{ url: string; category: string; name: string }> => {
    if (!attachments) return [];
    
    // If it's already the new format
    if (Array.isArray(attachments) && attachments.length > 0 && typeof attachments[0] === 'object') {
      return attachments;
    }
    
    // If it's the old format (string array), convert to new format
    if (Array.isArray(attachments) && typeof attachments[0] === 'string') {
      return attachments.map((url, idx) => {
        const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        const fileName = url.split('/').pop() || `File ${idx + 1}`;
        return {
          url,
          category: isImage ? 'image' : 'initial_report',
          name: fileName
        };
      });
    }
    
    return [];
  };

  const filtered = incidents.filter((inc) => {
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      inc.incident_type.toLowerCase().includes(q) ||
      inc.location.toLowerCase().includes(q) ||
      (inc.description && inc.description.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (incident: IncidentRecord, newStatus: string) => {
    setLoadingId(incident.id);
    setActionError("");

    const formData = new FormData();
    formData.append("stationId", stationId);
    formData.append("incidentId", incident.id);
    formData.append("status", newStatus);

    const res =
      type === "fire"
        ? await updateFireIncidentStatusAction(formData)
        : await updateEMSIncidentStatusAction(formData);

    if (res?.error) {
      setActionError(res.error);
      setLoadingId(null);
    } else {
      setLoadingId(null);
      router.refresh();
    }
  };

  const handleDelete = async (incident: IncidentRecord) => {
    setLoadingId(incident.id);
    setActionError("");

    const formData = new FormData();
    formData.append("stationId", stationId);
    formData.append("incidentId", incident.id);

    const res =
      type === "fire"
        ? await deleteFireIncidentAction(formData)
        : await deleteEMSIncidentAction(formData);

    if (res?.error) {
      setActionError(res.error);
      setLoadingId(null);
    } else {
      setLoadingId(null);
      setDeleteTarget(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${type === "fire" ? "fire calls" : "EMS runs"}, location, description...`}
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium min-h-[40px]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 overflow-x-auto">
          {["all", "active", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 capitalize ${
                statusFilter === st
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              {st === "all" ? "All Logs" : st}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Incidents List */}
      {filtered.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl space-y-2">
          {type === "fire" ? (
            <Flame className="w-8 h-8 text-zinc-400 mx-auto" />
          ) : (
            <Ambulance className="w-8 h-8 text-zinc-400 mx-auto" />
          )}
          <h3 className="text-sm font-bold text-black">No Incidents Found</h3>
          <p className="text-xs text-zinc-500">No logs matching current search filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inc) => {
            const isResolved = inc.status === "resolved";
            const isLoading = loadingId === inc.id;

            return (
              <div
                key={inc.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-zinc-200 hover:border-zinc-300 transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-mono font-bold">
                      {inc.id.substring(0, 8)}
                    </span>
                    <h3 className="text-base font-black text-black">{inc.incident_type}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inc.severity === "critical"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : inc.severity === "high"
                          ? "bg-orange-100 text-orange-800 border border-orange-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                        isResolved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{inc.status || "Active"}</span>
                    </span>

                    {/* Owner Action Buttons */}
                    {isOwner && (
                      <div className="flex items-center gap-1.5 ml-1">
                        <button
                          onClick={() => setEditTarget(inc)}
                          disabled={isLoading}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Edit Report"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {!isResolved && (
                          <button
                            onClick={() => handleStatusChange(inc, "resolved")}
                            disabled={isLoading}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                            title="Mark as Resolved"
                          >
                            {isLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            <span>Resolve</span>
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(inc)}
                          disabled={isLoading}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Location</span>
                    <span className="font-semibold text-black">{inc.location}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Reported Time</span>
                    <span className="font-semibold text-black">
                      {new Date(inc.reported_at || inc.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {inc.description && (
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">
                      Details & Notes
                    </span>
                    <p className="leading-relaxed">{inc.description}</p>
                  </div>
                )}

                {inc.attachments && (
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                    <button
                      onClick={() => {
                        const isExpanded = expandedAttachments[inc.id];
                        if (isExpanded) {
                          const newExpanded = { ...expandedAttachments };
                          delete newExpanded[inc.id];
                          setExpandedAttachments(newExpanded);
                        } else {
                          setExpandedAttachments({
                            ...expandedAttachments,
                            [inc.id]: { tab: 'images' }
                          });
                        }
                      }}
                      className="w-full flex items-center justify-between gap-2 text-zinc-700 hover:text-black transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-zinc-500" />
                        <span className="font-bold">Spot Report ({Array.isArray(inc.attachments) ? inc.attachments.length : 0})</span>
                      </div>
                      {expandedAttachments[inc.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {expandedAttachments[inc.id] && (
                      <div className="mt-3 space-y-3">
                        {/* Tab Buttons */}
                        <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-lg">
                          <button
                            onClick={() => setExpandedAttachments({
                              ...expandedAttachments,
                              [inc.id]: { tab: 'images' }
                            })}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                              expandedAttachments[inc.id]?.tab === 'images'
                                ? "bg-white text-black shadow-sm"
                                : "text-zinc-500 hover:text-black"
                            }`}
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Images ({normalizeAttachments(inc.attachments).filter(a => a.category === 'image')?.length || 0})</span>
                          </button>
                          <button
                            onClick={() => setExpandedAttachments({
                              ...expandedAttachments,
                              [inc.id]: { tab: 'files' }
                            })}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                              expandedAttachments[inc.id]?.tab === 'files'
                                ? "bg-white text-black shadow-sm"
                                : "text-zinc-500 hover:text-black"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Files/Documents ({normalizeAttachments(inc.attachments).filter(a => a.category !== 'image')?.length || 0})</span>
                          </button>
                        </div>

                        {/* Content based on selected tab */}
                        {expandedAttachments[inc.id]?.tab === 'images' && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {normalizeAttachments(inc.attachments).filter(a => a.category === 'image').map((attachment, idx) => {
                              const fileName = attachment.name || `Image ${idx + 1}`;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    const imageUrls = normalizeAttachments(inc.attachments).filter(a => a.category === 'image').map(a => a.url) || [];
                                    setImageViewer({
                                      incidentId: inc.id,
                                      urls: imageUrls,
                                      currentIndex: imageUrls.indexOf(attachment.url)
                                    });
                                  }}
                                  className="group relative block"
                                >
                                  <div className="aspect-video rounded-lg overflow-hidden bg-zinc-200 border border-zinc-300 group-hover:border-red-400 transition-colors">
                                    <img
                                      src={attachment.url}
                                      alt={fileName}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                      <span className="text-white text-[10px] font-bold">View</span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                            {normalizeAttachments(inc.attachments).filter(a => a.category === 'image').length === 0 && (
                              <div className="col-span-full py-8 text-center text-zinc-500 text-xs">
                                No images uploaded
                              </div>
                            )}
                          </div>
                        )}

                        {expandedAttachments[inc.id]?.tab === 'files' && !expandedAttachments[inc.id]?.subTab && (
                          <div className="space-y-2">
                            {(['initial_report', 'progress_report', 'final_report'] as const).map(category => {
                              const categoryFiles = normalizeAttachments(inc.attachments).filter(a => a.category === category);
                              const categoryLabel = category === 'initial_report' ? 'Initial Report' 
                                : category === 'progress_report' ? 'Progress Report' 
                                : 'Final Report';

                              return (
                                <button
                                  key={category}
                                  onClick={() => setExpandedAttachments({
                                    ...expandedAttachments,
                                    [inc.id]: { tab: 'files', subTab: category }
                                  })}
                                  className="w-full p-3 rounded-xl bg-white border border-zinc-200 hover:border-red-400 transition-colors flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-zinc-500" />
                                    <span className="text-xs font-bold text-zinc-700">{categoryLabel}</span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold">
                                    {categoryFiles.length}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {expandedAttachments[inc.id]?.tab === 'files' && expandedAttachments[inc.id]?.subTab && (
                          <div className="space-y-3">
                            <button
                              onClick={() => setExpandedAttachments({
                                ...expandedAttachments,
                                [inc.id]: { tab: 'files' }
                              })}
                              className="text-xs text-zinc-500 hover:text-black flex items-center gap-1"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Back to Categories</span>
                            </button>

                            {(() => {
                              const category = expandedAttachments[inc.id]?.subTab;
                              const categoryFiles = normalizeAttachments(inc.attachments).filter(a => a.category === category);
                              const categoryLabel = category === 'initial_report' ? 'Initial Report' 
                                : category === 'progress_report' ? 'Progress Report' 
                                : 'Final Report';

                              return (
                                <div key={category} className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                    {categoryLabel} ({categoryFiles.length})
                                  </h4>
                                  {categoryFiles.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {categoryFiles.map((attachment, idx) => {
                                        const fileName = attachment.name || `File ${idx + 1}`;
                                        return (
                                          <button
                                            key={idx}
                                            onClick={() => {
                                              const docUrls = normalizeAttachments(inc.attachments).filter(a => a.category === category).map(a => a.url) || [];
                                              setDocumentViewer({
                                                incidentId: inc.id,
                                                urls: docUrls,
                                                currentIndex: docUrls.indexOf(attachment.url)
                                              });
                                            }}
                                            className="group relative block"
                                          >
                                            <div className="aspect-video rounded-lg bg-zinc-100 border border-zinc-300 group-hover:border-red-400 transition-colors flex flex-col items-center justify-center gap-1 p-2">
                                              <FileText className="w-6 h-6 text-zinc-500" />
                                              <span className="text-[9px] text-zinc-600 text-center leading-tight line-clamp-2">
                                                {fileName}
                                              </span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="py-8 text-center text-zinc-500 text-xs bg-zinc-50 rounded-xl border border-zinc-200">
                                      No files in this category
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-zinc-200 space-y-4 animate-scaleUp">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-black">Delete Incident Report?</h3>
              <p className="text-xs text-zinc-600">
                Are you sure you want to permanently delete report <strong>#{deleteTarget.id.substring(0, 8)}</strong> ({deleteTarget.incident_type})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget)}
                disabled={loadingId === deleteTarget.id}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md disabled:opacity-50"
              >
                {loadingId === deleteTarget.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Incident Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-zinc-200 space-y-4 animate-scaleUp max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-black">
                  Edit {type === "fire" ? "Fire Incident" : "EMS Dispatch"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditTarget(null);
                  setSelectedImages([]);
                  setSelectedDocuments([]);
                  setSelectedCategory("initial_report");
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoadingId(editTarget.id);
                setActionError("");

                const formData = new FormData(e.currentTarget);
                formData.append("stationId", stationId);
                formData.append("incidentId", editTarget.id);

                const res =
                  type === "fire"
                    ? await updateFireIncidentAction(formData)
                    : await updateEMSIncidentAction(formData);

                if (res?.error) {
                  setActionError(res.error);
                  setLoadingId(null);
                } else {
                  setLoadingId(null);
                  setEditTarget(null);
                  setSelectedImages([]);
                  setSelectedDocuments([]);
                  setSelectedCategory("initial_report");
                  router.refresh();
                }
              }}
              className="space-y-3.5 text-xs font-bold text-zinc-700"
            >
              {actionError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div>
                <label className="block uppercase tracking-wider mb-1">
                  {type === "fire" ? "Incident Type" : "Medical Call Type"}
                </label>
                <input
                  type="text"
                  name="incident_type"
                  defaultValue={editTarget.incident_type}
                  required
                  placeholder={type === "fire" ? "e.g. Commercial Structure Fire" : "e.g. Vehicular Accident Trauma"}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-blue-600 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editTarget.location}
                  required
                  placeholder="e.g. Purok 3, Barangay Washington"
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-blue-600 min-h-[42px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider mb-1">
                    {type === "fire" ? "Alarm Severity" : "Triage Priority"}
                  </label>
                  <select
                    name="severity"
                    defaultValue={editTarget.severity}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-blue-600 bg-white min-h-[42px]"
                  >
                    {type === "fire" ? (
                      <>
                        <option value="low">1st Alarm (Low)</option>
                        <option value="medium">2nd Alarm (Medium)</option>
                        <option value="high">3rd Alarm (High)</option>
                        <option value="critical">Task Force / General Alarm (Critical)</option>
                      </>
                    ) : (
                      <>
                        <option value="critical">Priority 1 (Red / Immediate)</option>
                        <option value="medium">Priority 2 (Yellow / Delayed)</option>
                        <option value="low">Priority 3 (Green / Minor)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editTarget.status}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-blue-600 bg-white min-h-[42px]"
                  >
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">
                  {type === "fire" ? "Description & Investigation Notes" : "Patient Details & Medical Interventions"}
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editTarget.description || ""}
                  placeholder="Add or update details..."
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block uppercase tracking-wider mb-1">Add Attachments (Images & Documents)</label>
                
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="px-3 py-2.5 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-blue-400 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-600 text-xs">Add Incident Photos</span>
                      </div>
                      {selectedImages.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                          {selectedImages.length}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        name="documents"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) => setSelectedDocuments(Array.from(e.target.files || []))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="px-3 py-2.5 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-blue-400 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-600 text-xs">Add Documents (PDF, DOC)</span>
                        </div>
                        {selectedDocuments.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                            {selectedDocuments.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <select
                      name="document_category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="initial_report">Initial Report</option>
                      <option value="progress_report">Progress Report</option>
                      <option value="final_report">Final Report</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500">New files will be added to existing attachments. Current: {editTarget.attachments?.length || 0} files</p>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditTarget(null);
                    setSelectedImages([]);
                    setSelectedDocuments([]);
                    setSelectedCategory("initial_report");
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 active:bg-zinc-100 flex items-center justify-center min-h-[44px] touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingId === editTarget.id}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 min-h-[44px] touch-manipulation"
                >
                  {loadingId === editTarget.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Edit className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Viewer Overlay */}
      {imageViewer && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white text-sm font-bold">
                Image {imageViewer.currentIndex + 1} of {imageViewer.urls.length}
              </span>
              <button
                onClick={() => setImageViewer(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center bg-black/30 rounded-xl overflow-hidden">
              <img
                src={imageViewer.urls[imageViewer.currentIndex]}
                alt={`Incident image ${imageViewer.currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setImageViewer({
                  ...imageViewer,
                  currentIndex: imageViewer.currentIndex > 0 ? imageViewer.currentIndex - 1 : imageViewer.urls.length - 1
                })}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <a
                href={imageViewer.urls[imageViewer.currentIndex]}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <button
                onClick={() => setImageViewer({
                  ...imageViewer,
                  currentIndex: imageViewer.currentIndex < imageViewer.urls.length - 1 ? imageViewer.currentIndex + 1 : 0
                })}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRightArrow className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Overlay */}
      {documentViewer && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <span className="text-black text-sm font-bold">
                Document {documentViewer.currentIndex + 1} of {documentViewer.urls.length}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={documentViewer.urls[documentViewer.currentIndex]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setDocumentViewer(null)}
                  className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document */}
            <div className="flex-1 overflow-auto p-4">
              <iframe
                src={documentViewer.urls[documentViewer.currentIndex]}
                className="w-full h-full min-h-[500px] border-0"
                title="Document viewer"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4 border-t border-zinc-200">
              <button
                onClick={() => setDocumentViewer({
                  ...documentViewer,
                  currentIndex: documentViewer.currentIndex > 0 ? documentViewer.currentIndex - 1 : documentViewer.urls.length - 1
                })}
                className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setDocumentViewer({
                  ...documentViewer,
                  currentIndex: documentViewer.currentIndex < documentViewer.urls.length - 1 ? documentViewer.currentIndex + 1 : 0
                })}
                className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              >
                <ChevronRightArrow className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

