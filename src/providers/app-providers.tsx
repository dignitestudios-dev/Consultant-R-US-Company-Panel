"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeStore, type AppStore } from "@/store";
import { clearSession, hydrate } from "@/features/auth/store/auth-slice";
import { setSessionExpiredHandler } from "@/lib/api/client";
import { ROUTES } from "@/config/routes";
import { Toaster } from "@/components/ui/sonner";

function SessionBridge({ store, queryClient }: { store: AppStore; queryClient: QueryClient }) {
  const router = useRouter();

  useEffect(() => {
    store.dispatch(hydrate());
    setSessionExpiredHandler(() => {
      if (!store.getState().auth.token) return;
      store.dispatch(clearSession());
      queryClient.clear();
      router.replace(ROUTES.login);
    });
    return () => setSessionExpiredHandler(null);
  }, [store, queryClient, router]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionBridge store={store} queryClient={queryClient} />
        {children}
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </Provider>
  );
}
