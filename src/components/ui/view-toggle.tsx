"use client";

import { LayoutGrid, LayoutList } from "lucide-react";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
  gridLabel?: string;
  listLabel?: string;
}

export function ViewToggle({
  mode,
  onChange,
  className = "",
  gridLabel = "Grid",
  listLabel = "List",
}: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="View layout switch"
      className={`inline-flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200/90 shadow-inner ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation min-h-[32px] ${
          mode === "grid"
            ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60"
        }`}
        aria-pressed={mode === "grid"}
        title="Switch to Grid View"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{gridLabel}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-manipulation min-h-[32px] ${
          mode === "list"
            ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60"
        }`}
        aria-pressed={mode === "list"}
        title="Switch to List View"
      >
        <LayoutList className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{listLabel}</span>
      </button>
    </div>
  );
}

