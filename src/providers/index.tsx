import AuthRehydrator from "@/providers/auth-rehydrator";
import ProgressProvider from "@/providers/progress-provider";
import QueryProvider from "@/providers/query-provider";
import ReduxProvider from "@/providers/redux-provider";
import { NetworkStatus } from "@/components/shared/network-status";
import { ServerErrorDialog } from "@/components/shared/server-error-dialog";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <ReduxProvider>
        <QueryProvider>
          <AuthRehydrator>{children}</AuthRehydrator>
          <ServerErrorDialog />
          <NetworkStatus />
        </QueryProvider>
      </ReduxProvider>
    </ProgressProvider>
  );
}
