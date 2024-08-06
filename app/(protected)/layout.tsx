import { auth } from "@/auth";
import { ModalProvider } from "@/providers/modal.providers";
import { OrganizationProvider } from "@/providers/organization-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <OrganizationProvider>
        <main className="flex flex-col bg-muted/40 h-screen">
          {children}
        </main>
      </OrganizationProvider>
    </SessionProvider>
  );
};

export default ProtectedLayout;
