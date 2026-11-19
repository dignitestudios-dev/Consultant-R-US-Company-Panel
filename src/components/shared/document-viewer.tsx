"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { Download, ImageOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fileExt } from "@/utils/format";

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];

interface DocumentViewerProps {
  url: string | null;
  title: string;
  onClose: () => void;
}

/** Shows a document inside the app (image or PDF) instead of opening a new tab. */
export function DocumentViewer({ url, title, onClose }: DocumentViewerProps) {
  const isImage = !!url && IMAGE_EXT.includes(fileExt(url));
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = !!url && failedUrl === url;

  return (
    <Dialog.Root open={!!url} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 flex h-[88vh] w-[min(960px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border bg-card shadow-2xl transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0">
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <Dialog.Title className="min-w-0 flex-1 truncate text-sm font-bold">
              {title}
            </Dialog.Title>
            {url && (
              <Button
                variant="outline"
                size="sm"
                render={<a href={url} download target="_self" rel="noopener noreferrer" />}
              >
                <Download /> Download
              </Button>
            )}
            <Dialog.Close
              render={<Button variant="ghost" size="icon-sm" aria-label="Close viewer" />}
            >
              <X />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 bg-background/60">
            {url &&
              (failed ? (
                <div className="grid size-full place-items-center p-6 text-center">
                  <div className="space-y-2 text-muted-foreground">
                    <ImageOff className="mx-auto size-8" />
                    <p className="text-sm">
                      This file can&apos;t be previewed. Try downloading it.
                    </p>
                  </div>
                </div>
              ) : isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={title}
                  onError={() => setFailedUrl(url)}
                  className="size-full object-contain"
                />
              ) : (
                <iframe src={url} title={title} className="size-full border-0" />
              ))}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
