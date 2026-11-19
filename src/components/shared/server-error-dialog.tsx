"use client";

import { useEffect } from "react";
import { ServerCrash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { setServerErrorHandler } from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store";
import { hideServerError, showServerError } from "@/store/slices/ui.slice";

/** Shown once when the server answers with an error (5xx) or can't be reached. */
export function ServerErrorDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.serverError);

  useEffect(() => {
    setServerErrorHandler(() => dispatch(showServerError()));
    return () => setServerErrorHandler(null);
  }, [dispatch]);

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && dispatch(hideServerError())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <span className="mx-auto mb-1 grid size-12 place-items-center rounded-full bg-gold-soft text-gold">
            <ServerCrash className="size-6" />
          </span>
          <AlertDialogTitle>Something went wrong on our end</AlertDialogTitle>
          <AlertDialogDescription>
            We&apos;re having trouble connecting right now. Please try again in a moment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={() => dispatch(hideServerError())}>
            Close
          </Button>
          <Button variant="gold" className="font-bold" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
