"use client";

import "./globals.css";

/** Last resort: runs when the root layout itself crashes. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
        <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Something went wrong</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The app ran into a problem. Reload to try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="h-10 rounded-lg bg-primary px-5 text-sm font-bold text-white"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
