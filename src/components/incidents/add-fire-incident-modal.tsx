"use client";

import { useState } from "react";
import { addFireIncidentAction } from "@/app/actions/station";
import { Flame, PlusCircle, X, Loader2, AlertCircle, Upload, Image as ImageIcon, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  stationId: string;
}

export default function AddFireIncidentModal({ stationId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("stationId", stationId);

    const res = await addFireIncidentAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      setOpen(false);
      setSelectedImages([]);
      setSelectedDocuments([]);
      router.refresh();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedDocuments(files);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition-all red-glow flex items-center justify-center gap-1.5 shadow-md shrink-0 touch-manipulation min-h-[44px]"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Report Fire Incident</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-zinc-200 space-y-4 max-h-[92vh] overflow-y-auto overscroll-contain animate-scaleUp">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-black">Log Fire Suppression Incident</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold text-zinc-700">
              <div>
                <label className="block uppercase tracking-wider mb-1">Incident Type</label>
                <input
                  type="text"
                  name="incident_type"
                  required
                  placeholder="e.g. Commercial Structure Fire, Residential Fire, Electrical Post"
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">Exact Location / Address</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Purok 3, Barangay Washington, Surigao"
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 min-h-[42px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider mb-1">Alarm Severity</label>
                  <select
                    name="severity"
                    defaultValue="medium"
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 bg-white min-h-[42px]"
                  >
                    <option value="low">1st Alarm (Low)</option>
                    <option value="medium">2nd Alarm (Medium)</option>
                    <option value="high">3rd Alarm (High)</option>
                    <option value="critical">Task Force / General Alarm (Critical)</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider mb-1">Responding Fleet</label>
                  <input
                    type="text"
                    name="apparatus"
                    defaultValue="Engine-101"
                    placeholder="e.g. Engine 101, Tanker 2"
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1">Incident Description & Investigation Notes</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Details of the fire suppression operation, estimated structural damage, casualties, or cause..."
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-black text-sm sm:text-xs font-medium focus:outline-none focus:border-red-600 resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block uppercase tracking-wider mb-1">Attachments (Images & Documents)</label>
                
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="px-3 py-2.5 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-red-400 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-600 text-xs">Upload Incident Photos</span>
                      </div>
                      {selectedImages.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
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
                        onChange={handleDocumentChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="px-3 py-2.5 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-red-400 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-600 text-xs">Upload Documents (PDF, DOC)</span>
                        </div>
                        {selectedDocuments.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                            {selectedDocuments.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <select
                      name="document_category"
                      defaultValue="initial_report"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-black text-xs font-medium focus:outline-none focus:border-red-600 bg-white"
                    >
                      <option value="initial_report">Initial Report</option>
                      <option value="progress_report">Progress Report</option>
                      <option value="final_report">Final Report</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500">Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB per file)</p>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 active:bg-zinc-100 flex items-center justify-center min-h-[44px] touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold red-glow flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 min-h-[44px] touch-manipulation"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                  <span>Save Incident Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
