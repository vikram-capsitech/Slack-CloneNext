import { ServerSidebar } from "@/components/organization/organization-sidebar";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile: any = await currentUser();
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full flex">
      <div className="w-60 flex-shrink-0 h-full">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="flex-1 overflow-y-auto h-full mx-auto">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
