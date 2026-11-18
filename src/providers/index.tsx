import AuthRehydrator from "@/providers/auth-rehydrator";
import QueryProvider from "@/providers/query-provider";
import ReduxProvider from "@/providers/redux-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthRehydrator>{children}</AuthRehydrator>
      </QueryProvider>
    </ReduxProvider>
  );
}
