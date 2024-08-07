"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { useOrganization } from "@/providers/organization-provider";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { MainHeader } from "@/components/dashboard/header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { organization } = useOrganization();
  return (
    <div className="flex flex-col h-full dark:bg-[#1E1F22] bg-[#E3E5E8]">
      {/* Header */}
      <header className="flex-shrink-0 h-10 dark:text-white text-blue-950 flex items-center px-0.5 space-x-2 pl-2">
        <Image
          src={organization?.imageUrl!}
          alt="Channel"
          className="rounded-full ring-2 h-8 w-8"
          width={32}
          height={32}
        />
        <MainHeader organization={organization} serverId={organization?.id!} />
        {/* <h1 className="text-xl font-semibold">{organization?.name}</h1> */}
      </header>

      {/* Sidebar and Main Content Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className=" md:flex h-full w-[50px] flex-col inset-y-0 bg-[#1E1F22] text-white">
          <NavigationSidebar />
        </div>
        {/* Main Content */}
        <main className="flex-1 mt-0 p-2 pl-0 pt-0.5 bg-[#E3E5E8]">
          {/* Content area with full height and overflow handling */}
          <div className="h-full overflow-auto bg-white rounded-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
