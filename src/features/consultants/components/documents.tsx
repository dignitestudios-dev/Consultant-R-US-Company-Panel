"use client";

import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { DocumentViewer } from "@/components/shared/document-viewer";
import { Button } from "@/components/ui/button";
import { fileExt } from "@/utils/format";
import type { DocLink } from "@/features/consultants/types/consultants.types";
import { useTrackEvent } from "@/features/consultants/hooks/use-track-event";

async function download(url: string, name: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("download failed");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name.replace(/[^\w.-]+/g, "_")}.${fileExt(url)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast.success("Download started");
  } catch {
    // Cross-origin storage may block fetch; let the browser download it directly.
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

export function DocumentList({
  docs,
  employeeId,
  track,
  empty,
}: {
  docs: DocLink[];
  employeeId: string;
  /** Resumes notify the consultant when opened or downloaded. */
  track?: boolean;
  empty: string;
}) {
  const send = useTrackEvent(employeeId);
  const [viewing, setViewing] = useState<DocLink | null>(null);

  if (docs.length === 0) {
    return (
      <p className="rounded-[10px] border border-dashed p-6 text-center text-sm text-muted-foreground">
        {empty}
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {docs.map((d) => (
        <li
          key={d.url}
          className="flex items-center gap-3 rounded-[10px] border bg-background/40 p-3"
        >
          <span className="grid size-10 flex-none place-items-center rounded-lg bg-gold-soft text-gold">
            <FileText className="size-5" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">{d.label}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (track) send("view-resume");
              setViewing(d);
            }}
          >
            <Eye /> View
          </Button>
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => {
              if (track) send("resume-downloaded");
              void download(d.url, d.label);
            }}
          >
            <Download /> Download
          </Button>
        </li>
      ))}
      <DocumentViewer
        url={viewing?.url ?? null}
        title={viewing?.label ?? "Document"}
        onClose={() => setViewing(null)}
      />
    </ul>
  );
}
