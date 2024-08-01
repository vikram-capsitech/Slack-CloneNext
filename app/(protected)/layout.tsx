import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="flex h-full w-full flex-col bg-muted/40">
        {/* <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-400 to-zinc-600"> */}
        {children}
        {/* </div> */}
      </main>
    </SessionProvider>
  );
};

export default ProtectedLayout;
